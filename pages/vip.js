import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAxios } from "@/hooks/useAxios";
import Meta from "@/components/Meta";
import SpinResult from "@/components/spinner/SpinResult";
import { PlayIcon, StopIcon } from "@/components/Icons";

const Vip = () => {
	const intervalRef = useRef();
	const [spinRes, setSpinRes] = useState([]);
	const [spinActive, setSpinActive] = useState(false);
	const [spinnerInfo, setSpinnerInfo] = useState(null);
	const [listing, setListing] = useState({ marketId: 0, price: 0 });
	const { fetchData, postData } = useAxios();

	const spin = async (id) => {
		const { result, error } = await postData("/api/spinner/spin", {
			spinnerId: id,
		});
		if (result) {
			return result;
		} else {
			console.error(error);
			toast.error(error.response.data.error, {
				toastId: error.response.data.errorCode,
			});
		}
	};

	const doSpin = async () => {
		try {
			const spinResult = await spin(spinnerInfo.id);
			if (spinResult) {
				if (spinResult.cards.length > 0) {
					const { result: templates } = await fetchData(`/api/cards/templates`, {
						cardIds: spinResult.cards.map((card) => card.cardTemplateId).toString(),
					});
					const title = templates && templates[0] && templates[0].title;
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
			}
		} catch (err) {
			console.error(err);
		}
	};

	const startSpin = () => {
		setSpinActive(true);
		doSpin();
		let timeout = 1000 * 60 * 30 + (Math.random() * 3 + 2) * 60 * 1000;
		const id = setInterval(() => {
			doSpin();
		}, timeout);
		intervalRef.current = id;
	};

	const stopSpin = () => {
		setSpinActive(false);
		clearInterval(intervalRef.current);
	};

	const buyItem = async () => {
		const { error, info } = await postData("/api/market/buy", {
			id: listing.marketId,
			price: listing.price,
		});

		if (info?.success) {
			toast.success(`Purchased ${listing.marketId} for ${listing.price}!\n`, {
				toastId: listing.marketId,
			});
		} else {
			toast.error(error.response.data.error, {
				toastId: listing.marketId,
			});
		}
	};

	useEffect(() => {
		const getInitialInfo = async () => {
			const { result: data } = await fetchData("/api/spinner/info");
			if (data) {
				setSpinnerInfo(data);
			}
		};
		getInitialInfo();

		return () => {
			stopSpin();
		};
	}, []);

	return (
		<>
			<Meta title='VIP Stuff | Kolex VIP' />
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
			<div className='flex'>
				<div>
					{spinActive ? (
						<button
							disabled={!spinnerInfo}
							onClick={stopSpin}
							className='text-gray-custom my-5 inline-flex items-center rounded-md bg-red-500 p-2 font-semibold hover:bg-red-600 active:bg-red-700'
						>
							<StopIcon className='mr-1 hidden sm:block' />
							Stop Spinning
						</button>
					) : (
						<button
							disabled={!spinnerInfo}
							onClick={startSpin}
							className='text-gray-custom my-5 inline-flex items-center rounded-md bg-green-500 p-2 font-semibold hover:bg-green-600 active:bg-green-700'
						>
							<PlayIcon className='mr-1 hidden sm:block' />
							Start Spinning
						</button>
					)}
					<div className='max-h-96 min-h-[24rem] divide-y divide-gray-500 overflow-auto sm:divide-y-0'>
						{spinnerInfo?.id &&
							spinRes.map((res) => <SpinResult result={res} spinnerInfo={spinnerInfo} key={res.time} />)}
					</div>
				</div>
			</div>
		</>
	);
};
export default Vip;
