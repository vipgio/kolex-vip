const CircList = ({ data, prices }) => {
	const opened = data.reduce((cur, acc) => cur + acc.inCirculation, 0);
	const minted =
		data.reduce((cur, acc) => cur + (acc.minted || 0), 0) ||
		data.reduce((cur, acc) => cur + (acc.mintCount || 0), 0);
	const setValue = prices.reduce((cur, acc) => (acc.lowestPrice ? cur + Number(acc.lowestPrice) : cur), 0);

	return (
		<div className='relative mb-5 flex justify-center px-2'>
			<div className='grid divide-y divide-primary-400 overflow-hidden rounded border border-primary-400'>
				<div className='text-gray-custom flex justify-around p-1 text-center font-semibold'>
					<div>
						<>
							Total Circulation:
							<div>
								{opened}{" "}
								<span className='text-primary-500'>
									{minted > 0 ? `(${((opened / minted) * 100).toFixed(2)}%)` : null}
								</span>
							</div>
						</>
						<>{minted > 0 ? <div>Total Minted: {minted}</div> : null}</>
					</div>
					<div>
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
						<thead className='text-gray-custom sticky top-0 bg-gray-200 dark:bg-gray-700'>
							<tr>
								<th className='table-cell'>Title</th>
								<th className='table-cell'>Circulation</th>
								<th className='table-cell'>Edition of</th>
								<th className='table-cell'>Floor</th>
							</tr>
						</thead>
						<tbody>
							{data
								.sort((a, b) => a.inCirculation - b.inCirculation)
								.map((item) => (
									<tr
										className='text-gray-custom border-b border-gray-300 bg-gray-100 text-center hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
										key={item.templateId}
									>
										<td className='table-cell'>{item.title}</td>
										<td className='table-cell'>{item.inCirculation}</td>

										<td className='table-cell'>{item.minted || item.mintCount || "-"}</td>
										<td className='table-cell'>
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
