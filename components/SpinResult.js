const SpinResult = ({ result, info }) => {
	// console.log("result", result, "info", info);
	// console.log(result);
	return (
		<div>
			{result.data.cards.length > 0 ? (
				<div>
					You won{" "}
					<span className='text-red-400'>
						{result.data.cards[0].mintBatch}
						{result.data.cards[0].mintNumber}{" "}
					</span>
					<span className='text-indigo-300'>
						{result.data.cards[0].cardTemplate.title}{" "}
					</span>
					at {result.time.toLocaleString()}
				</div>
			) : (
				info.items
					.filter((item) => item.id === result.data.id)
					.map((reward) => (
						<div key={`${reward.id}${reward}`}>
							{/* {JSON.stringify(reward)} */}
							You won <span className='text-indigo-300'>{reward.name} </span>
							at {result.time.toLocaleString()}
						</div>
					))
			)}
		</div>
	);
};
export default SpinResult;
