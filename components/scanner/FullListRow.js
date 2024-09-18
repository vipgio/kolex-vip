import React, { useContext, useState } from "react";
import { FaSignature, FaLock, FaHistory } from "react-icons/fa";
import { UserContext } from "@/context/UserContext";
import HistoryModal from "@/components/history/HistoryModal";

const FullListRow = React.memo(({ item, isSelfScan, singleUserSearch }) => {
	const { user } = useContext(UserContext);
	const [showHistory, setShowHistory] = useState(false);

	const openModal = (e) => {
		e.stopPropagation();
		setShowHistory(true);
	};

	return (
		<tr
			className='border-b border-gray-200 transition-colors hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
			key={item.id}
		>
			<td
				className={`table-cell ${item.signatureImage ? "text-yellow-400" : ""}`}
				title={item.signatureImage ? "Signed" : undefined}
			>
				<span className='flex items-center justify-center'>
					{item.signatureImage && <FaSignature className='mr-2' />}
					{item.mintBatch}
					{item.mintNumber}
				</span>
			</td>
			<td className='table-cell min-w-[10rem]'>{item.title}</td>
			<td className='table-cell'>{item.inCirculation}</td>
			<td className='table-cell'>{item.status === "market" ? "Yes" : "No"}</td>
			<td className='table-cell'>{(item.rating * 10).toFixed(2)}</td>
			<td className='table-cell'>{item.id}</td>
			{!singleUserSearch && <td className='table-cell'>{item.owner}</td>}
			{!isSelfScan && (
				<td className={`table-cell ${item.need ? "font-bold" : ""}`} title={item.need ? "Need" : ""}>
					{item.delta > 0 ? `+${item.delta}` : 0}
				</td>
			)}
			<td className='table-cell'>
				<span className='relative flex h-8 items-center justify-center'>
					{user.info.allowed.includes("history") ? (
						item.type === "sticker" ? (
							<HistoryModal data={item} isOpen={showHistory} setIsOpen={setShowHistory} type='sticker' />
						) : item.type === "card" ? (
							<HistoryModal
								data={item}
								isOpen={showHistory}
								setIsOpen={setShowHistory}
								type='card'
								method='uuid'
							/>
						) : (
							<button onClick={openModal}>
								<FaHistory />
							</button>
						)
					) : (
						<FaLock className='cursor-not-allowed' title='You need the "history" access for this feature' />
					)}
				</span>
			</td>
		</tr>
	);
});
FullListRow.displayName = "FullListRow";
export default FullListRow;
