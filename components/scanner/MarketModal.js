import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { useAxios } from "@/hooks/useAxios";

import Dialog from "@/HOC/Dialog";

import LoadingSpin from "../LoadingSpin";

const MarketModal = ({ item, isOpen, setIsOpen }) => {
	const { fetchData, postData, patchData, deleteData } = useAxios();
	const [prices, setPrices] = useState([]);
	const [loading, setLoading] = useState(false);
	const [listPrice, setListPrice] = useState(0);
	const fetchPrices = async () => {
		setLoading(true);
		const { result } = await fetchData(`/api/market/item/${item.templateId}?page=1&type=${item.type}`);
		setPrices(result);
		setLoading(false);
	};

	useEffect(() => {
		fetchPrices();
	}, []);

	const listOnMarket = async () => {
		setLoading(true);
		const { result, error } = await postData(`/api/market/list/${item.id}`, {
			price: listPrice,
			type: item.type,
		});
		if (result) {
			toast.success(
				`Listed ${item.mintBatch}${item.mintNumber} ${item.title} on the market for $${listPrice}!`,
				{
					toastId: item.id,
				},
			);
		} else {
			console.error(error);
			toast.error(`Failed to list the item.`, { toastId: item.id });
			toast.error(error.response.data.error, {
				toastId: error.response.data.errorCode,
			});
		}
		setLoading(false);
	};

	const handleUpdate = async () => {
		const { result, error } = await patchData(`/api/market/listed/${item.marketId}`, {
			price: listPrice,
			minOffer: null,
		});
		if (error) {
			console.error(error);
			toast.error(`${error.response.data.error}`, {
				toastId: item.marketId,
			});
		} else {
			toast.success(
				`Price of ${item.mintBatch}${item.mintNumber} ${item.title} updated successfully to $${listPrice}!`,
				{
					toastId: item.marketId,
				},
			);
		}
	};

	const handleDelete = async () => {
		const { result, error } = await deleteData(`/api/market/listed/${item.marketId}`);
		if (error) {
			console.error(error);
			toast.error(`${error.response.data.error}`, {
				toastId: item.marketId,
			});
		} else {
			toast.success(
				`${item.mintBatch}${item.mintNumber} ${item.title} removed from market successfully!`,
				{
					toastId: item.marketId,
				},
			);
		}
	};

	return (
		<>
			<Dialog
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				title={
					<>
						{item.mintBatch}
						{item.mintNumber} {item.title}
					</>
				}
			>
				{loading ? (
					<LoadingSpin />
				) : (
					<div className='flex gap-5 flex-col'>
						<div className='flex max-h-52 overflow-auto rounded border text-gray-300'>
							<div className='mr-1 w-2/5 p-1'>
								<h3 className='font-semibold'>
									On Market: <span className='font-normal'>{prices.total}</span>
								</h3>

								<div className='mt-3 divide-y divide-opacity-50 divide-gray-300'>
									{prices.market?.[0]?.map((item) => (
										<div
											key={item.marketId}
											className='inline-flex w-full justify-between p-1'
										>
											<span>{`${item[item.type].mintBatch}${item[item.type].mintNumber}`}</span>
											<span>${item.price}</span>
										</div>
									))}
								</div>
							</div>
							<div className='ml-1 w-3/5 p-1'>
								<h3 className='font-semibold'>Recent Sales</h3>
								<div className='mt-3 divide-y divide-opacity-50 divide-gray-300'>
									{prices.recentSales?.map((sale) => (
										<div
											key={`${sale.entity.mintNumber}${sale.updated}`}
											className='inline-flex w-full justify-between p-1'
										>
											<span>{`${sale.entity.mintBatch}${sale.entity.mintNumber}`}</span>
											<span>{sale.updated.split("T")[0]}</span>
											<span>${sale.price}</span>
										</div>
									))}
								</div>
							</div>
						</div>
						<div>
							<label htmlFor='price'>List on market for: </label>
							<input
								type='number'
								name='price'
								id='price'
								className='input-field'
								value={listPrice}
								onChange={(e) => setListPrice(e.target.value)}
								min={0.1}
								max={10000}
								step={0.01}
							/>
						</div>
						<div className='w-full flex'>
							{item.marketId && (
								<button className='simple-button w-fit' onClick={handleDelete}>
									Remove
								</button>
							)}
							<button
								className={`submit-button ${item.marketId ? "w-fit ml-auto" : "w-full"}`}
								onClick={item.marketId ? handleUpdate : listOnMarket}
								disabled={listPrice <= 0}
							>
								{item.marketId ? "Update price" : "List"}
							</button>
						</div>
					</div>
				)}
			</Dialog>
		</>
	);
};
export default MarketModal;
