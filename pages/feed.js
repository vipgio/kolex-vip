import { useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { maxPrice, minPrice } from "@/config/config";

import { useAxios } from "@/hooks/useAxios";

import LoadingSpin from "@/components/LoadingSpin";
import Meta from "@/components/Meta";

const Feed = () => {
	const { postData } = useAxios();
	const [item, setItem] = useState({ marketId: "", price: "" });
	const [loading, setLoading] = useState(false);

	const buyItem = async (e) => {
		e.preventDefault();
		setLoading(true);
		const { error, info } = await postData("/api/market/buy", {
			id: item.marketId,
			price: item.price,
		});

		if (info?.success) {
			toast.success(`Purchase successful!`, {
				toastId: item.marketId,
			});
		} else {
			toast.error(
				error.response.data.errorCode === "market_price_changed"
					? "Market price changed!"
					: error.response.data.errorCode === "low_user_balance"
						? "You don't have enough balance, peasant."
						: error.response.data.error,
				{
					toastId: item.marketId,
				},
			);
		}
		setLoading(false);
	};
	return (
		<>
			<Meta title='Buyer | Kolex VIP' />
			<ToastContainer
				position='top-right'
				autoClose={3500}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<div className='mt-10 flex flex-col items-center justify-center'>
				<form onSubmit={buyItem} className='flex flex-col items-center justify-center'>
					<div className='flex flex-col items-center sm:flex-row'>
						<label htmlFor='marketId' className='text-gray-custom mr-1'>
							Market ID:
						</label>
						<input
							type='number'
							name='marketId'
							id='marketId'
							required={true}
							value={item.marketId}
							onChange={(e) => setItem((prev) => ({ ...prev, marketId: e.target.value }))}
							className='input-field'
						/>

						<label htmlFor='price' className='text-gray-custom mr-1 ml-2 mt-2 sm:mt-0'>
							Price:
						</label>
						<input
							type='number'
							name='price'
							id='price'
							min={minPrice}
							step={0.01}
							max={maxPrice}
							required={true}
							value={item.price}
							onChange={(e) => setItem((prev) => ({ ...prev, price: e.target.value }))}
							className='input-field'
						/>
					</div>
					<div className='mt-2 sm:mt-4'>
						<button className='submit-button' type='submit'>
							{loading ? <LoadingSpin /> : "Buy"}
						</button>
					</div>
				</form>
			</div>
		</>
	);
};
export default Feed;
