const PackOdds = ({ odds }) => {
	return (
		<div className='flex max-h-44 flex-col gap-2 overflow-y-auto overflow-x-hidden rounded border border-gray-400 p-1'>
			{odds
				.sort((a, b) => b.chance - a.chance)
				.map((odd) => (
					<div
						className='grid grid-cols-10 divide-x divide-gray-500 rounded p-1 hover:bg-gray-300 dark:hover:bg-gray-600 sm:grid-cols-9'
						key={odd.name}
					>
						<div className='col-span-7 p-0.5'>
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
