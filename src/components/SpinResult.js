export const SpinResult = ({ result, info }) => {
	// console.log("result", result, "info", info);
	// console.log(result);
	const reward = info.items.filter((item) => item.id === result.data.id);
	console.log(reward[0]);
	return (
		<div>
			{info.items
				.filter((item) => item.id === result.data.id)
				.map((reward) => (
					<div>
						{/* {JSON.stringify(reward)} */}
						You won {reward.name}
						{/* at {new Date().toLocaleString()} */}
					</div>
				))}
		</div>
	);
};
