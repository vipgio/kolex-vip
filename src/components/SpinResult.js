export const SpinResult = ({ result, info }) => {
	// console.log("result", result, "info", info);
	console.log(result);
	const reward = info.items.filter((item) => item.id === result.data.id);
	console.log(reward[0]);
	return (
		<div>
			{result.data.cards.length > 0 ? (
				<div>
					You won{" "}
					<span className='text-red-400'>
						{result.data.cards[0].mintBatch}
						{result.data.cards[0].mintNumber}{" "}
					</span>
					<span>{result.data.cards[0].cardTemplate.title}</span>
				</div>
			) : (
				info.items
					.filter((item) => item.id === result.data.id)
					.map((reward) => (
						<div key={`${reward.id}${reward}`}>
							{/* {JSON.stringify(reward)} */}
							You won {reward.name}
							{/* at {new Date().toLocaleString()} */}
						</div>
					))
			)}
		</div>
	);
};
