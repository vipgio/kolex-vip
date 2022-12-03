import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAxios } from "hooks/useAxios";
import LoadingSpin from "../LoadingSpin";
import "react-toastify/dist/ReactToastify.css";

const ReceiveSection = ({ selectedUser, loading, setLoading }) => {
	const { fetchData, patchData } = useAxios();
	const [trades, setTrades] = useState([]);
	const [progress, setProgress] = useState(0);
	const counter = useRef(0);
	let isApiSubscribed = true;

	const getTrades = async (page) => {
		const { result, error } = await fetchData(`/api/trade?page=${page}`);
		if (result) {
			if (result.count > 0 && isApiSubscribed) {
				const wantedTrades = result.trades
					.filter((trade) => trade.offeredBy === selectedUser.id)
					.map((trade) => trade.id);
				setTrades((prev) => [...prev, ...wantedTrades]);
				getTrades(++page);
			} else {
				setLoading(false);
			}
		}
		if (error) {
			setLoading(false);
			console.log(error);
			const responseData = error.response?.data;
			responseData
				? toast.error(responseData.error, {
						toastId: responseData.errorCode,
				  })
				: toast.error(error.code, {
						toastId: error.code,
				  });
		}
	};

	const getAllTrades = async () => {
		setLoading(true);
		setTrades([]);
		await getTrades(1);
	};

	useEffect(() => {
		getAllTrades();
		return () => (isApiSubscribed = false);
	}, []);

	const acceptTrades = async () => {
		setLoading(true);
		for (const tradeId of trades) {
			const { result, error } = await patchData("/api/trade/accept-offer?categoryId=1", {
				tradeId: tradeId,
			});
			if (result) {
				counter.current++;
				toast.isActive("success")
					? toast.update("success", {
							render: `Accepted ${counter.current} ${
								counter.current === 1 ? "trade" : "trades"
							} from ${selectedUser.username}!`,
					  })
					: toast.success(
							`Accepted ${counter.current} ${
								counter.current === 1 ? "trade" : "trades"
							} from ${selectedUser.username}!`,
							{
								toastId: "success",
							}
					  );
				console.log(result);
				setProgress((prev) => prev + 1);
			}
			if (error) {
				console.log(error);
				const responseData = error.response?.data;
				responseData
					? toast.error(responseData.error, {
							toastId: responseData.errorCode,
					  })
					: toast.error(error.code, {
							toastId: error.code,
					  });
			}
		}
		setLoading(false);
	};

	return (
		<>
			<div className='mt-10 rounded-md border border-gray-700 p-3 dark:border-gray-300'>
				<h1 className='text-xl font-semibold text-gray-700 dark:text-gray-300'>
					{loading
						? `Finding trades from ${selectedUser.username}`
						: `Trades from ${selectedUser.username}`}
				</h1>
				<div>
					{loading && (
						<div className='mt-2 mb-1'>
							<LoadingSpin />
						</div>
					)}
					{progress === 0 ? (
						<div className='mt-2 text-gray-700 dark:text-gray-300'>
							{selectedUser.username} has sent you
							<span className='text-orange-500'> {trades.length} </span>
							trades.
						</div>
					) : (
						<div className='mt-2 text-gray-700 dark:text-gray-300'>
							Accepted {progress} / {trades.length} trades
						</div>
					)}

					<div className='mt-4 flex'>
						<button
							type='button'
							className='button ml-auto'
							onClick={acceptTrades}
							disabled={loading || trades.length === 0}
						>
							Accept all
						</button>
					</div>
				</div>
			</div>
		</>
	);
};
export default ReceiveSection;
