import { UserContext } from "context/UserContext";
import { useContext } from "react";
import { FaSignature, FaLock, FaBan } from "react-icons/fa";
import HistoryModal from "../HistoryModal";

const FullList = ({ results }) => {
	const { user } = useContext(UserContext);
	return (
		<table className='w-full table-auto overflow-hidden text-gray-500 dark:text-gray-400'>
			<thead className='bg-gray-50 uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
				<tr>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Mint</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Title</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Circulation</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Listed</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Immutable</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>ID</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Item Points</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>History</th>
				</tr>
			</thead>
			<tbody className='text-center'>
				{results.map((item) => (
					<tr
						className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
						key={item.id}
					>
						<td
							className={`py-1 px-2 sm:py-3 sm:px-6 ${
								item.signed ? "text-yellow-400" : ""
							}`}
							title={item.signed ? "Signed" : undefined}
						>
							<div className='flex items-center justify-center'>
								{item.signed && <FaSignature className='mr-2' />}
								{item.mintBatch}
								{item.mintNumber}
							</div>
						</td>
						<td className='min-w-[10rem] py-1 px-2 sm:py-3 sm:px-6'>{item.title}</td>
						<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.inCirculation}</td>
						<td className='py-1 px-2 sm:py-3 sm:px-6'>
							{item.status === "market" ? "Yes" : "No"}
						</td>
						<td className='py-1 px-2 sm:py-3 sm:px-6'>
							{item.status === "imx_locked" ? "Yes" : "No"}
						</td>
						<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.id}</td>
						<td className='py-1 px-2 sm:py-3 sm:px-6'>{(item.rating * 10).toFixed(2)}</td>
						<td className='py-1 px-2 sm:py-3 sm:px-6'>
							<div className='relative flex h-8 items-center justify-center'>
								{user.info.allowed.includes("history") ? (
									item.type === "sticker" ? (
										<FaBan title="Doesn't work with stickers" />
									) : (
										<HistoryModal data={item} />
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
				))}
			</tbody>
		</table>
	);
};
export default FullList;
