import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import _ from "lodash";
import { useAxios } from "hooks/useAxios";
import PurchaseTable from "./PurchaseTable";
import LoadingSpin from "../LoadingSpin";

const PurchasePage = () => {
	const { fetchData, postData } = useAxios();
	const [packId, setPackId] = useState("");
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [filteredItems, setFilteredItems] = useState([]);
	let isApiSubscribed = true;

	const getMarketListings = async (packId, page) => {
		setLoading(true);
		setSearchQuery("");
		setMaxPrice("");
		let currentPage = page;
		if (!isApiSubscribed) return;

		const { result, error } = await fetchData(`/api/market/pack/${packId}`, { page: currentPage });
		if (error) {
			console.log("Error fetching market listings", error);
			return;
		}
		setListings((prev) => _.uniqBy([...prev, ...result.market], "marketId").flat());
		setFilteredItems((prev) => _.uniqBy([...prev, ...result.market], "marketId").flat());

		if (result.count > 0) getMarketListings(packId, ++page);
		else setLoading(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setListings([]);
		setFilteredItems([]);
		getMarketListings(packId, 1);
	};

	const buyAllItems = async () => {
		setLoading(true);
		let counter = 0;
		let totalPrice = 0;
		for (const item of filteredItems) {
			const { error, info } = await postData("/api/market/buy", {
				id: item.marketId,
				price: item.price,
			});
			if (info?.success) {
				totalPrice += Number(item.price);
				counter++;
				toast.isActive("success")
					? toast.update("success", {
							render: `Purchased ${counter}x ${item.pack.packTemplate.name} ${
								counter === 1 ? "pack" : "packs"
							} for a total of $${totalPrice}!`,
					  })
					: toast.success(
							`Purchased ${counter}x ${item.pack.packTemplate.name} ${
								counter === 1 ? "pack" : "packs"
							} for a total of $${totalPrice}!`,
							{
								toastId: "success",
							}
					  );
			} else {
				toast.error(
					error.response.data.errorCode === "market_price_changed"
						? "Market price changed!"
						: error.response.data.error,
					{
						autoClose: 3000,
						position: "top-left",
					}
				);
			}
		}
		setLoading(false);
	};

	useEffect(() => {
		setFilteredItems(
			listings
				.filter((item) => item.user.username.toLowerCase().includes(searchQuery.toLowerCase()))
				.filter((item) => Number(item.price) <= maxPrice || maxPrice === "" || maxPrice === 0.1)
		);
	}, [searchQuery, maxPrice]);

	useEffect(() => {
		return () => (isApiSubscribed = false);
	}, []);

	return (
		<>
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
			<div className='mt-4 mb-8 w-full'>
				<div className='flex flex-col items-center justify-center gap-y-3'>
					<form onSubmit={handleSubmit} className='flex flex-col items-center justify-center gap-y-3'>
						<input
							type='text'
							name='packid'
							id='packid'
							className='input-field'
							placeholder='Enter Pack ID'
							value={packId}
							onChange={(e) => setPackId(e.target.value)}
						/>
						<button className='submit-button' type='submit' disabled={!packId}>
							{loading ? <LoadingSpin /> : "Get listings"}
						</button>
					</form>
				</div>
				<div>
					{listings.length > 0 && (
						<div className='mt-4'>
							<div className='flex items-center'>
								<input
									type='text'
									name='user'
									id='user'
									className='input-field'
									placeholder='Filter user'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									autoComplete='off'
								/>
								<input
									type='number'
									name='price'
									id='price'
									className='input-field ml-3'
									placeholder='Max price'
									value={maxPrice}
									onChange={(e) => setMaxPrice(e.target.value)}
									min={0.1}
									step={0.01}
									max={10000}
								/>
								<span className='ml-auto mr-2 text-gray-700 dark:text-gray-300'>
									{filteredItems.length} Items - Total price:{" "}
									<span className='font-semibold underline'>
										${filteredItems.reduce((sum, item) => sum + Number(item.price), 0).toFixed(2)}
									</span>
								</span>
								<button className='button mr-2' disabled={!filteredItems.length} onClick={buyAllItems}>
									Buy All
								</button>
							</div>
							<div className='mt-4 border'>
								<PurchaseTable results={filteredItems} loading={loading} setLoading={setLoading} />
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};
export default PurchasePage;
