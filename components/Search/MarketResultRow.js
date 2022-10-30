import { useState } from "react";
import { FaSignature, FaLock, FaBan, FaHistory } from "react-icons/fa";
import HistoryModal from "../HistoryModal";

const MarketResultRow = ({ item, allowed }) => {
	const [showHistory, setShowHistory] = useState(false);

	const openModal = () => {
		setShowHistory(true);
	};

	return (
		<tr className='border-b border-gray-300 bg-gray-100 text-center text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600'>
			{item.card ? (
				<td
					className={`py-1 px-2 sm:py-3 sm:px-6 ${
						item.card.signatureImage ? "text-yellow-500" : ""
					}`}
					title={item.card.signatureImage && "Signed"}
				>
					<div className='flex items-center justify-center'>
						{item.card.signatureImage && <FaSignature className='mr-2' />}
						{item.card.mintBatch}
						{item.card.mintNumber}
					</div>
				</td>
			) : (
				<td className='py-1 px-2 sm:py-3 sm:px-6'>
					{item.sticker.mintBatch}
					{item.sticker.mintNumber}
				</td>
			)}
			<td className='min-w-[10rem] py-1 px-2 sm:py-3 sm:px-6'>{item.title}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>${item.price}</td>
			<td className='hidden h-full min-w-[10rem] items-end py-1 px-2 sm:table-cell sm:py-3 sm:px-6'>
				{item.minOffer ? `$${item.minOffer}` : "-"}
			</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				{item.delta > 0 ? `+${item.delta}` : 0}
			</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				<a
					target='_blank'
					href={`https://kolex.gg/csgo/users/${item.user.username}`}
					rel='noopener noreferrer'
					className='underline hover:text-orange-500'
				>
					{item.user.username}
				</a>
			</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				<a
					href={`https://kolex.gg/csgo/marketplace/${item.type}/${
						item.card ? item.card.cardTemplateId : item.sticker.stickerTemplateId
					}/${item.marketId}`}
					target='_blank'
					rel='noopener noreferrer'
					className='text-orange-500 underline'
				>
					Click
				</a>
			</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				<div className='relative flex h-8 items-center justify-center'>
					{allowed ? (
						item.type === "sticker" ? (
							<FaBan title="Doesn't work with stickers" />
						) : showHistory ? (
							<HistoryModal data={item} isOpen={showHistory} setIsOpen={setShowHistory} />
						) : (
							<button onClick={openModal}>
								<FaHistory />
							</button>
						)
					) : (
						<FaLock
							className='cursor-not-allowed'
							title='You need history access for this feature'
						/>
					)}
				</div>
			</td>
		</tr>
	);
};
export default MarketResultRow;
