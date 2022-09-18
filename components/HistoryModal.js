import React, { Fragment, useState, useEffect, useContext } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { FaHistory, FaLock } from "react-icons/fa";
import isEqual from "lodash/isEqual";
import { UserContext } from "context/UserContext";

const HistoryModal = React.memo(
	({ data }) => {
		const { user } = useContext(UserContext);
		const [isOpen, setIsOpen] = useState(false);
		const [history, setHistory] = useState([]);

		useEffect(() => {
			if (isOpen) {
				const getHistory = async (cardId) => {
					try {
						const { data } = await axios.get(`/api/cards/${cardId}`, {
							headers: {
								jwt: user.jwt,
							},
						});
						setHistory(data);
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
						className='rounded-md bg-black bg-opacity-20 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
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
									<Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-700 p-4 text-left align-middle shadow-xl transition-all'>
										<Dialog.Title
											as='h3'
											className='text-lg font-medium leading-6 text-gray-200'
										>
											{data.mintBatch ? data.mintBatch : data.card.mintBatch}
											{data.mintNumber ? data.mintNumber : data.card.mintNumber}{" "}
											{data.title}
										</Dialog.Title>
										{history.data ? (
											<>
												<div className='mt-2 border border-gray-400 p-1'>
													<div className='relative max-h-48 w-full divide-y divide-gray-500 overflow-auto overscroll-contain text-gray-300'>
														{history.data.history
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
																				<span className='text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				opened from a pack.{" "}
																				<span className='text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "spinner" && (
																		<div>
																			<p>
																				<span className='text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				received the item from the spinner.{" "}
																				<span className='text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "craft" && (
																		<div>
																			<p>
																				<span className='text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				received the item from a craft.{" "}
																				<span className='text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "qr-claim" && (
																		<div>
																			<p>
																				<span className='text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				acquired from a QR code redemption.{" "}
																				<span className='text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "achievement" && (
																		<div>
																			<p>
																				<span className='text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				received the item from an achievement.{" "}
																				<span className='text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "trade" && (
																		<div>
																			<p>
																				<span className='text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				received the item from{" "}
																				<span className='text-red-400'>
																					{event.sender.username}{" "}
																				</span>
																				in a trade.{" "}
																				<span className='text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "market" && (
																		<div>
																			<p>
																				<span className='text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				purchased the item from{" "}
																				<span className='text-red-400'>
																					{event.sender.username}{" "}
																				</span>
																				for <span>{event.value} </span>
																				<span>
																					{event.costType === "usd" ? "USD. " : "coins. "}
																				</span>
																				<span className='text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "imx-locked" && (
																		<div>
																			<p>
																				<span className='text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				transferred the item to Immutable.{" "}
																				<span className='text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "imx-unlocked" && (
																		<div>
																			<p>
																				<span className='text-green-400'>
																					{event.receiver?.username}{" "}
																				</span>
																				Item was transferred to Epics.{" "}
																				<span className='text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "imx-market" && (
																		<div>
																			<p>
																				<span className='text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				purchased the item from Immutable.{" "}
																				<span className='text-gray-500'>
																					{event.created.replace("T", " ").split(".")[0]}
																				</span>
																			</p>
																		</div>
																	)}
																	{event.type === "level-upgrade" && (
																		<div>
																			<p>
																				<span className='text-green-400'>
																					{event.receiver.username}{" "}
																				</span>
																				upgraded the card to level{" "}
																				<span className='text-red-400'>
																					{event.value}{" "}
																				</span>
																				<span className='text-gray-500'>
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
											<div className='mt-3 h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-gray-700'></div>
										)}

										<div className='mt-4'>
											<button
												type='button'
												className='inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-orange-500 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 active:bg-gray-300 active:shadow-lg'
												onClick={closeModal}
											>
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