const SpinResult = ({ result, info }) => {
	console.log(result);
	return (
		<div>
			{result.data.cards.length > 0 ? (
				<div className='text-gray-300'>
					You won{" "}
					<span className='text-red-400'>
						{result.data.cards[0].mintBatch}
						{result.data.cards[0].mintNumber}{" "}
					</span>
					<span className='text-indigo-300'>{result.title} </span>
					at {result.time.toLocaleString()}
				</div>
			) : (
				info.items
					.filter((item) => item.id === result.data.id)
					.map((reward) => (
						<div className='text-gray-300' key={`${result.time}-${reward.name}`}>
							You won <span className='text-indigo-300'>{reward.name} </span>
							at {result.time.toLocaleString()}
						</div>
					))
			)}
		</div>
	);
};
export default SpinResult;
