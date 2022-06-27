import { useEffect, useState } from "react";

const res = { success: true, data: { id: 9738, cards: [] } };

export const SpinArea = () => {
	const [spinRes, setSpinRes] = useState([]);
	const [spinActive, setSpinActive] = useState(false);
	const [intervalId, setIntervalId] = useState(null);

	const startSpin = () => {
		setSpinActive(true);
		setIntervalId(
			setInterval(() => {
				setSpinRes((spinRes) => [...spinRes, Date.now()]);
			}, 1 * 1000)
		);
	};
	const stopSpin = () => {
		setSpinActive(false);
		clearInterval(intervalId);
	};
	return (
		<>
			<div className='my-3 flex flex-col border border-gray-500'>
				<div className='flex w-full'>
					{spinActive ? (
						<button
							onClick={stopSpin}
							className='rounded-md bg-red-500 p-2 font-semibold'
						>
							Stop Spin
						</button>
					) : (
						<button
							onClick={startSpin}
							className='rounded-md bg-green-500 p-2 font-semibold'
						>
							Start Spin
						</button>
					)}
					<button
						className='ml-auto rounded-md border border-gray-400 p-2'
						onClick={() => setSpinRes([])}
					>
						Clear history
					</button>
				</div>

				<div>
					{spinRes.slice(-5).map((res) => (
						<div key={res}>{res}</div>
					))}
					'https://api.epics.gg/api/v1/spinner/spin?categoryId=1 Request Method: POST'
				</div>
			</div>
		</>
	);
};
