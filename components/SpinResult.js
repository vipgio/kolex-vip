import { v4 as uuidv4 } from "uuid";
const SpinResult = ({ result, info }) => {
	return (
		<div>
			{result.data.cards.length > 0 ? (
				<div className='text-gray-300'>
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
						<div key={uuidv4()} className='text-gray-300'>
							You won <span className='text-indigo-300'>{reward.name} </span>
							at {result.time.toLocaleString()}
						</div>
					))
			)}
		</div>
	);
};
export default SpinResult;
