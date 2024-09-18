import { useState } from "react";
import { FaSignature, FaLock, FaHistory } from "react-icons/fa";
import { webApp } from "@/config/config";
import HistoryModal from "@/components/history/HistoryModal";

const MintResultRow = ({ item, allowed }) => {
	const [showHistory, setShowHistory] = useState(false);

	const openModal = () => {
		setShowHistory(true);
	};
	return (
		<tr className='text-gray-custom border-b border-gray-300 bg-gray-100 text-center hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'>
			<td
				className={`table-cell ${item.signatureImage ? "text-yellow-500" : ""}`}
				title={item.signatureImage && "Signed"}
			>
				<div className='flex items-center justify-center'>
					{item.signatureImage && <FaSignature className='mr-2' />}
					{item.mintBatch}
					{item.mintNumber}
				</div>
			</td>

			<td className='table-cell min-w-[10rem]'>{item.title}</td>
			<td className='table-cell'>{item.id}</td>
			<td className='table-cell'>{item.delta > 0 ? `+${item.delta}` : 0}</td>

			<td className='table-cell'>
				<a
					target='_blank'
					href={`${webApp}/user/${item.owner.username}`}
					rel='noopener noreferrer'
					className='hover:text-primary-500 hover:underline hover:underline-offset-2'
					title={item.owner.id}
				>
					{item.owner.username}
				</a>
			</td>
			<td className='table-cell'>
				<a
					href={`${webApp}/${item.type}/${item.templateUUID}/${item.uuid}`}
					target='_blank'
					rel='noopener noreferrer'
					className='text-primary-500 underline'
				>
					Click
				</a>
			</td>
			<td className='table-cell'>
				<div className='relative flex h-8 items-center justify-center text-gray-200'>
					{allowed ? (
						item.type === "card" ? (
							<HistoryModal
								data={item}
								isOpen={showHistory}
								setIsOpen={setShowHistory}
								type='card'
								method='uuid'
							/>
						) : item.type === "sticker" ? (
							<HistoryModal data={item} isOpen={showHistory} setIsOpen={setShowHistory} type='sticker' />
						) : (
							<button onClick={openModal}>
								<FaHistory />
							</button>
						)
					) : (
						<FaLock className='cursor-not-allowed' title='You need history access for this feature' />
					)}
				</div>
			</td>
		</tr>
	);
};
export default MintResultRow;
