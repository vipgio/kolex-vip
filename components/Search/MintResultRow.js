import { useState } from "react";
import { FaSignature, FaLock, FaBan, FaHistory } from "react-icons/fa";
import HistoryModal from "../HistoryModal";

const MintResultRow = ({ item, allowed }) => {
	const [showHistory, setShowHistory] = useState(false);

	const openModal = () => {
		setShowHistory(true);
	};
	return (
		<tr className='border-b border-gray-300 bg-gray-100 text-center text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600'>
			<td
				className={`py-1 px-2 sm:py-3 sm:px-6 ${
					item.signatureImage ? "text-yellow-500" : ""
				}`}
				title={item.signatureImage && "Signed"}
			>
				<div className='flex items-center justify-center'>
					{item.signatureImage && <FaSignature className='mr-2' />}
					{item.mintBatch}
					{item.mintNumber}
				</div>
			</td>

			<td className='min-w-[10rem] py-1 px-2 sm:py-3 sm:px-6'>{item.title}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.id}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				{item.delta > 0 ? `+${item.delta}` : 0}
			</td>

			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				<a
					target='_blank'
					href={`https://kolex.gg/csgo/users/${item.owner.username}`}
					rel='noopener noreferrer'
					className='underline hover:text-orange-500'
				>
					{item.owner.username}
				</a>
			</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				<div className='relative flex h-8 items-center justify-center'>
					{allowed ? (
						item.type !== "card" ? (
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
export default MintResultRow;
