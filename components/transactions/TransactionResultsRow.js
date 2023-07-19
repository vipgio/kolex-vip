import { useState } from "react";
import { FaLock, FaBan, FaHistory } from "react-icons/fa";
import HistoryModal from "../HistoryModal";

const TransactionResultsRow = ({ item, allowed }) => {
	const [showHistory, setShowHistory] = useState(false);
	if (!item.details) console.log(item);
	const historyFakeItem = {
		id: item.details?.entityId,
		title: item.details?.title,
	};

	const openModal = () => {
		setShowHistory(true);
	};
	return (
		<tr className='border-b border-gray-300 bg-gray-100 text-center text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600'>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				{item.created.split("T")[0]}
				{/* {item.created.replace("T", " ").split(".")[0]} */}
			</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.description}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.amount}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				{item.type[0].toUpperCase() + item.type.slice(1)}
			</td>
			{item.costType !== "silvercoins" && (
				<td className='min-w-[10rem] py-1 px-2 sm:py-3 sm:px-6'>{item.details.title}</td>
			)}
			<td className='min-w-[10rem] py-1 px-2 sm:py-3 sm:px-6'>
				{item.costType.length <= 4
					? item.costType.toUpperCase()
					: item.costType[0].toUpperCase() + item.costType.slice(1)}
			</td>

			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				<div className='relative flex h-8 items-center justify-center'>
					{allowed ? (
						!item.details || item.details.entityType !== "card" ? (
							<FaBan title='Only works with cards!' />
						) : showHistory ? (
							<HistoryModal
								data={historyFakeItem}
								isOpen={showHistory}
								setIsOpen={setShowHistory}
							/>
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
export default TransactionResultsRow;
