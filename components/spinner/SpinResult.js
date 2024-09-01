const SpinResult = ({ result, spinnerInfo }) => {
	return (
		<div className='text-gray-custom'>
			{result.cards.length > 0 ? (
				<div className=''>
					You won{" "}
					<span className='text-red-400'>
						{result.cards[0].mintBatch}
						{result.cards[0].mintNumber}{" "}
					</span>
					<span className='text-primary-500 dark:text-primary-300'>{result.title} </span>
					at
					<span className='ml-1 '>{result.time.toLocaleString()}</span>
				</div>
			) : (
				spinnerInfo.items
					.filter((item) => item.id === result.id)
					.map((reward) => (
						<div key={`${result.time}-${reward.name}`}>
							You won <span className='text-primary-500 dark:text-primary-300'>{reward.name} </span>
							at
							<span className='ml-1'>{result.time.toLocaleString()}</span>
						</div>
					))
			)}
		</div>
	);
};
export default SpinResult;
