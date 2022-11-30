import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import chunk from "lodash/chunk";
import { useAxios } from "hooks/useAxios";
import LoadingSpin from "../LoadingSpin";

const SendSection = ({ selectedUser, user, loading, setLoading }) => {
	const { fetchData } = useAxios();
	const [collections, setCollections] = useState([]);
	const [progress, setProgress] = useState(0);
	const [items, setItems] = useState([]);
	const counter = useRef(0);
	let isApiSubscribed = true;

	const sendTrades = async () => {
		setLoading(true);
		const itemsChunked = chunk(items, 50);
		for (const entities of itemsChunked) {
			const { result, error } = await postData("/api/trade/create-offer", {
				userId: selectedUser.id,
				entities: entities,
			});
			if (result) {
				counter.current++;
				toast.isActive("success")
					? toast.update("success", {
							render: `Sent ${counter.current} ${
								counter.current === 1 ? "trade" : "trades"
							} to ${selectedUser.username}!`,
					  })
					: toast.success(
							`Sent ${counter.current} ${counter.current === 1 ? "trade" : "trades"} to ${
								selectedUser.username
							}!`,
							{
								toastId: "success",
							}
					  );
			} else {
				console.log(error);
				toast.error(error.response.data.error, {
					toastId: error.response.data.errorCode,
				});
			}
		}
		setLoading(false);
	};

	const scanSet = async (id) => {
		const { result, error } = await fetchData("/api/users/scan", {
			userId: user.user.id,
			collectionId: id,
		});
		if (result) {
			setProgress((prev) => prev + 1);
			const items = [...result.cards, ...result.stickers].map((item) => ({
				id: item.id,
				type: item.type,
			}));
			setItems((prev) => [...prev, ...items]);
		}
		if (error) {
			console.log(error);
			toast.error(error.response.data.error, {
				toastId: error.response.data.errorCode,
			});
		}
	};

	const scanAllSets = async (collections) => {
		for await (const collection of collections) {
			if (collection.id > 10000 && isApiSubscribed) {
				await scanSet(collection.id);
			}
		}
		setLoading(false);
	};

	const getCollections = async () => {
		setLoading(true);
		setCollections([]);
		setItems([]);
		setProgress(0);
		try {
			const { result, error } = await fetchData(
				`/api/collections/users/${user.user.id}/user-summary`
			);
			const miniCollections = result.map((collection) => ({
				id: collection.collection.id,
				name: collection.collection.name,
				uniqueOwned: collection.count,
			}));
			setCollections(miniCollections);
			await scanAllSets(miniCollections);
		} catch (err) {
			console.log(err);
			toast.error(err.response.data.error, {
				toastId: err.response.data.errorCode,
			});
			setLoading(false);
		}
	};

	useEffect(() => {
		return () => (isApiSubscribed = false);
	}, []);

	return (
		<>
			<div className='mt-10 rounded-md border border-gray-700 dark:border-gray-300'>
				<h1 className='p-1 text-lg font-semibold text-gray-700 dark:text-gray-300'>
					{loading
						? `Preparing trades to send to ${selectedUser.username}.\nThis might take several minutes depending on your network status. You can stop this process and send the currently prepared trades (e.g., if you want to do this in batches or any other reason)`
						: `Trades to ${selectedUser.username}`}
				</h1>
				<div className='p-1.5'>
					{loading && <LoadingSpin />}
					<div className='mt-2 text-gray-700 dark:text-gray-300'>
						{progress} / {collections.length} Collections scanned
					</div>
					<div className='text-gray-700 dark:text-gray-300'>
						{items.length} Items found
					</div>
					<div className='text-gray-700 dark:text-gray-300'>
						{Math.ceil(items.length / 50)} {items.length > 50 ? "Trades" : "Trade"}{" "}
						prepared
					</div>
					<div className='mt-4 flex'>
						<button
							type='button'
							className='button ml-auto'
							onClick={getCollections}
							disabled={loading}
						>
							Send All
						</button>
						<button className='button' onClick={() => console.log(collections)}>
							Collections
						</button>
						<button className='button' onClick={() => console.log(items)}>
							Items
						</button>
						<button className='button' onClick={sendTrades}>
							TRADES
						</button>
					</div>
				</div>
			</div>
		</>
	);
};
export default SendSection;
