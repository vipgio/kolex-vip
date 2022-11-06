import React, { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import isEqual from "lodash/isEqual";
import uniqBy from "lodash/uniqBy";
import sortBy from "lodash/sortBy";
import chunk from "lodash/chunk";
import { BsArrowLeftRight } from "react-icons/bs";
import { useAxios } from "hooks/useAxios";
import fixDecimal from "utils/NumberUtils";
import LoadingSpin from "../LoadingSpin";
import Tooltip from "../Tooltip";

const TradeInfoModal = React.memo(
	({ receive, send, isOpen, setIsOpen }) => {
		const { postData } = useAxios();
		const counter = useRef(0);
		const [loading, setLoading] = useState(false);
		const [pointDelta, setPointDelta] = useState({
			gain: 0,
			loss: 0,
		});
		const receiveSorted = sortBy(receive.items, ["mintBatch", "mintNumber"]);
		const receiveBest = uniqBy(receiveSorted, "templateId");
		const receiveBestSet = new Set(receiveBest.map((o) => o.id)); //list of best mints by id
		let unCheckedReceive = {
			...receive,
			items: receiveBest,
		};
		let unCheckedSend = send;

		const closeModal = () => setIsOpen(false);

		const handleLossPoints = (item) => {
			if (unCheckedSend.items.some((o) => o.id === item.id)) {
				const targetCollection = unCheckedSend.bestOwned.find(
					(col) => col.collectionId === item.collectionId
				);
				const targetItems = unCheckedSend.items.filter(
					(itemO) => itemO.collectionId === item.collectionId
				);
				unCheckedSend = {
					//remove the items that are calculated to prevent repeated items
					...unCheckedSend,
					items: unCheckedSend.items.filter(
						(item) => !targetItems.some((o) => o.id === item.id)
					),
				};
				const loss = getLoss(targetCollection.items, targetItems);
				setPointDelta((prev) => ({ ...prev, loss: (prev.loss += loss) }));
			}
		};

		const handleGainPoints = (item) => {
			if (unCheckedReceive.items.some((o) => o.id === item.id)) {
				const targetCollection = unCheckedReceive.bestOwned.find(
					(col) => col.collectionId === item.collectionId
				);
				const targetItems = unCheckedReceive.items.filter(
					(itemO) => itemO.collectionId === item.collectionId
				);
				unCheckedReceive = {
					//remove the items that are calculated to prevent repeated items
					...unCheckedReceive,
					items: unCheckedReceive.items.filter(
						(item) => !targetItems.some((o) => o.id === item.id)
					),
				};
				const gain = getDelta(targetCollection.items, targetItems);
				setPointDelta((prev) => ({ ...prev, gain: (prev.gain += gain) }));
			}
		};

		useEffect(() => {
			unCheckedReceive.items.map((item) => handleGainPoints(item));
			unCheckedSend.items.map((item) => handleLossPoints(item));
		}, []);

		const sendTrades = async () => {
			setLoading(true);
			const itemList = chunk([...send.items, ...receive.items], 50);
			for (const entities of itemList) {
				const payload = {
					userId: receive.id,
					entities: entities.map((item) => ({
						id: item.id,
						type: item.type,
					})),
				};
				const { result, error } = await postData("/api/trade/create-offer", payload);
				if (result && result.success) {
					closeModal();
					setLoading(false);
					counter.current++;
					counter.current === 1
						? toast.success(`Sent ${counter.current} trade to ${receive.owner}!`, {
								toastId: "success",
						  })
						: toast.update("success", {
								render: `Sent ${counter.current} trades to ${receive.owner}!`,
						  });
				} else {
					closeModal();
					console.log(error);
					toast.error(error.response.data.error, {
						toastId: error.response.data.errorCode,
					});
				}
			}
			setLoading(false);
		};

		return (
			<>
				<Transition appear show={isOpen} as={Fragment}>
					<Dialog as='div' className='relative z-40' onClose={closeModal}>
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
							<div className='flex min-h-full w-full items-center justify-center p-4 text-center'>
								<Transition.Child
									as={Fragment}
									enter='ease-out duration-300'
									enterFrom='opacity-0 scale-95'
									enterTo='opacity-100 scale-100'
									leave='ease-in duration-200'
									leaveFrom='opacity-100 scale-100'
									leaveTo='opacity-0 scale-95'
								>
									<Dialog.Panel className='flex h-[30rem] w-full max-w-2xl transform flex-col overflow-hidden rounded-2xl bg-gray-100 p-4 text-left align-middle shadow-xl transition-all dark:bg-gray-700'>
										<Dialog.Title
											as='h3'
											className='mb-1 text-lg font-medium leading-6 text-gray-800 dark:text-gray-300'
										>
											<div className='flex'>
												<div className='inline-flex items-center'>
													You
													<span className='mx-1 mt-1 text-orange-500'>
														<BsArrowLeftRight />
													</span>
													{receive.owner}
												</div>
												<div className='ml-auto inline-flex'>
													Trade delta:{" "}
													<div
														className={`ml-1 ${
															fixDecimal(pointDelta.gain + pointDelta.loss) > 0
																? "text-green-500"
																: "text-red-500"
														}`}
													>
														{fixDecimal(pointDelta.gain + pointDelta.loss)}
													</div>
												</div>
											</div>
										</Dialog.Title>
										<div className='flex'>
											<div className='w-1/2 px-1'>
												<div className='h-80 max-h-80 divide-y divide-gray-500 overflow-auto border border-gray-700 p-1 dark:border-gray-300 '>
													{sortBy(send.items, ["mintBatch", "mintNumber"]).map((item) => (
														<div
															key={item.id}
															className='flex text-gray-700 dark:text-gray-300'
														>
															<div className='w-4/5'>
																{item.mintBatch}
																{item.mintNumber} {item.title}
															</div>
															<div className='mr-1 ml-auto text-red-500'>
																{item.pointsToLose
																	? `-${fixDecimal(item.pointsToLose * 10)}`
																	: 0}
															</div>
														</div>
													))}
												</div>
												<div className='inline-flex items-center text-gray-700 dark:text-gray-300'>
													Total point loss:{" "}
													<span className='ml-1 text-red-500'>
														{fixDecimal(pointDelta.loss)}
													</span>
													<div>
														<Tooltip
															text='Numbers in front of each item could be inaccurate only if you trade 4+ of the same card. Total number is accurate.'
															direction='right'
														/>
													</div>
												</div>
											</div>
											<div className='w-1/2 px-1'>
												<div className='h-80 max-h-80 divide-y divide-gray-500 overflow-auto border border-gray-700 p-1 dark:border-gray-300 '>
													{receiveSorted.map((item) => (
														<div
															key={item.id}
															className='flex text-gray-700 dark:text-gray-300'
														>
															<div className='w-4/5'>
																{item.mintBatch}
																{item.mintNumber} {item.title}
															</div>
															<div className='mr-1 ml-auto text-green-500'>
																{isBestMint(item, receiveBestSet)
																	? `+${item.delta}`
																	: "+0"}
															</div>
														</div>
													))}
												</div>
												<div className='text-gray-700 dark:text-gray-300'>
													Total point gain:{" "}
													<span className='ml-1 text-green-500'>
														+{fixDecimal(pointDelta.gain)}
													</span>
												</div>
											</div>
										</div>
										<div className='mt-auto flex'>
											<button
												type='button'
												className='button'
												onClick={closeModal}
												disabled={loading}
											>
												Close
											</button>
											<button
												type='button'
												className='button ml-auto'
												onClick={sendTrades}
												disabled={loading}
											>
												{loading ? <LoadingSpin /> : "Send Trade"}
											</button>
										</div>
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</Dialog>
				</Transition>
			</>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
TradeInfoModal.displayName = "TradeInfoModal";
export default TradeInfoModal;

const getDelta = (items, owned) => {
	const initialPoints = items.reduce((acc, cur) => acc + cur.rating, 0);
	const newPoints = uniqBy(
		sortBy([...items, ...owned], ["mintBatch", "mintNumber"]),
		"templateId"
	).reduce((acc, cur) => acc + cur.rating, 0);
	const delta = newPoints - initialPoints;
	return fixDecimal(delta * 10);
};

const getLoss = (owned, items) => {
	const initialPoints = uniqBy(owned, "templateId").reduce(
		(acc, cur) => acc + cur.rating,
		0
	);
	const newOwned = uniqBy(
		owned.filter((ownedItem) => !items.some((item) => item.id === ownedItem.id)),
		"templateId"
	);
	const newPoints = newOwned.reduce((acc, cur) => acc + cur.rating, 0);

	const delta = newPoints - initialPoints;
	return fixDecimal(delta * 10);
};

const isBestMint = (item, list) => {
	return list.has(item.id);
};
