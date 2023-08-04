import React, { useState, useEffect } from "react";
import isEqual from "lodash/isEqual";
import { toast } from "react-toastify";
import { FaSignature, FaRegTrashAlt, FaRegCheckCircle } from "react-icons/fa";
import { maxPrice, minPrice } from "@/config/config";
import { useAxios } from "hooks/useAxios";
import LoadingSpin from "../LoadingSpin";

const ListedRow = React.memo(
	({ item, setListed, insertFloor }) => {
		const { patchData, deleteData } = useAxios();
		const [newPrice, setNewPrice] = useState(0);
		const [loading, setLoading] = useState(false);

		useEffect(() => {
			if (insertFloor) {
				setNewPrice(
					(item.floor * 100 - 0.01 * 100) / 100 >= minPrice
						? ((item.floor * 100 - 0.01 * 100) / 100).toString()
						: item.floor.toString()
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
				console.log(error);
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
						...prev.filter((prv) => prv.marketId === item.marketId)[0],
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
						className={`py-1 px-2 sm:py-3 sm:px-6 ${
							item.signatureImage ? "text-yellow-500" : ""
						}`}
						title={item.signatureImage && "Signed"}
					>
						<div className='flex items-center justify-center'>
							{item.signatureImage && <FaSignature className='mr-2' />}
							{item.mintBatch}
							{item.mintNumber}
						</div>
					</td>
				) : (
					<td className='py-1 px-2 sm:py-3 sm:px-6'>
						{item.mintBatch}
						{item.mintNumber}
					</td>
				)}
				<td className='min-w-[10rem] py-1 px-2 sm:py-3 sm:px-6'>{item.title}</td>
				<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.circulation}</td>
				<td className='py-1 px-2 sm:py-3 sm:px-6'>${item.price}</td>
				<td className='py-1 px-2 sm:py-3 sm:px-6'>${item.floor}</td>
				<td className='py-1 px-2 sm:py-3 sm:px-6'>
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
									className='text-primary-500 active:text-primary-400 ml-1 cursor-pointer disabled:cursor-not-allowed disabled:text-gray-500'
									title='Update listing'
									onClick={handleUpdate}
									disabled={newPrice < minPrice}
								>
									<FaRegCheckCircle size={18} />
								</button>
								<button
									className='ml-auto mr-1 cursor-pointer text-red-500 active:text-red-400'
									title='Remove listing'
									onClick={handleRemove}
								>
									<FaRegTrashAlt size={18} />
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
