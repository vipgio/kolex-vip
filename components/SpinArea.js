import { useContext, useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { UserContext } from "context/UserContext";
import SpinResult from "./SpinResult";

const SpinArea = ({ info }) => {
	const intervalRef = useRef();
	const { buySpin, spin, getFunds, user } = useContext(UserContext);
	const [spinRes, setSpinRes] = useState([]);
	const [spinActive, setSpinActive] = useState(false);
	const [funds, setFunds] = useState({
		craftingcoins: 0,
		epicoins: 0,
		silvercoins: 0,
	});

	const getBalance = useCallback(async () => {
		if (user) {
			const allFunds = await getFunds();
			if (allFunds.data.success) {
				setFunds(allFunds.data.data);
			}
		}
	}, [user]);

	useEffect(() => {
		getBalance();
	}, [user, getBalance]);

	const doSpin = async () => {
		const buySpinRes = await buySpin();
		if (buySpinRes.data.success) {
			const { data: spinResult } = await spin(info.id);
			if (spinResult.data.cards.length > 0) {
				const { data: templates } = await axios.get(`/api/cards/templates`, {
					params: {
						cardIds: spinResult.data.cards[0].cardTemplateId,
					},
					headers: {
						jwt: user.jwt,
					},
				});
				setSpinRes((prev) => [
					{ ...spinResult, time: new Date(), title: templates.data[0].title },
					...prev,
				]);
			} else {
				setSpinRes((prev) => [{ ...spinResult, time: new Date() }, ...prev]);
			}
		}
	};

	const startSpin = () => {
		setSpinActive(true);
		doSpin();
		getBalance();
		const id = setInterval(() => {
			doSpin();
			getBalance();
		}, 6 * 1000);
		intervalRef.current = id;
	};

	const stopSpin = () => {
		setSpinActive(false);
		clearInterval(intervalRef.current);
	};

	useEffect(() => {
		return () => stopSpin();
	}, []);

	return (
		<>
			<div className='mt-3 flex w-full flex-col border border-gray-500 p-2 sm:mt-0 sm:ml-3'>
				<div className='flex w-full items-center justify-evenly border-b border-gray-500 pb-2'>
					{spinActive ? (
						<button
							onClick={stopSpin}
							className='rounded-md bg-red-500 p-2 font-semibold hover:bg-red-600'
						>
							Stop Spinning
						</button>
					) : (
						<button
							onClick={startSpin}
							className='rounded-md bg-green-500 p-2 font-semibold hover:bg-green-600'
						>
							Start Spinning
						</button>
					)}

					<div className='flex-1 text-center text-lg font-semibold text-gray-700 dark:text-gray-400'>
						Silver: {funds.silvercoins}
					</div>
					<button
						className='flex items-center rounded-md bg-red-500 p-2 hover:bg-red-600'
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

				<div className='max-h-96 min-h-[20rem] overflow-auto'>
					{info.id &&
						spinRes.map((res) => (
							<SpinResult result={res} spinnerInfo={info} key={res.time} />
						))}
				</div>
			</div>
		</>
	);
};
export default SpinArea;
