const CompactList = ({ results }) => {
	return (
		<>
			<thead className='bg-gray-50 uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
				<tr>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Best Mint</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Title</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Owned</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Circulation</th>
				</tr>
			</thead>
			<tbody>
				{results.map((item) => (
					<tr
						className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
						key={item.id}
					>
						<td className='py-1 px-2 sm:py-3 sm:px-6'>
							{item.mintBatch}
							{item.mintNumber}
						</td>
						<td className='min-w-[10rem] py-1 px-2 sm:py-3 sm:px-6'>{item.title}</td>
						<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.owned}</td>
						<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.inCirculation}</td>
					</tr>
				))}
			</tbody>
		</>
	);
};
export default CompactList;
