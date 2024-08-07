import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAxios } from "hooks/useAxios";
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
		<Transition appear show={showModal} as={Fragment}>
			<Dialog as='div' className='relative z-30' onClose={() => setShowModal(false)}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-black/80' />
				</Transition.Child>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4 text-center'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<Dialog.Panel className='w-full max-w-lg transform overflow-hidden rounded-xl bg-gray-200 p-4 text-left align-middle shadow-xl transition-all dark:bg-gray-700'>
								<Dialog.Title
									as='h3'
									className='mb-6 text-lg font-medium leading-6 text-gray-800 dark:text-gray-200'
								>
									Market info - {item.title}
								</Dialog.Title>
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
														<span>{`${item.card.mintBatch}${item.card.mintNumber}`}</span>
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
								<div className='mt-6'>
									<button type='button' className='button' onClick={() => setShowModal(false)}>
										Close
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};
export default PriceDetails;
