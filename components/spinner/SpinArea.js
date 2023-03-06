import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaRegTrashAlt, FaPlay, FaStop } from "react-icons/fa";
import { API } from "@/config/config";
import { UserContext } from "context/UserContext";
import { useAxios } from "hooks/useAxios";
import SpinResult from "./SpinResult";
import Tooltip from "../Tooltip";
import Recap from "./Recap";
import "react-toastify/dist/ReactToastify.css";

const SpinArea = ({ info }) => {
	const { user } = useContext(UserContext);
	const intervalRef = useRef();
	const spinCount = useRef(0);
	const { fetchData, postData } = useAxios();
	const [spinRes, setSpinRes] = useState([]);
	const [spinActive, setSpinActive] = useState(false);
	const [spinLimit, setSpinLimit] = useState(10000);
	const [showRecap, setShowRecap] = useState(false);
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
		const { result, error } = await postData("/api/spinner/buySpin", {
			amount: 1,
		});
		if (result) return result;
		if (error) console.log(error);
	};

	const spin = async (id) => {
		try {
			const { data } = await axios.post(
				`${API}/spinner/spin?categoryId=1`,
				{
					spinnerId: id,
				},
				{
					headers: {
						"x-user-jwt": user.jwt,
					},
				}
			);
			if (data.success) return data.data;
		} catch (err) {
			console.log(err);
		}
	};

	const doSpin = async () => {
		if (spinCount.current < spinLimit) {
			try {
				await buySpin();
				const spinResult = await spin(info.id);
				spinCount.current++;
				if (spinResult.cards.length > 0) {
					const { result: templates, error } = await fetchData("/api/cards/templates", {
						cardIds: spinResult.cards.map((card) => card.cardTemplateId).toString(),
					});
					const title = templates && templates[0] && templates[0].title;
					setSpinRes((prev) => [
						{
							...spinResult,
							time: new Date(),
							title: title
								? title
								: "Something, but there was a problem so can't find the card",
						},
						...prev,
					]);
				} else {
					setSpinRes((prev) => [{ ...spinResult, time: new Date() }, ...prev]);
				}
				await getFunds();
			} catch (err) {
				if (err.response?.data.errorCode === "low_user_balance") stopSpin();
				toast.error(err.response?.data.error, {
					toastId: err.response?.data.errorCode,
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
					{spinRes.length > 0 && (
						<button
							onClick={() => setShowRecap(true)}
							className='ml-2 inline-flex cursor-pointer items-center rounded-md border border-gray-800 bg-gray-100 px-1 py-0.5 text-center text-gray-700 shadow-lg transition-colors enabled:hover:bg-gray-300 enabled:hover:text-gray-800 enabled:active:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-200 dark:text-gray-800 dark:hover:text-gray-800'
						>
							Recap
						</button>
					)}
					{showRecap ? (
						<Recap
							spins={spinRes}
							items={info.items}
							isOpen={showRecap}
							setIsOpen={setShowRecap}
						/>
					) : null}
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
