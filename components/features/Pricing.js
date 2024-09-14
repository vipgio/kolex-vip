const Pricing = ({ features, bundles }) => {
	return (
		<>
			<div className='text-gray-custom mt-8 flex flex-col justify-center px-2'>
				<h1 className='mb-2 text-center text-4xl font-semibold text-gray-800 dark:text-gray-200'>Pricing</h1>
				<h2 className='mt-5 p-1 text-xl font-semibold'>Features</h2>
				<div className='overflow-hidden rounded-md border border-gray-600 dark:border-gray-400'>
					<table className='w-full table-auto transition-colors'>
						<thead className='bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-400'>
							<tr>
								<th className='table-cell'>Feature</th>
								<th className='table-cell'>1 Month</th>
								<th className='table-cell'>2 Months</th>
							</tr>
						</thead>
						<tbody className='text-center'>
							{features
								.filter((feature) => feature.price > 0 && !feature.info.perUse && feature.info.locked)
								.map((feature) => (
									<tr
										className='border-t bg-white hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
										key={feature.name}
									>
										<td className='table-cell w-1/3'>{feature.info.name}</td>
										<td className='table-cell'>${feature.price}</td>
										<td className='table-cell'>${feature.price2}</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>

				<h2 className='mt-5 p-1 text-xl font-semibold'>Bundles</h2>
				<div className='overflow-hidden rounded-md border border-gray-600 dark:border-gray-400'>
					<table className='w-full table-auto transition-colors'>
						<thead className='bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-400'>
							<tr>
								<th className='table-cell'>Features</th>
								<th className='table-cell'>1 Month</th>
								<th className='table-cell'>2 Months</th>
							</tr>
						</thead>
						<tbody className='text-center'>
							{bundles.map((bundle) => (
								<tr
									className='border-t bg-white hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
									key={bundle.id}
								>
									<td className='table-cell w-1/3'>{bundle.features.toString().replaceAll(",", " + ")}</td>
									<td className='table-cell'>
										<span className='mr-1.5 line-through decoration-red-500'>${bundle.oldPrice}</span>
										<span>${bundle.price}</span>
									</td>
									<td className='table-cell'>
										<span className='mr-1.5 line-through decoration-red-500'>${bundle.oldPrice2}</span>
										<span>${bundle.price2}</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<h2 className='mt-5 p-1 text-xl font-semibold'>Other services</h2>
				<div className='mb-4 overflow-hidden rounded-md border border-gray-600 dark:border-gray-400'>
					<table className='w-full table-auto transition-colors'>
						<thead className='bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-400'>
							<tr>
								<th className='table-cell'>Feature</th>
								<th className='table-cell'>Per Use</th>
							</tr>
						</thead>
						<tbody className='text-center'>
							{features
								.filter((feature) => feature.info.perUse)
								.map((feature) => (
									<tr
										className='border-t bg-white hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
										key={feature.name}
									>
										<td className='table-cell'>{feature.info.name}</td>
										<td className='table-cell'>${feature.price}</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};
export default Pricing;
