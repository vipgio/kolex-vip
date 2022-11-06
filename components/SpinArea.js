import { useContext, useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "context/UserContext";
import SpinResult from "./SpinResult";

const SpinArea = ({ info }) => {
	const intervalRef = useRef();
	const { user } = useContext(UserContext);
	const [spinRes, setSpinRes] = useState([]);
	const [spinActive, setSpinActive] = useState(false);
	const [funds, setFunds] = useState({
		craftingcoins: 0,
		epicoins: 0,
		silvercoins: 0,
	});

	const getFunds = async () => {
		const { data } = await axios.get("/api/users/funds", {
			headers: {
				jwt: user.jwt,
			},
		});
		data.success && setFunds(data.data);
	};

	const buySpin = async () => {
		const { data } = await axios.post(
			"/api/spinner/buySpin",
			{
				data: {
					amount: 1,
				},
			},
			{
				headers: {
					jwt: user.jwt,
				},
			}
		);
		if (data.success) return data.data;
		if (!data.success) console.log(data.response);
	};

	const spin = async (id) => {
		const { data } = await axios.post(
			"/api/spinner/spin",
			{
				data: {
					spinnerId: id,
				},
			},
			{
				headers: {
					jwt: user.jwt,
				},
			}
		);
		if (data.success) return data.data;
	};

	useEffect(() => {
		getFunds();
	}, [user.jwt]);

	const doSpin = async () => {
		try {
			await buySpin();
			const spinResult = await spin(info.id);
			if (spinResult.cards.length > 0) {
				const { data: templates } = await axios.get(`/api/cards/templates`, {
					params: {
						cardIds: spinResult.cards.map((card) => card.cardTemplateId).toString(),
					},
					headers: {
						jwt: user.jwt,
					},
				});
				const title = templates.data[0].title;
				setSpinRes((prev) => [
					{
						...spinResult,
						time: new Date(),
						title: title ? title : "Something, but kolex is buggy so can't find the card",
					},
					...prev,
				]);
			} else {
				setSpinRes((prev) => [{ ...spinResult, time: new Date() }, ...prev]);
			}
			await getFunds();
		} catch (err) {
			console.log(err);
			if (err.response.data.errorCode === "low_user_balance") stopSpin();
			toast.error(err.response.data.error, {
				toastId: err.response.data.errorCode,
			});
		}
	};

	const startSpin = () => {
		setSpinActive(true);
		doSpin();
		const id = setInterval(() => {
			doSpin();
		}, 10 * 1000);
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
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<div className='mt-3 flex w-full flex-col rounded-md border border-gray-500 p-2 sm:mt-0 sm:ml-3'>
				<div className='flex w-full items-center justify-evenly border-b border-gray-500 pb-2'>
					{spinActive ? (
						<button
							onClick={stopSpin}
							className='rounded-md bg-red-500 p-2 font-semibold hover:bg-red-600 active:bg-red-700'
						>
							Stop Spinning
						</button>
					) : (
						<button
							onClick={startSpin}
							className='rounded-md bg-green-500 p-2 font-semibold hover:bg-green-600 active:bg-green-700'
						>
							Start Spinning
						</button>
					)}
					<div className='flex-1 text-center text-lg font-semibold text-gray-700 dark:text-gray-400'>
						Silver: {funds.silvercoins.toLocaleString()}
					</div>
					<button
						className='flex items-center rounded-md bg-red-500 p-2 hover:bg-red-600 active:bg-red-700'
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

				<div className='max-h-96 min-h-[24rem] overflow-auto'>
					{info.id &&
						spinRes.map((res) => (
							<SpinResult result={res} spinnerInfo={info} key={res.time} />
						))}
				</div>
				<div className='mt-1 border-t border-gray-500 pt-1 text-gray-800 dark:text-gray-200'>
					<div>
						Used the Spinner
						<span className='text-indigo-500 dark:text-indigo-300'>
							{" "}
							{spinRes.length}{" "}
						</span>
						{spinRes.length === 1 ? "time" : "times"}
					</div>
				</div>
			</div>
		</>
	);
};
export default SpinArea;
