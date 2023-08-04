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
					<span className='dark:text-primary-300 text-primary-500'>{result.title} </span>
					at
					<span className='ml-1 text-gray-700 dark:text-gray-300'>
						{result.time.toLocaleString()}
					</span>
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
							<span className='dark:text-primary-300 text-primary-500'>
								{reward.name}{" "}
							</span>
							at
							<span className='ml-1 text-gray-700 dark:text-gray-300'>
								{result.time.toLocaleString()}
							</span>
						</div>
					))
			)}
		</div>
	);
};
export default SpinResult;
