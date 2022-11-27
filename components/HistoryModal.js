import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaHistory } from "react-icons/fa";
import isEqual from "lodash/isEqual";
import LoadingSpin from "./LoadingSpin";
import { useAxios } from "hooks/useAxios";

const HistoryModal = React.memo(
	({ data, isOpen, setIsOpen }) => {
		const { fetchData } = useAxios();
		const [history, setHistory] = useState({});

		useEffect(() => {
			if (isOpen) {
				const getHistory = async (cardId) => {
					try {
						const { result } = await fetchData(`/api/cards/${cardId}`);
						result && setHistory(result);
					} catch (err) {
						console.log(err);
					}
				};
				getHistory(data.id ? data.id : data.card.id);
			}
		}, [isOpen]);

		const closeModal = () => setIsOpen(false);

		const openModal = () => setIsOpen(true);

		return (
			<>
				<div className='absolute flex items-center justify-center'>
					<button
						type='button'
						onClick={openModal}
						className='flex h-5 w-5 items-center justify-center rounded-full text-sm font-medium text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:text-gray-100'
					>
						<FaHistory />
					</button>
				</div>

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
									<Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-xl bg-gray-200 p-4 text-left align-middle shadow-xl transition-all dark:bg-gray-700'>
										<Dialog.Title
											as='h3'
											className='text-lg font-medium leading-6 text-gray-800 dark:text-gray-200'
										>
											{data.mintBatch ? data.mintBatch : data[data.type].mintBatch}
											{data.mintNumber
												? data.mintNumber
												: data[data.type].mintNumber}{" "}
											{data.title}
										</Dialog.Title>
										{history.history ? (
											<>
												<div className='mt-2 rounded border border-gray-400 p-1'>
													<div className='relative max-h-48 w-full divide-y divide-gray-500 overflow-auto overscroll-contain text-gray-700 dark:text-gray-300'>
														{history.history
															.slice()
															.reverse()
															.map((event) => (
																<Fragment key={`${event.created}`}>
																	{event.type === "mint" && (
																		<div>
																			<p>
																				Minted on{" "}
																				{event.created.replace("T", " ").split(".")[0]}
																			</p>
																		</div>
																	)}

																	{event.type === "pack" && (
																		<div>
																			<p>
																				<span className='font-medium text-green-600 dark:text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				opened from a pack.{" "}
																				<span className='block text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "spinner" && (
																		<div>
																			<p>
																				<span className='font-medium text-green-600 dark:text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				received the item from the spinner.{" "}
																				<span className='block text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "craft" && (
																		<div>
																			<p>
																				<span className='font-medium text-green-600 dark:text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				received the item from a craft.{" "}
																				<span className='block text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "qr-claim" && (
																		<div>
																			<p>
																				<span className='font-medium text-green-600 dark:text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				acquired from a QR code redemption.{" "}
																				<span className='block text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "achievement" && (
																		<div>
																			<p>
																				<span className='font-medium text-green-600 dark:text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				received the item from an achievement.{" "}
																				<span className='block text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "trade" && (
																		<div>
																			<p>
																				<span className='font-medium text-green-600 dark:text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				received the item from{" "}
																				<span className='font-medium text-red-400'>
																					{event.sender.username}{" "}
																				</span>
																				in a trade.{" "}
																				<span className='block text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "market" && (
																		<div>
																			<p>
																				<span className='font-medium text-green-600 dark:text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				purchased the item from{" "}
																				<span className='font-medium text-red-400'>
																					{event.sender.username}{" "}
																				</span>
																				for <span>{event.value} </span>
																				<span>
																					{event.costType === "usd" ? "USD. " : "coins. "}
																				</span>
																				<span className='block text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "imx-locked" && (
																		<div>
																			<p>
																				<span className='font-medium text-green-600 dark:text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				transferred the item to Immutable.{" "}
																				<span className='block text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "imx-unlocked" && (
																		<div>
																			<p>
																				<span className='font-medium text-green-600 dark:text-green-400'>
																					{event.receiver?.username}{" "}
																				</span>
																				Item was transferred to Kolex.{" "}
																				<span className='block text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "imx-market" && (
																		<div>
																			<p>
																				<span className='font-medium text-green-600 dark:text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				purchased the item from Immutable.{" "}
																				<span className='block text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "level-upgrade" && (
																		<div>
																			<p>
																				<span className='font-medium text-green-600 dark:text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				upgraded the card to level{" "}
																				<span className='font-medium text-red-400'>
																					{event.value}{" "}
																				</span>
																				<span className='block text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																</Fragment>
															))}
													</div>
												</div>
											</>
										) : (
											<div className='flex items-center justify-center pt-2'>
												<LoadingSpin />
											</div>
										)}

										<div className='mt-4'>
											<button type='button' className='button' onClick={closeModal}>
												Close
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
HistoryModal.displayName = "HistoryModal";
export default HistoryModal;
