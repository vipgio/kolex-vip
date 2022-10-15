const SpinResult = ({ result, spinnerInfo }) => {
	return (
		<div>
			{result.cards.length > 0 ? (
				<div className='text-gray-700 dark:text-gray-300'>
					You won{" "}
					<span className='text-red-400'>
						{result.cards[0].mintBatch}
						{result.cards[0].mintNumber}{" "}
					</span>
					<span className='text-indigo-500 dark:text-indigo-300'>{result.title} </span>
					at {result.time.toLocaleString()}
				</div>
			) : (
				spinnerInfo.items
					.filter((item) => item.id === result.id)
					.map((reward) => (
						<div
							className='text-gray-700 dark:text-gray-300'
							key={`${result.time}-${reward.name}`}
						>
							You won{" "}
							<span className='text-indigo-500 dark:text-indigo-300'>{reward.name} </span>
							at {result.time.toLocaleString()}
						</div>
					))
			)}
		</div>
	);
};
export default SpinResult;
