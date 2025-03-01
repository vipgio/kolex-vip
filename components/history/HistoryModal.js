import { memo, useEffect, useState } from "react";

import isEqual from "lodash/isEqual";

import { useAxios } from "@/hooks/useAxios";

import Dialog from "@/HOC/Dialog";

import { HistoryIcon } from "@/components/Icons";
import LoadingSpin from "@/components/LoadingSpin";

import HistoryContent from "./HistoryContent";

const HistoryModal = memo(
	({ data, isOpen, setIsOpen, type = "card", method = "id" }) => {
		console.log("rendering HistoryModal");
		const { fetchData } = useAxios();
		const [item, setItem] = useState({});

		useEffect(() => {
			if (isOpen) {
				const getCardHistory = async (cardId, uuid) => {
					const url = method === "id" ? `/api/cards/${cardId}` : `/api/uuid/card?uuid=${uuid}`;
					try {
						const { result } = await fetchData(url);
						result && setItem(result);
					} catch (err) {
						console.error(err);
					}
				};

				const getStickerHistory = async (uuid) => {
					try {
						const { result } = await fetchData(`/api/uuid/sticker?uuid=${uuid}`);
						result && setItem(result);
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

		return (
			<>
				<div className='absolute flex items-center justify-center'>
					<button
						type='button'
						onClick={openModal}
						className='text-gray-custom my-outline flex h-5 w-5 items-center justify-center rounded-full font-medium'
					>
						<HistoryIcon />
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
								{item?.mintBatch}
								{item?.mintNumber} {data.title}
							</>
						)
					}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
				>
					{item.history ? (
						<>
							<div className='mt-2 rounded border border-gray-400 p-1'>
								<div className='text-gray-custom relative max-h-48 w-full divide-y divide-gray-500 overflow-auto overscroll-contain px-1'>
									<HistoryContent item={item} />
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
	(oldProps, newProps) => isEqual(oldProps, newProps),
);
HistoryModal.displayName = "HistoryModal";
export default HistoryModal;
