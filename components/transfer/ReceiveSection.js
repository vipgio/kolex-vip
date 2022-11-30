import { useState, useEffect } from "react";
import { useAxios } from "hooks/useAxios";
import LoadingSpin from "../LoadingSpin";

const ReceiveSection = ({ selectedUser, loading, setLoading }) => {
	const { fetchData } = useAxios();
	const [trades, setTrades] = useState([]);
	let isApiSubscribed = true;

	const getTrades = async (page) => {
		const { result } = await fetchData(`/api/trade?page=${page}`);
		if (result.count > 0 && isApiSubscribed) {
			const wantedTrades = result.trades
				.filter((trade) => trade.offeredBy === selectedUser.id)
				.map((trade) => trade.id);
			setTrades((prev) => [...prev, ...wantedTrades]);
			getTrades(++page);
		} else {
			setLoading(false);
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
		console.log(trades);
	};

	return (
		<>
			<div className='mt-10 rounded-md border border-gray-700 dark:border-gray-300'>
				<h1 className='p-1 text-xl font-semibold text-gray-700 dark:text-gray-300'>
					{loading
						? `Finding trades from ${selectedUser.username}`
						: `Trades from ${selectedUser.username}`}
				</h1>
				<div className='p-1.5'>
					{loading ? (
						<LoadingSpin />
					) : (
						<span className='text-gray-700 dark:text-gray-300'>
							{selectedUser.username} has sent you
							<span className='text-orange-500'> {trades.length} </span>
							trades.
						</span>
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
