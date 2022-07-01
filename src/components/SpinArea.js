import { useContext, useState } from "react";
import { SpinResult } from "./SpinResult";
import { UserContext } from "../context/UserContext";

export const SpinArea = ({ info }) => {
	const { buySpin, spin } = useContext(UserContext);
	const [spinRes, setSpinRes] = useState([]);
	const [spinActive, setSpinActive] = useState(false);
	const [intervalId, setIntervalId] = useState(null);

	const doSpin = async () => {
		const buySpinRes = await buySpin();
		console.log(buySpinRes);
		if (buySpinRes.data.success) {
			const spinResult = await spin(info.id);
			setSpinRes((prev) => [spinResult.data, ...prev]);
		}
	};

	const startSpin = () => {
		setSpinActive(true);
		doSpin();
		setIntervalId(
			setInterval(() => {
				doSpin();
			}, 5 * 1000)
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
							Stop Spinning
						</button>
					) : (
						<button
							onClick={startSpin}
							className='rounded-md bg-green-500 p-2 font-semibold'
						>
							Start Spinning
						</button>
					)}
					{/* <button onClick={doSpin}>Do one spin</button> */}
					<button
						className='ml-auto flex items-center rounded-md border border-gray-400 p-2'
						onClick={() => setSpinRes([])}
					>
						Clear history
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-5 w-5'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							strokeWidth={2}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
							/>
						</svg>
					</button>
				</div>

				<div className='h-36 overflow-auto'>
					{info.id &&
						spinRes.map((res, index) => (
							<SpinResult result={res} info={info} key={index} />
						))}
				</div>
			</div>
		</>
	);
};
