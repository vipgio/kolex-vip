import { useState } from "react";
import PackModal from "./PackModal";

const ListModeRow = ({ pack }) => {
	const [showModal, setShowModal] = useState(false);
	return (
		<>
			<tr className='text-gray-custom border-b border-gray-300 bg-gray-100 text-center hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'>
				<td
					className='py-1 px-2 hover:cursor-pointer hover:underline sm:py-3 sm:px-6'
					onClick={() => setShowModal(true)}
				>
					{pack.name}
				</td>
				<td className='table-cell'>{pack.properties.seasons[0]}</td>
				<td className='table-cell'>{pack.acquireType[0][0].toUpperCase() + pack.acquireType[0].slice(1)}</td>
				<td className='table-cell'>{Number(pack.cost).toLocaleString()}</td>
				<td className='table-cell'>
					{pack.costType === "usd" ? "USD" : pack.costType[0].toUpperCase() + pack.costType.slice(1)}
				</td>

				<td className='table-cell'>{pack.mintCount?.toLocaleString() || "-"}</td>
				<td className='table-cell'>{pack.inventoryCount.toLocaleString()}</td>
				<td className='table-cell'>{pack.openedCount.toLocaleString()}</td>
				<td className='table-cell'>
					<span>{(pack.mintCount - pack.openedCount).toLocaleString()}</span>
				</td>
				<td className='table-cell'>{pack.purchaseStart?.split("T")[0] || "-"}</td>
			</tr>
			<tr>
				<td className='p-0'>
					{showModal && <PackModal pack={pack} setIsOpen={setShowModal} isOpen={showModal} />}
				</td>
			</tr>
		</>
	);
};
export default ListModeRow;
