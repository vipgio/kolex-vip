import React, { Fragment, useState, useEffect } from "react";
import { FaHistory } from "react-icons/fa";
import isEqual from "lodash/isEqual";
import { historyEvents } from "@/config/config";
import { useAxios } from "@/hooks/useAxios";
import Dialog from "@/HOC/Dialog";
import LoadingSpin from "./LoadingSpin";

const HistoryModal = React.memo(
	({ data, isOpen, setIsOpen, type = "card", method = "id" }) => {
		const { fetchData } = useAxios();
		const [history, setHistory] = useState({});

		useEffect(() => {
			if (isOpen) {
				const getCardHistory = async (cardId, uuid) => {
					const url = method === "id" ? `/api/cards/${cardId}` : `/api/uuid/card?uuid=${uuid}`;
					try {
						const { result } = await fetchData(url);
						result && setHistory(result);
					} catch (err) {
						console.error(err);
					}
				};

				const getStickerHistory = async (uuid) => {
					try {
						const { result } = await fetchData(`/api/uuid/sticker?uuid=${uuid}`);
						result && setHistory(result);
					} catch (err) {
						console.error(err);
					}
				};

				type === "sticker" && getStickerHistory(data.uuid);
				if (type === "card") {
					method === "id" && getCardHistory(data.id ?? data.card.id);
					method === "uuid" && getCardHistory(null, data.uuid);
				}
			}
		}, [isOpen]);

		const closeModal = () => setIsOpen(false);

		const openModal = () => setIsOpen(true);

		const getDate = (event) => event.created.replace("T", " ").split(".")[0];

		return (
			<>
				<div className='absolute flex items-center justify-center'>
					<button
						type='button'
						onClick={openModal}
						className='text-gray-custom flex h-5 w-5 items-center justify-center rounded-full text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
					>
						<FaHistory />
					</button>
				</div>
				<Dialog
					title={
						data.mintBatch ? (
							<>
								{data.mintBatch ?? data[data.type].mintBatch}
								{data.mintNumber ?? data[data.type].mintNumber} {data.title}
							</>
						) : (
							<>
								{history?.mintBatch}
								{history?.mintNumber} {data.title}
							</>
						)
					}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
				>
					{history.history ? (
						<>
							<div className='mt-2 rounded border border-gray-400 p-1'>
								<div className='text-gray-custom relative max-h-48 w-full divide-y divide-gray-500 overflow-auto overscroll-contain px-1'>
									{history.history.toReversed().map((event) => (
										<Fragment key={`${event.created}`}>
											{event.type === "mint" && <div>Minted on {getDate(event)}</div>}
											{event.type in historyEvents && (
												<div>
													<p>
														<span className='font-medium text-green-600 dark:text-green-400'>
															{event.receiver?.username || event.sender?.username || "null"}{" "}
														</span>
														{historyEvents[event.type](event)}{" "}
														<span className='block text-gray-500'>{getDate(event)}</span>
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

					<div className='mt-4 flex'>
						<button type='button' className='button ml-auto' onClick={closeModal}>
							Close
						</button>
					</div>
				</Dialog>
			</>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
HistoryModal.displayName = "HistoryModal";
export default HistoryModal;
