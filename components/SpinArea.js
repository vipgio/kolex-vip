import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaRegTrashAlt, FaPlay, FaStop } from "react-icons/fa";
import { UserContext } from "context/UserContext";
import SpinResult from "./SpinResult";
import { useAxios } from "hooks/useAxios";
import Tooltip from "./Tooltip";

const SpinArea = ({ info }) => {
	const intervalRef = useRef();
	const spinCount = useRef(0);
	const { fetchData } = useAxios();
	const { user } = useContext(UserContext);
	const [spinRes, setSpinRes] = useState([]);
	const [spinActive, setSpinActive] = useState(false);
	const [spinLimit, setSpinLimit] = useState(10000);
	const [funds, setFunds] = useState({
		craftingcoins: 0,
		epicoins: 0,
		silvercoins: 0,
	});

	const getFunds = async () => {
		const { result } = await fetchData("/api/users/funds");
		result && setFunds(result);
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

	const doSpin = async () => {
		if (spinCount.current < spinLimit) {
			try {
				await buySpin();
				const spinResult = await spin(info.id);
				spinCount.current++;
				if (spinResult.cards.length > 0) {
					const { data: templates } = await axios.get(`/api/cards/templates`, {
						params: {
							cardIds: spinResult.cards.map((card) => card.cardTemplateId).toString(),
						},
						headers: {
							jwt: user.jwt,
						},
					});
					const title =
						templates && templates.data && templates.data[0] && templates.data[0].title;
					setSpinRes((prev) => [
						{
							...spinResult,
							time: new Date(),
							title: title
								? title
								: "Something, but kolex is buggy so can't find the card",
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
		} else {
			stopSpin();
		}
	};

	const startSpin = () => {
		setSpinActive(true);
		doSpin();
		const id = setInterval(() => {
			doSpin();
		}, 7 * 1000);
		intervalRef.current = id;
	};

	const stopSpin = () => {
		spinCount.current = 0;
		setSpinActive(false);
		clearInterval(intervalRef.current);
	};

	useEffect(() => {
		getFunds();
		return () => {
			stopSpin();
		};
	}, []);

	const handleLimit = (e) => {
		const value = e.target.value;
		value > 10000
			? setSpinLimit(10000)
			: value < 1
			? setSpinLimit(1)
			: setSpinLimit(value);
	};

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
					<div className='ml-1 mr-auto text-center text-lg font-semibold text-gray-700 dark:text-slate-200'>
						Silver: {funds.silvercoins.toLocaleString()}
					</div>
					<div className='flex items-center text-gray-700 dark:text-gray-300'>
						<Tooltip
							direction='left'
							text={`Number of spins before it stops. Default is 10,000 times.`}
						/>
						<span>Spin limit:</span>
						<input
							type='number'
							name='counter'
							id='counter'
							disabled={spinActive}
							min={1}
							max={10000}
							value={spinLimit}
							onChange={handleLimit}
							className='input-field mr-3 ml-1 w-24'
						/>
					</div>
					{spinActive ? (
						<button
							onClick={stopSpin}
							className='inline-flex items-center rounded-md bg-red-500 p-2 font-semibold text-gray-700 hover:bg-red-600 active:bg-red-700 dark:text-gray-200'
						>
							<FaStop className='mr-1 hidden sm:block' />
							Stop Spinning
						</button>
					) : (
						<button
							onClick={startSpin}
							className='inline-flex items-center rounded-md bg-green-500 p-2 font-semibold text-gray-700 hover:bg-green-600 active:bg-green-700 dark:text-gray-200'
						>
							<FaPlay className='mr-1 hidden sm:block' />
							Start Spinning
						</button>
					)}
				</div>

				<div className='max-h-96 min-h-[24rem] divide-y divide-gray-500 overflow-auto sm:divide-y-0'>
					{info.id &&
						spinRes.map((res) => (
							<SpinResult result={res} spinnerInfo={info} key={res.time} />
						))}
				</div>
				<div className='mt-1 flex items-center border-t border-gray-500 pt-2 text-gray-800 dark:text-gray-200'>
					<div>
						Used the Spinner
						<span className='text-indigo-500 dark:text-indigo-300'>
							{" "}
							{spinRes.length}{" "}
						</span>
						{spinRes.length === 1 ? "time" : "times"}
					</div>
					<div className='ml-auto'>
						<button
							className='flex items-center rounded-md bg-red-500 p-2 hover:bg-red-600 active:bg-red-700'
							onClick={() => setSpinRes([])}
							title='Clear history'
						>
							<FaRegTrashAlt />
						</button>
					</div>
				</div>
			</div>
		</>
	);
};
export default SpinArea;
