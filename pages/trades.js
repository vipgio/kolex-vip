import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useAxios } from "@/hooks/useAxios";
import { UserContext } from "@/context/UserContext";
import TradesGallery from "@/components/trades/TradesGallery";
import LoadingSpin from "@/components/LoadingSpin";
import Meta from "@/components/Meta";

const Trades = () => {
	const { fetchData } = useAxios();
	const [trades, setTrades] = useState([]);
	const [loading, setLoading] = useState(false);
	const { user } = useContext(UserContext);
	let isApiSubscribed = true;

	const getTrades = async () => {
		const { result, error } = await fetchData(`/api/trade?page=1`);
		if (result && isApiSubscribed) {
			if (result.count > 0 && isApiSubscribed) {
				const trades = result.trades;
				setTrades((prev) => [...prev, ...trades]);
				// getTrades(++page);
			} else {
				setLoading(false);
			}
		}
		if (error) {
			setLoading(false);
			console.error(error);
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
		await getTrades();
		setLoading(false);
	};

	useEffect(() => {
		getAllTrades();
		return () => (isApiSubscribed = false);
	}, []);

	return (
		<>
			<Meta title='Trades | Kolex VIP' />
			<div className='mt-5 flex justify-center'>
				{loading ? <LoadingSpin /> : <TradesGallery trades={trades} user={user} />}
			</div>
		</>
	);
};
export default Trades;
