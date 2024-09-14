const PackOdds = ({ odds }) => {
	return (
		<div className='flex max-h-56 flex-col divide-y divide-gray-500 overflow-y-auto overflow-x-hidden rounded border border-gray-400 py-1'>
			{odds
				.sort((a, b) => b.chance - a.chance)
				.map((odd) => (
					<div
						className='grid grid-cols-10 divide-x divide-gray-500 p-1 hover:bg-gray-300 dark:hover:bg-gray-500 sm:grid-cols-9'
						key={odd.treatmentId}
					>
						<div className='col-span-7'>
							{odd.name} ({odd.tier})
						</div>
						<div
							className='col-span-3 inline-flex items-center justify-center sm:col-span-2'
							title={`1 in ${Number(
								(100 / odd.chance).toFixed(2).replace(/0+$/, "").replace(/\.$/, "")
							).toLocaleString()}`}
						>
							{odd.chance}%
						</div>
					</div>
				))}
		</div>
	);
};
export default PackOdds;
