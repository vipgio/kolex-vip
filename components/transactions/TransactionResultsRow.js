import { useState } from "react";
import HistoryModal from "@/components/history/HistoryModal";
import { BanIcon, HistoryIcon, LockIcon } from "@/components/Icons";

const TransactionResultsRow = ({ item, allowed }) => {
	const [showHistory, setShowHistory] = useState(false);
	const historyFakeItem = {
		id: item.details?.entityId,
		title: item.details?.title,
	};

	const openModal = () => {
		setShowHistory(true);
	};
	return (
		<tr className='text-gray-custom border-b border-gray-300 bg-gray-100 text-center hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'>
			<td className='table-cell'>{item.created.split("T")[0]}</td>
			<td className='table-cell'>{item.description}</td>
			<td className='table-cell'>{item.amount}</td>
			<td className='table-cell'>{item.type[0].toUpperCase() + item.type.slice(1)}</td>
			{item.costType !== "silvercoins" && <td className='table-cell min-w-[10rem]'>{item.details?.title}</td>}
			<td className='table-cell min-w-[10rem]'>
				{item.costType === "usd"
					? item.costType.toUpperCase()
					: item.costType[0].toUpperCase() + item.costType.slice(1)}
			</td>

			<td className='table-cell'>
				<div className='relative flex h-8 items-center justify-center'>
					{allowed ? (
						!item.details || item.details.entityType !== "card" ? (
							<BanIcon title='Only works with cards!' />
						) : showHistory ? (
							<HistoryModal data={historyFakeItem} isOpen={showHistory} setIsOpen={setShowHistory} />
						) : (
							<button onClick={openModal} className='my-outline rounded p-1'>
								<HistoryIcon />
							</button>
						)
					) : (
						<LockIcon className='cursor-not-allowed' title='You need history access for this feature' />
					)}
				</div>
			</td>
		</tr>
	);
};
export default TransactionResultsRow;
