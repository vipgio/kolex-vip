export const PackOdds = ({ odds }) => {
	return (
		<div className='divide-y divide-gray-500'>
			{odds
				.sort((a, b) => b.chance - a.chance)
				.map((odd) => (
					<div className='flex' key={odd.name}>
						{odd.name} ({odd.tier})<div className='ml-auto'>{odd.chance}%</div>
					</div>
				))}
		</div>
	);
};
