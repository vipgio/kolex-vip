import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import isEqual from "lodash/isEqual";
import { sortBy, uniqBy } from "lodash";
import { useEffect } from "react";
import { useState } from "react";
import fixDecimal from "utils/NumberUtils";

const TradeInfoModal = React.memo(
	({ receive, send, isOpen, setIsOpen }) => {
		const [pointGain, setPointGain] = useState(0);
		const [pointLoss, setPointLoss] = useState(0);
		let unCheckedReceive = receive;
		let unCheckedSend = send;
		// console.log("receive: ", receive);
		// console.log("send: ", send);

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
				// console.log(targetCollection.items, targetItems);
				const loss = getLoss(targetCollection.items, targetItems);
				console.log("loss: ", loss);
				// setPointLoss((prev) => (prev += loss));
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
				setPointGain((prev) => (prev += getDelta(targetCollection.items, targetItems)));
			}
		};

		useEffect(() => {
			unCheckedReceive.items.map((item) => handleGainPoints(item));
			unCheckedSend.items.map((item) => handleLossPoints(item));
		}, []);

		return (
			<>
				<Transition appear show={isOpen} as={Fragment}>
					<Dialog as='div' className='relative z-30' onClose={closeModal}>
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
											className='mb-1 text-lg font-medium leading-6 text-orange-500'
										>
											HEADER
										</Dialog.Title>
										<div className='flex'>
											<div className='w-1/2'>
												<div className='divide-y border'>
													{sortBy(send.items, ["mintBatch", "mintNumber"]).map((item) => (
														<div
															key={item.id}
															className='flex text-gray-700 dark:text-gray-300'
														>
															<div>
																{item.mintBatch}
																{item.mintNumber} {item.title}
															</div>
															<div className='mr-1 ml-auto text-orange-500'>
																{item.pointsToLose
																	? `-${fixDecimal(item.pointsToLose * 10)}`
																	: 0}
															</div>
														</div>
													))}
												</div>
												<div>Total point loss: {fixDecimal(pointLoss)}</div>
											</div>
											<div className='w-1/2'>
												<div className='divide-y border'>
													{sortBy(receive.items, ["mintBatch", "mintNumber"]).map(
														(item) => (
															<div
																key={item.id}
																className='flex text-gray-700 dark:text-gray-300'
															>
																<div>
																	{item.mintBatch}
																	{item.mintNumber} {item.title}
																</div>
																<div className='mr-1 ml-auto text-orange-500'>
																	{item.delta > 0 ? `+${item.delta}` : 0}
																</div>
															</div>
														)
													)}
												</div>
												<div>Total point gain: {fixDecimal(pointGain)}</div>
											</div>
										</div>
										<button type='button' className='button' onClick={closeModal}>
											Close
										</button>
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
	console.log("owned: ", owned);
	const initialPoints = uniqBy(owned, "templateId").reduce(
		(acc, cur) => acc + cur.rating,
		0
	);
	// console.log("initialPoints: ", initialPoints);
	const newOwned = owned.filter(
		(ownedItem) => !items.find((item) => item.id === ownedItem.id)
	);
	console.log("newOwned: ", newOwned);
	const newPoints = newOwned.reduce((acc, cur) => acc + cur.rating, 0);
	// console.log("newPoints: ", newPoints);
	const delta = newPoints - initialPoints;
	return fixDecimal(delta * 10);
};
