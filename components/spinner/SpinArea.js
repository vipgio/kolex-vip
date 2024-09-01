import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import isEmpty from "lodash/isEmpty";
import { FaRegTrashAlt, FaPlay, FaStop } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { API } from "@/config/config";
import { useAxios } from "@/hooks/useAxios";
import SpinResult from "./SpinResult";
import Recap from "./Recap";
import SpinnerLimit from "./SpinnerLimit";
import Tooltip from "../Tooltip";

const SpinArea = ({ info }) => {
	const { fetchData, postData } = useAxios();
	const intervalRef = useRef();
	const inProgress = useRef(false);
	const finished = useRef(false);
	const [spinRes, setSpinRes] = useState([]);
	const [spinActive, setSpinActive] = useState(false);
	const [showRecap, setShowRecap] = useState(false);
	const [funds, setFunds] = useState({ silvercoins: 0 });
	const [limit, setLimit] = useState({ type: "spins", value: 500, isSet: false }); //type: spins, fund, target

	//check if it's local or production
	const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

	const getFunds = async () => {
		const { result } = await fetchData({ endpoint: `${API}/user/funds`, direct: true });
		if (result) {
			setFunds(result);
		}
	};

	const buySpin = async () => {
		inProgress.current = true;
		const { result, error } = await postData("/api/spinner/buySpin", {
			amount: 1,
		});
		if (result) return result;
		if (error) console.error(error);
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
		if (error) console.error(error);
	};

	const doSpin = async () => {
		if (!checkLimitReached()) {
			//condition to check if the limit is reached using the checkLimitReached function
			if (inProgress.current === false) {
				inProgress.current = true;
				try {
					await buySpin();
					const spinResult = await spin(info.id);
					if (spinResult) {
						if (spinResult.cards.length > 0) {
							const { result: templates, error } = await fetchData("/api/cards/templates", {
								cardIds: spinResult.cards.map((card) => card.cardTemplateId).toString(),
							});
							const title =
								templates?.[0]?.title ?? "Something, but there was a problem so can't find the card";
							setSpinRes((prev) => [
								{
									...spinResult,
									time: new Date(),
									title,
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
					console.error(err);
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
		// spinCount.current = 0;
		setSpinActive(false);
		clearInterval(intervalRef.current);
	};

	useEffect(() => {
		getFunds();
		return () => stopSpin();
	}, []);

	const checkLimitReached = (results) => {
		if (results) {
			if (limit.type === "spins" && results.length >= limit.value) {
				finished.current = true;
				stopSpin();
				return true;
			}

			if (limit.type === "fund" && funds[info.costType] < limit.value) {
				finished.current = true;
				stopSpin();
				return true;
			}
			if (limit.type === "target") {
				const spunCount = results.filter((res) => res.id.toString() === limit.value.item).length;
				if (spunCount >= limit.value.count) {
					finished.current = true;
					stopSpin();
					return true;
				}
			}
		}
	};

	useEffect(() => {
		checkLimitReached(spinRes);
	}, [spinRes]);

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
			{!isEmpty(info) && (
				<div className='mt-3 flex h-full w-full flex-col rounded-md border border-gray-500 p-2 sm:mt-0 sm:ml-3'>
					<div className='flex w-full items-center justify-evenly border-b border-gray-500 pb-2'>
						<div className='ml-1 mr-auto text-center text-lg font-semibold text-gray-700 dark:text-slate-200'>
							{info.costType?.[0]?.toUpperCase() + info.costType?.slice(1)}:{" "}
							{funds[info?.costType]?.toLocaleString()}
						</div>
						<div className='flex items-center'>
							<>
								<Tooltip
									text='Make sure to reset the spin history if you change the limit after spinning.'
									direction='left'
								/>
								<SpinnerLimit
									info={info}
									funds={funds}
									limit={limit}
									setLimit={setLimit}
									spinActive={spinActive}
								/>
							</>
						</div>
						{spinActive ? (
							<button
								onClick={stopSpin}
								className='text-gray-custom inline-flex items-center rounded-md bg-red-500 p-2 font-semibold hover:bg-red-600 active:bg-red-700'
							>
								<FaStop className='mr-1 hidden sm:block' />
								Stop Spinning
							</button>
						) : (
							<button
								onClick={startSpin}
								disabled={!info.id || !limit.isSet}
								className='text-gray-custom inline-flex items-center rounded-md bg-green-500 p-2 font-semibold enabled:hover:bg-green-600 enabled:active:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'
							>
								<FaPlay className='mr-1 hidden sm:block' />
								Start Spinning
							</button>
						)}
					</div>

					<div className='flex h-full flex-col gap-1 divide-y divide-gray-500 overflow-auto pb-1 sm:divide-y-0'>
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
								className='flex items-center rounded-md bg-red-500 p-2 enabled:hover:bg-red-600 enabled:active:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-200'
								onClick={() => {
									setSpinRes([]);
								}}
								title={spinRes.length === 0 ? "No spins to clear" : "Clear spins"}
								disabled={spinRes.length === 0}
							>
								<FaRegTrashAlt />
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
export default SpinArea;
