import React, { useContext, useState } from "react";
import { FaSignature, FaLock, FaHistory } from "react-icons/fa";
import { UserContext } from "context/UserContext";
import HistoryModal from "components/HistoryModal";

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
			onClick={() => console.log(item)}
		>
			<td
				className={`py-1 px-2 sm:py-3 sm:px-6 ${
					item.signatureImage ? "text-yellow-400" : ""
				}`}
				title={item.signatureImage ? "Signed" : undefined}
			>
				<span className='flex items-center justify-center'>
					{item.signatureImage && <FaSignature className='mr-2' />}
					{item.mintBatch}
					{item.mintNumber}
				</span>
			</td>
			<td className='min-w-[10rem] py-1 px-2 sm:py-3 sm:px-6'>{item.title}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.inCirculation}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				{item.status === "market" ? "Yes" : "No"}
			</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>{(item.rating * 10).toFixed(2)}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.id}</td>
			{!singleUserSearch && <td className='py-1 px-2 sm:py-3 sm:px-6'>{item.owner}</td>}
			{!isSelfScan && (
				<td
					className={`py-1 px-2 sm:py-3 sm:px-6 ${item.need ? "font-bold" : ""}`}
					title={item.need ? "Need" : ""}
				>
					{item.delta > 0 ? `+${item.delta}` : 0}
				</td>
			)}
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				<span className='relative flex h-8 items-center justify-center'>
					{user.info.allowed.includes("history") ? (
						item.type === "sticker" ? (
							<HistoryModal
								data={item}
								isOpen={showHistory}
								setIsOpen={setShowHistory}
								type='sticker'
							/>
						) : item.type === "card" ? (
							<HistoryModal
								data={item}
								isOpen={showHistory}
								setIsOpen={setShowHistory}
								type='card'
							/>
						) : (
							<button onClick={openModal}>
								<FaHistory />
							</button>
						)
					) : (
						<FaLock
							className='cursor-not-allowed'
							title='You need the "history" access for this feature'
						/>
					)}
				</span>
			</td>
		</tr>
	);
});
FullListRow.displayName = "FullListRow";
export default FullListRow;
