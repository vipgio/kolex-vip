import { memo, useState, useEffect } from "react";
import isEqual from "lodash/isEqual";
import { toast } from "react-toastify";
import { maxPrice, minPrice } from "@/config/config";
import { useAxios } from "@/hooks/useAxios";
import LoadingSpin from "../LoadingSpin";
import { SignatureIcon, TrashIcon, CheckCircleIcon, RotateIcon } from "@/components/Icons";
import fixDecimal from "@/utils/NumberUtils";

const ListedRow = memo(
	({ item, setListed, insertFloor }) => {
		const { patchData, deleteData, fetchData } = useAxios();
		const [newPrice, setNewPrice] = useState(0);
		const [floor, setFloor] = useState(item.floor);
		const [loading, setLoading] = useState(false);

		useEffect(() => {
			if (insertFloor && floor) {
				setNewPrice(
					(floor * 100 - 0.01 * 100) / 100 >= minPrice
						? fixDecimal((floor * 100 - 0.01 * 100) / 100).toString()
						: floor.toString()
				);
			}
		}, [insertFloor]);

		const handleRemove = async () => {
			setLoading(true);
			const { result, error } = await deleteData(`/api/market/listed/${item.marketId}`);
			if (result && result.success) {
				setListed((prev) => prev.filter((prv) => prv.marketId !== item.marketId));
				toast.success(`Removed ${item.title} from market!`, {
					toastId: item.marketId,
				});
			}
			if (error) {
				console.error(error);
				toast.error(`${error.response.data.error}`, {
					toastId: item.marketId,
				});
			}
			setLoading(false);
		};

		const fetchFloor = async () => {
			setLoading(true);
			const { result, error } = await fetchData(
				`/api/market/item/${item.templateId}?page=1&type=${item.type}`
			);
			if (result) {
				if (result.market && result.market[0] && result.market[0][0]) {
					setFloor(() => result.market[0][0].price);
				}
			}
			if (error) {
				console.error(error);
				toast.error(`${error.response.data.error}`, {
					toastId: item.marketId,
				});
			}
			setLoading(false);
		};

		const handleUpdate = async () => {
			setLoading(true);
			const { result, error } = await patchData(`/api/market/listed/${item.marketId}`, {
				price: newPrice,
				minOffer: null,
			});
			if (result && result.success) {
				setListed((prev) => [
					...prev.filter((prv) => prv.marketId !== item.marketId),
					{
						...prev.find((prv) => prv.marketId === item.marketId),
						price: newPrice,
					},
				]);
				toast.success(`Updated the price of ${item.title} to $${newPrice}!`, {
					toastId: item.marketId,
				});
			}
			if (error) {
				toast.error(`${error.response.data.error}`, {
					toastId: item.marketId,
				});
			}
			setLoading(false);
		};

		return (
			<>
				{item.type === "card" ? (
					<td
						className={`table-cell ${item.signatureImage ? "text-yellow-500" : ""}`}
						title={item.signatureImage && "Signed"}
					>
						<div className='flex items-center justify-center'>
							{item.signatureImage && <SignatureIcon className='mr-2' />}
							{item.mintBatch}
							{item.mintNumber}
						</div>
					</td>
				) : (
					<td className='table-cell'>
						{item.mintBatch}
						{item.mintNumber}
					</td>
				)}
				<td className='table-cell min-w-[10rem]'>{item.title}</td>
				<td className='table-cell'>{item.circulation}</td>
				<td className='table-cell'>${item.price}</td>
				<td className='table-cell'>{floor ? `$${floor}` : `-`}</td>
				<td className='table-cell'>
					<input
						type='number'
						name='price'
						id='price'
						step={0.01}
						min={minPrice}
						max={maxPrice}
						value={newPrice}
						className='input-field w-20'
						onChange={(e) => setNewPrice(e.target.value)}
					/>
				</td>
				<td className='py-1 px-2'>
					<div className='flex justify-center'>
						{loading ? (
							<LoadingSpin size={4} />
						) : (
							<>
								<button
									className='ml-1 mr-auto text-primary-500 active:text-primary-400'
									title='Update listing'
									onClick={handleUpdate}
									disabled={newPrice < minPrice}
								>
									<CheckCircleIcon size={18} />
								</button>
								{item.floor ? null : (
									<button
										className='mx-auto cursor-pointer text-gray-300 active:text-gray-200'
										title='Get floor price'
										onClick={fetchFloor}
									>
										<RotateIcon size={18} />
									</button>
								)}
								<button
									className='ml-auto mr-1 cursor-pointer text-red-500 active:text-red-400'
									title='Remove listing'
									onClick={handleRemove}
								>
									<TrashIcon size={18} />
								</button>
							</>
						)}
					</div>
				</td>
			</>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
ListedRow.displayName = "ListedRow";
export default ListedRow;
