import { FaSignature } from "react-icons/fa";

const FullList = ({ results }) => {
	return (
		<>
			<thead className='bg-gray-50 uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
				<tr>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Mint</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Title</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Circulation</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Listed</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Immutable</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>ID</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Item Points</th>
				</tr>
			</thead>
			<tbody>
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
					</tr>
				))}
			</tbody>
		</>
	);
};
export default FullList;
