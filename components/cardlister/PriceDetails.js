import { useEffect, useState } from "react";
import { useAxios } from "@/hooks/useAxios";
import Dialog from "@/HOC/Dialog";
import LoadingSpin from "../LoadingSpin";
const PriceDetails = ({ item, showModal, setShowModal }) => {
	const { fetchData } = useAxios();
	const [prices, setPrices] = useState([]);
	const [loading, setLoading] = useState(false);
	const fetchPrices = async () => {
		setLoading(true);
		const { result } = await fetchData(`/api/market/item/${item.id}?page=1&type=${item.type}`);
		setPrices(result);
		setLoading(false);
	};
	useEffect(() => {
		fetchPrices();
	}, []);
	return (
		<Dialog
			isOpen={showModal}
			setIsOpen={setShowModal}
			title={`Market info - ${item.title}`}
			closeButton={true}
		>
			{loading ? (
				<LoadingSpin />
			) : (
				<div className='flex max-h-52 overflow-auto rounded border text-gray-300'>
					<div className='mr-1 w-2/5 p-1'>
						<h3 className='font-semibold'>
							On Market: <span className='font-normal'>{prices.total}</span>
						</h3>

						<div className='mt-3 divide-y'>
							{prices.market?.[0]?.map((item) => (
								<div key={item.marketId} className='inline-flex w-full justify-between px-1'>
									<span>{`${item[item.type].mintBatch}${item[item.type].mintNumber}`}</span>
									<span>${item.price}</span>
								</div>
							))}
						</div>
					</div>
					<div className='ml-1 w-3/5 p-1'>
						<h3 className='font-semibold'>Recent Sales</h3>
						<div className='mt-3 divide-y'>
							{prices.recentSales?.map((sale) => (
								<div
									key={`${sale.entity.mintNumber}${sale.updated}`}
									className='inline-flex w-full justify-between px-1'
								>
									<span>{`${sale.entity.mintBatch}${sale.entity.mintNumber}`}</span>
									<span>{sale.updated.split("T")[0]}</span>
									<span>${sale.price}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</Dialog>
	);
};
export default PriceDetails;
