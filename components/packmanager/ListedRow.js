import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { maxPrice, minPrice } from "@/config/config";
import { useAxios } from "@/hooks/useAxios";
import LoadingSpin from "../LoadingSpin";
import { CheckCircleIcon, TrashIcon } from "@/components/Icons";
import fixDecimal from "@/utils/NumberUtils";

const ListedRow = ({ pack, setListed, insertFloor }) => {
	const { patchData, deleteData } = useAxios();
	const [newPrice, setNewPrice] = useState(0);
	const [loading, setLoading] = useState(false);

	const getBestPrice = (price, floor) => {
		if (price === floor) return floor;
		if (price > floor) return Math.max((floor * 100 - 1) / 100, minPrice);
		if (price < floor) return floor;
	};

	useEffect(() => {
		if (insertFloor) {
			setNewPrice(fixDecimal(getBestPrice(pack.price, pack.floor)).toString());
		}
	}, [insertFloor]);

	const handleRemove = async () => {
		setLoading(true);
		const { result, error } = await deleteData(`/api/market/listed/${pack.marketId}`);
		if (result && result.success) {
			setListed((prev) => prev.filter((prv) => prv.marketId !== pack.marketId));
			toast.success(`Removed ${pack.title} from market!`, {
				toastId: pack.marketId,
				position: "top-left",
			});
		}
		if (error) {
			console.error(error);
			toast.error(`${error.response.data.error}`, {
				toastId: pack.marketId,
				position: "top-left",
			});
		}
		setLoading(false);
	};

	const handleUpdate = async () => {
		setLoading(true);
		setNewPrice(0);
		const { result, error } = await patchData(`/api/market/listed/${pack.marketId}`, {
			price: newPrice,
			minOffer: null,
		});
		if (result && result.success) {
			setListed((prev) => [
				...prev.filter((prv) => prv.marketId !== pack.marketId),
				{
					...prev.find((prv) => prv.marketId === pack.marketId),
					price: newPrice,
				},
			]);
			toast.success(`Updated the price of ${pack.title} to $${newPrice}!`, {
				toastId: pack.marketId,
				position: "top-left",
			});
		}
		if (error) {
			toast.error(`${error.response.data.error}`, {
				toastId: pack.marketId,
				position: "top-left",
			});
		}
		setLoading(false);
	};

	return (
		<>
			<td className='table-cell min-w-[10rem]'>{pack.title}</td>
			<td className='table-cell'>{pack.minted}</td>
			<td className='table-cell'>${pack.price}</td>
			<td className='table-cell'>${pack.floor}</td>
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
								className='my-outline ml-2 rounded p-1 text-primary-500 hover:text-primary-600 active:text-primary-700 disabled:text-gray-500'
								title='Update listing'
								onClick={handleUpdate}
								disabled={newPrice < minPrice}
							>
								<CheckCircleIcon size={18} />
							</button>
							<button
								className='my-outline ml-auto mr-2 rounded p-1 text-red-500 hover:text-red-600 active:text-red-700'
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
};
export default ListedRow;
