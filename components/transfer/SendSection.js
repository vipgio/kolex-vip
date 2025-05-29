import { createClient } from "@supabase/supabase-js";

import { useContext, useEffect, useRef, useState } from "react";

import chunk from "lodash/chunk";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { UserContext } from "@/context/UserContext";

import { useAxios } from "@/hooks/useAxios";

import LoadingSpin from "../LoadingSpin";

const SendSection = ({ transferMode, selectedUser, loading, setLoading }) => {
	const { fetchData, postData } = useAxios();
	const { user, setUser } = useContext(UserContext);
	const [collections, setCollections] = useState([]);
	const [progress, setProgress] = useState({ collections: 0, sent: 0 });
	const [items, setItems] = useState([]);
	const counter = useRef(0);
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
	const supabase = createClient(supabaseUrl, supabaseKey);
	let isApiSubscribed = true;

	const sendTrades = async () => {
		setLoading(true);
		await handleUse();
		const itemsChunked = chunk(items, 50);
		for (const entities of itemsChunked) {
			const { result, error } = await postData("/api/trade/create-offer", {
				userId: selectedUser.id,
				entities: entities,
			});
			if (result) {
				setProgress((prev) => ({ ...prev, trades: prev.trades + 1 }));
				counter.current++;
				toast.isActive("success")
					? toast.update("success", {
							render: `Sent ${counter.current} ${counter.current === 1 ? "trade" : "trades"} to ${
								selectedUser.username
							}!`,
						})
					: toast.success(
							`Sent ${counter.current} ${counter.current === 1 ? "trade" : "trades"} to ${
								selectedUser.username
							}!`,
							{
								toastId: "success",
							},
						);
			} else {
				console.error(error);
				toast.error(error.response.data.error);
			}
		}
		setLoading(false);
	};

	const scanSet = async (id) => {
		const { result, error } =
			transferMode.id === "cardid"
				? await fetchData({
						endpoint: `/api/collections/users/${user.user.id}/cardids`,
						params: {
							userId: user.user.id,
							collectionId: id,
						},
						forceCategoryId: true,
					})
				: await fetchData("/api/users/scan", {
						//transferMode.id === 'scan'
						userId: user.user.id,
						collectionId: id,
					});
		if (result) {
			setProgress((prev) => ({ ...prev, collections: prev.collections + 1 }));
			const items =
				transferMode.id === "cardid"
					? result
							.map((res) => {
								const type = res.cardTemplateId ? "card" : "sticker";
								const ids = type === "card" ? res.cardIds : res.stickerIds;
								const objects = ids.map((item) => ({
									id: item,
									type: type,
								}));
								return objects;
							})
							.flat()
					: [...result.cards, ...result.stickers]
							.filter((item) => item.status === "available")
							.map((item) => ({
								id: item.id,
								type: item.stickerTemplateId ? "sticker" : "card",
							}));
			setItems((prev) => [...prev, ...items]);
		}
		if (error) {
			console.error(error);
			toast.error(error.response.data.error, {
				toastId: error.response.data.errorCode,
			});
		}
	};

	const scanAllSets = async (collections) => {
		for await (const collection of collections) {
			if (isApiSubscribed) {
				await scanSet(collection.id);
			}
		}
		setLoading(false);
	};

	const getCollections = async () => {
		setLoading(true);
		setCollections([]);
		setItems([]);
		counter.current = 0;
		setProgress({ collections: 0, trades: 0 });
		try {
			const { result, error } = await fetchData({
				endpoint: `/api/collections/users/${user.user.id}/user-summary`,
				forceCategoryId: true,
			});
			console.log(result);
			const miniCollections = result.map((collection) => ({
				id: collection.collection.id,
				name: collection.collection.name,
				uniqueOwned: collection.count,
			}));
			setCollections(miniCollections);
			await scanAllSets(miniCollections);
		} catch (err) {
			console.error(err);
			toast.error(err.response.data.error, {
				toastId: err.response.data.errorCode,
			});
			setLoading(false);
		}
	};

	useEffect(() => {
		return () => (isApiSubscribed = false);
	}, []);

	const handleUse = async () => {
		//update the transfers counter in user context and supabase table
		setUser((prev) => ({
			...prev,
			info: { ...prev.info, transfers: prev.info.transfers - 1 },
		}));
		await supabase
			.from("whitelist")
			.update({
				info: {
					allowed: user.info.allowed,
					transfers: user.info.transfers - 1,
				},
			})
			.eq("username", user.user.username);
	};

	return (
		<div className='text-gray-custom flex w-full flex-col p-3 pt-2'>
			<h1 className='text-xl font-semibold'>
				{loading
					? `Preparing trades to send to ${selectedUser.username}.\nThis might take several minutes depending on your network status.`
					: `Trades to ${selectedUser.username}`}
			</h1>
			<div className='flex h-full flex-col'>
				{loading && (
					<div className='mt-2'>
						<LoadingSpin />
					</div>
				)}
				<div className='mt-2'>
					{progress.collections} / {collections.length} Collections scanned
				</div>
				<div>{items.length} Items found</div>
				<div>
					{Math.ceil(items.length / 50)} {items.length > 50 ? "Trades" : "Trade"} prepared
				</div>
				{progress.trades > 0 && (
					<div>
						{progress.trades} / {Math.ceil(items.length / 50)}{" "}
						{items.length > 50 ? "Trades" : "Trade"} sent
					</div>
				)}
				<div className='mt-2 flex xs:mt-auto'>
					<button
						type='button'
						className='button'
						onClick={getCollections}
						disabled={loading || !transferMode}
					>
						Prepare trades
					</button>
					<button
						className='button ml-auto'
						onClick={sendTrades}
						disabled={loading || !transferMode || items.length === 0}
					>
						Send trades
					</button>
				</div>
			</div>
		</div>
	);
};
export default SendSection;
