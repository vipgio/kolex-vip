import Tooltip from "./Tooltip";

const CircList = ({ data }) => {
	const opened = data.reduce((cur, acc) => cur + acc.inCirculation, 0);
	const minted =
		data.reduce((cur, acc) => cur + (acc.minted || 0), 0) ||
		data.reduce((cur, acc) => cur + (acc.mintCount || 0), 0);

	return (
		<div className='relative mb-5 flex justify-center px-2'>
			<div className='grid divide-y divide-indigo-400 rounded border border-indigo-400'>
				<div className='p-1 text-center text-lg font-semibold text-gray-700 dark:text-gray-200'>
					<div>Total Circulation: {opened}</div>
					{minted > 0 ? <div>Total Minted: {minted}</div> : null}
				</div>
				<div className='overflow-auto'>
					<table className='table-auto'>
						<thead className='sticky top-0 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'>
							<tr>
								<th className='py-1 px-2 sm:px-6 sm:py-2'>Title</th>
								<th className='py-1 px-2 sm:px-6 sm:py-2'>Circulation</th>
								<th className='py-1 px-2 sm:px-6 sm:py-2'>
									<div className='inline-flex items-center'>
										<Tooltip direction='left' text='Not available for all items' />
										Edition of
									</div>
								</th>
								{/* <th className='py-1 px-2 sm:px-6'>Tier</th> */}
							</tr>
						</thead>
						<tbody className='h-96'>
							{data
								.sort((a, b) => a.inCirculation - b.inCirculation)
								.map((item) => (
									<tr
										className='border-b border-gray-300 bg-gray-100 text-center text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600'
										key={item.id}
									>
										<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.title}</td>
										<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.inCirculation}</td>

										<td className='py-1 px-2 sm:py-3 sm:px-6'>
											{item.minted || item.mintCount || "-"}
										</td>

										{/* <td className='py-1 px-2 sm:py-3 sm:px-6'>{item.treatment.tier}</td> */}
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
export default CircList;
