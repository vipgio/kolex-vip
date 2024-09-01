import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaSignature, FaRegTrashAlt, FaRegCheckCircle } from "react-icons/fa";
import { maxPrice, minPrice } from "@/config/config";
import LoadingSpin from "@/components/LoadingSpin";

const DelisterRow = ({ item, setListed, loading, setLoading, handleDelete, handleUpdate }) => {
	const [newPrice, setNewPrice] = useState(0);

	const updateItem = async () => {
		setLoading(true);
		const { result, error } = await handleUpdate(item.marketId, newPrice);
		if (result && result.success) {
			setListed((prev) => [
				...prev.filter((prv) => prv.marketId !== item.marketId),
				{
					...prev.find((prv) => prv.marketId === item.marketId),
					price: newPrice,
				},
			]);
			toast.success(
				`Updated the price of ${item.card.mintBatch}${item.card.mintNumber} ${item.card.title} to $${newPrice}!`,
				{
					toastId: item.marketId,
				}
			);
		}
		if (error) {
			toast.error(`${error.response.data.error}`, {
				toastId: item.marketId,
			});
		}
		setLoading(false);
	};

	const deleteItem = async () => {
		setLoading(true);
		const { result, error } = await handleDelete(item.marketId);
		if (result && result.success) {
			setListed((prev) => prev.filter((prv) => prv.marketId !== item.marketId));
			toast.success(
				`Removed ${item.card.mintBatch}${item.card.mintNumber} ${item.card.title} from the market!`,
				{
					toastId: item.marketId,
				}
			);
		}
		if (error) {
			toast.error(`${error.response.data.error}`, {
				toastId: item.marketId,
			});
		}
		setLoading(false);
	};

	return (
		<tr className='text-gray-custom border-b border-gray-300 bg-gray-100 text-center hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'>
			{item.type === "card" ? (
				<td
					className={`table-cell ${item.card.signatureImage ? "text-yellow-500" : ""}`}
					title={item.card.signatureImage && "Signed"}
				>
					<div className='flex items-center justify-center'>
						{item.card.signatureImage && <FaSignature className='mr-2' />}
						{item.card.mintBatch}
						{item.card.mintNumber}
					</div>
				</td>
			) : (
				<td className='table-cell'>
					{item.card.mintBatch}
					{item.card.mintNumber}
				</td>
			)}
			<td className='table-cell'>{item.card.title}</td>
			<td className='table-cell'>{item.card.inCirculation}</td>
			<td className='table-cell'>${item.price}</td>
			<td className='table-cell'>${item.card.floor}</td>
			<td className='table-cell'>{item.created.split("T")[0]}</td>
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
				<div className='flex justify-around'>
					{loading ? (
						<LoadingSpin size={4} />
					) : (
						<>
							<button
								className='cursor-pointer text-primary-500 active:text-primary-400 disabled:cursor-not-allowed disabled:text-gray-500'
								title='Update listing'
								onClick={updateItem}
								disabled={newPrice < minPrice}
							>
								<FaRegCheckCircle size={18} />
							</button>
							<button
								className='cursor-pointer text-red-500 active:text-red-400'
								title='Remove listing'
								onClick={deleteItem}
							>
								<FaRegTrashAlt size={18} />
							</button>
						</>
					)}
				</div>
			</td>
		</tr>
	);
};
export default DelisterRow;
