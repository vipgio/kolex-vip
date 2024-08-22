import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaRegTrashAlt, FaPlay, FaStop } from "react-icons/fa";
import { API } from "@/config/config";
import { useAxios } from "hooks/useAxios";
import SpinResult from "./SpinResult";
import Recap from "./Recap";
import "react-toastify/dist/ReactToastify.css";
import SpinLimit from "./SpinLimit";

const SpinArea = ({ info }) => {
	const { fetchData, postData } = useAxios();
	const intervalRef = useRef();
	const spinCount = useRef(0);
	const inProgress = useRef(false);
	const fundRef = useRef(0); //reference to funds because state doesn't update immediately
	const defMax = 500; //default max spins
	const [spinRes, setSpinRes] = useState([]);
	const [spinActive, setSpinActive] = useState(false);
	const [spinLimit, setSpinLimit] = useState(defMax);
	const [showRecap, setShowRecap] = useState(false);
	const [funds, setFunds] = useState({ silvercoins: 0 });
	const [fundsLimit, setFundsLimit] = useState({ silvercoins: 0 });

	//check if it's local or production
	const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

	const getFunds = async () => {
		const { result } = await fetchData(`${API}/user/funds`, null, null, true);
		if (result) {
			setFunds(result);
			fundRef.current = result.silvercoins;
		}
	};

	const buySpin = async () => {
		inProgress.current = true;
		const { result, error } = await postData("/api/spinner/buySpin", {
			amount: 1,
		});
		if (result) return result;
		if (error) console.log(error);
	};

	const spin = async (id) => {
		inProgress.current = true;
		const { result, error } = await postData(
			`${API}/spinner/spin`,
			{
				spinnerId: id,
			},
			null,
			true
		);
		if (result) return result;
		if (error) console.log(error);
	};

	const doSpin = async () => {
		// console.log(spinCount.current, spinLimit, fundRef.current, Number(fundsLimit));
		if (spinCount.current < spinLimit && fundRef.current >= Number(fundsLimit)) {
			if (inProgress.current === false) {
				inProgress.current = true;
				try {
					await buySpin();
					const spinResult = await spin(info.id);
					if (spinResult) {
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
									title: title ? title : "Something, but there was a problem so can't find the card",
								},
								...prev,
							]);
						} else {
							setSpinRes((prev) => [{ ...spinResult, time: new Date() }, ...prev]);
						}
					}
					await getFunds();
					inProgress.current = false;
				} catch (err) {
					console.log(err);
					inProgress.current = false;
					if (err.response?.data.errorCode === "low_user_balance") stopSpin();
					toast.error(err.response?.data.error, {
						toastId: err.response?.data.errorCode,
					});
				}
			}
		} else {
			stopSpin();
		}
	};

	const startSpin = () => {
		setSpinActive(true);
		doSpin();
		const interval = isLocal ? 4 * 1000 : 7 * 1000;
		const id = setInterval(() => {
			doSpin();
		}, interval);
		intervalRef.current = id;
	};

	const stopSpin = () => {
		spinCount.current = 0;
		setSpinActive(false);
		clearInterval(intervalRef.current);
	};

	useEffect(() => {
		const initialFetch = async () => {
			const { result } = await fetchData({endpoint: `${API}/user/funds`, direct: true});
			if (result) {
				setFunds(result);
				fundRef.current = result.silvercoins;
			}
		};
		initialFetch();
		return () => {
			stopSpin();
		};
	}, []);

	const handleLimit = (e) => {
		const value = e.target.value;
		value > 10000 ? setSpinLimit(10000) : value < 1 ? setSpinLimit(1) : setSpinLimit(value);
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
			<div className='mt-3 flex max-h-[33rem] w-full flex-col rounded-md border border-gray-500 p-2 sm:mt-0 sm:ml-3'>
				<div className='flex w-full items-center justify-evenly border-b border-gray-500 pb-2'>
					<div className='ml-1 mr-auto text-center text-lg font-semibold text-gray-700 dark:text-slate-200'>
						Silver: {funds.silvercoins.toLocaleString()}
					</div>
					<SpinLimit
						spinActive={spinActive}
						info={info}
						spinLimit={spinLimit}
						setSpinLimit={setSpinLimit}
						defMax={defMax}
						funds={funds}
						fundsLimit={fundsLimit}
						setFundsLimit={setFundsLimit}
					/>
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
							disabled={!info.id}
							className='inline-flex items-center rounded-md bg-green-500 p-2 font-semibold text-gray-700 enabled:hover:bg-green-600 enabled:active:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-200'
						>
							<FaPlay className='mr-1 hidden sm:block' />
							Start Spinning
						</button>
					)}
				</div>

				<div className='max-h-full min-h-[24rem] divide-y divide-gray-500 overflow-auto sm:divide-y-0'>
					{info.id && spinRes.map((res) => <SpinResult result={res} spinnerInfo={info} key={res.time} />)}
				</div>
				<div className='mt-auto flex max-h-96 items-center border-t border-gray-500 pt-2 text-gray-800 dark:text-gray-200'>
					<div>
						Used the spinner
						<span className='text-primary-500 dark:text-primary-300'> {spinRes.length} </span>
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
						<Recap spins={spinRes} items={info.items} isOpen={showRecap} setIsOpen={setShowRecap} />
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
