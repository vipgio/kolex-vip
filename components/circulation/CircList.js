const CircList = ({ data, prices }) => {
	const opened = data.reduce((cur, acc) => cur + acc.inCirculation, 0);
	const minted =
		data.reduce((cur, acc) => cur + (acc.minted || 0), 0) ||
		data.reduce((cur, acc) => cur + (acc.mintCount || 0), 0);
	const setValue = prices.reduce((cur, acc) => (acc.lowestPrice ? cur + Number(acc.lowestPrice) : cur), 0);

	return (
		<div className='relative mb-5 flex justify-center px-2'>
			<div className='grid divide-y divide-primary-400 overflow-hidden rounded border border-primary-400'>
				<div className='flex justify-around p-1 text-center font-semibold text-gray-700 dark:text-gray-200'>
					<div className=''>
						<div>
							Total Circulation: {opened}{" "}
							<span className='text-primary-500'>
								{minted > 0 ? `(${((opened / minted) * 100).toFixed(2)}%)` : null}
							</span>
						</div>
						<>{minted > 0 ? <div>Total Minted: {minted}</div> : null}</>
					</div>
					<div className=''>
						<div>
							Set market total: <span className='text-primary-500'> ${setValue.toFixed(2)}</span>
						</div>
						<>
							Total items: <span className='text-primary-500'> {data.length}</span>
						</>
					</div>
				</div>
				<div className='overflow-auto'>
					<table className='table-auto'>
						<thead className='sticky top-0 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'>
							<tr>
								<th className='py-1 px-2 sm:px-6 sm:py-2'>Title</th>
								<th className='py-1 px-2 sm:px-6 sm:py-2'>Circulation</th>
								<th className='py-1 px-2 sm:px-6 sm:py-2'>Edition of</th>
								<th className='py-1 px-2 sm:px-6 sm:py-2'>Floor</th>
							</tr>
						</thead>
						<tbody>
							{data
								.sort((a, b) => a.inCirculation - b.inCirculation)
								.map((item) => (
									<tr
										className='border-b border-gray-300 bg-gray-100 text-center text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600'
										key={item.templateId}
									>
										<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.title}</td>
										<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.inCirculation}</td>

										<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.minted || item.mintCount || "-"}</td>
										<td className='py-1 px-2 sm:py-3 sm:px-6'>
											{prices.find((price) => price.entityTemplateId === item.templateId)
												? `$${prices.find((price) => price.entityTemplateId === item.templateId).lowestPrice}`
												: `-`}
										</td>
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
