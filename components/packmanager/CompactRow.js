import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import minBy from "lodash/minBy";
import maxBy from "lodash/maxBy";
import { FaRegTrashAlt, FaRegCheckCircle } from "react-icons/fa";
import { maxPrice, minPrice } from "@/config/config";
import { useAxios } from "@/hooks/useAxios";
import LoadingSpin from "../LoadingSpin";

const CompactRow = ({ packs, setListed, insertFloor }) => {
	const { patchData, deleteData } = useAxios();
	const [newPrice, setNewPrice] = useState(0);
	const [loading, setLoading] = useState(false);

	const getBestPrice = (price, floor) => {
		if (price === floor) return floor;
		if (price > floor) return Math.max((floor * 100 - 1) / 100, minPrice);
		if (price < floor) return floor;
	};

	useEffect(() => {
		if (insertFloor && packs.length > 0) {
			setNewPrice(getBestPrice(minBy(packs, "price").price, packs[0].floor).toString());
		}
	}, [insertFloor]);

	const handleRemove = async () => {
		setLoading(true);
		let counter = 0;
		for (const pack of packs) {
			const { result, error } = await deleteData(`/api/market/listed/${pack.marketId}`);
			if (result && result.success) {
				counter++;
				setListed((prev) => prev.filter((prv) => prv.marketId !== pack.marketId));

				toast.isActive(pack.templateId)
					? toast.update(pack.templateId, {
							render: `Removed ${counter}x ${pack.title} from market!`,
					  })
					: toast.success(`Removed ${counter}x ${pack.title} from market!`, {
							toastId: pack.templateId,
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
		}
		setLoading(false);
	};

	const handleUpdate = async () => {
		setLoading(true);
		let counter = 0;
		for (const pack of packs) {
			const { result, error } = await patchData(`/api/market/listed/${pack.marketId}`, {
				price: newPrice,
				minOffer: null,
			});
			if (result && result.success) {
				counter++;
				setListed((prev) => [
					...prev.filter((prv) => prv.marketId !== pack.marketId),
					{
						...prev.find((prv) => prv.marketId === pack.marketId),
						price: newPrice,
					},
				]);
				toast.isActive(pack.templateId)
					? toast.update(pack.templateId, {
							render: `Updated the price of ${counter}x ${pack.title} to $${newPrice}!`,
					  })
					: toast.success(`Updated the price of ${counter}x ${pack.title} to $${newPrice}!`, {
							toastId: pack.templateId,
							position: "top-left",
					  });
			}
			if (error) {
				toast.error(`${error.response.data.error}`, {
					toastId: pack.marketId,
					position: "top-left",
				});
			}
		}
		setLoading(false);
	};

	return (
		<>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>{packs[0].title}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>{packs.length}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				{minBy(packs, "price").price == maxBy(packs, "price").price
					? `$${minBy(packs, "price").price}`
					: `$${minBy(packs, "price").price} - $${maxBy(packs, "price").price}`}
			</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>${packs[0].floor}</td>
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
								className='ml-2 cursor-pointer text-primary-500 active:text-primary-400 disabled:cursor-not-allowed disabled:text-gray-500'
								title='Update listing'
								onClick={handleUpdate}
								disabled={newPrice < minPrice}
							>
								<FaRegCheckCircle size={18} />
							</button>
							<button
								className='ml-auto mr-2 cursor-pointer text-red-500 active:text-red-400'
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
};
export default CompactRow;
