import { useState, useEffect } from "react";
import uniqBy from "lodash/uniqBy";
import { useAxios } from "@/hooks/useAxios";
import SetSelector from "@/HOC/SetSelector";
import Meta from "@/components/Meta";
import CircList from "@/components/circulation/CircList";
import LoadingSpin from "@/components/LoadingSpin";
import RefreshButton from "@/components/RefreshButton";
import PacksList from "@/components/circulation/PacksList";

const Circulation = () => {
	const { fetchData } = useAxios();
	const [loading, setLoading] = useState(false);
	const [collection, setCollection] = useState({
		info: {},
		items: { cards: [], stickers: [] },
	});
	const [selectedCollection, setSelectedCollection] = useState(null);
	const [cardPrices, setCardPrices] = useState([]);
	const [stickerPrices, setStickerPrices] = useState([]);
	const [packs, setPacks] = useState([]);

	const getPacks = async (items) => {
		try {
			const chunkSize = 10;
			const templateIds = items.map((item) => item.templateId);
			for (let i = 0; i < templateIds.length; i += chunkSize) {
				const chunk = templateIds.slice(i, i + chunkSize);
				const { result } = await fetchData({
					endpoint: `/api/packs/contains`,
					params: {
						templateIds: chunk.toString(),
					},
				});
				setPacks((prev) => uniqBy([...prev, ...result], "id").sort((a, b) => a.id - b.id));
			}
		} catch (err) {
			console.error(err);
		}
	};

	const getCardPrices = async (page) => {
		try {
			const { result } = await fetchData({
				endpoint: `/api/market/templates`,
				params: {
					collectionIds: selectedCollection.collection.id,
					type: "card",
					page: page,
					price: "asc",
				},
				forceCategoryId: true,
			});
			if (result?.templates.length > 0) {
				setCardPrices((prev) => [...prev, ...result.templates]);
				await getCardPrices(++page);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const getStickerPrices = async (page) => {
		try {
			const { result } = await fetchData({
				endpoint: `/api/market/templates`,
				params: {
					collectionIds: selectedCollection.collection.id,
					type: "sticker",
					page: page,
					price: "asc",
				},
				forceCategoryId: true,
			});
			setStickerPrices((prev) => [...prev, ...result.templates]);
			result && result.templates.length > 0 && (await getStickerPrices(++page));
		} catch (err) {
			console.error(err);
		}
	};

	const getCardsCirc = async (collectionId) => {
		const { result, error } = await fetchData(`/api/collections/cards/${collectionId}`);
		if (error) {
			console.error(error);
		}
		return result;
	};

	const getStickersCirc = async (collectionId) => {
		const { result, error } = await fetchData(`/api/collections/stickers/${collectionId}`);
		if (error) {
			console.error(error);
		}
		return result;
	};

	const displayCirc = async () => {
		setLoading(true);
		setCardPrices([]);
		setStickerPrices([]);
		setPacks([]);
		setCollection({
			info: {},
			items: { cards: [], stickers: [] },
		});
		try {
			const cards = await getCardsCirc(selectedCollection.collection.id);
			cards.length > 0 && (await getCardPrices(1));

			const stickers = await getStickersCirc(selectedCollection.collection.id);
			stickers.length > 0 && (await getStickerPrices(1));

			if (cards && stickers) {
				const items = {
					cards: cards.map((card) => getObj(card, "card")),
					stickers: stickers.map((sticker) => getObj(sticker, "sticker")),
				};
				setCollection((collection) => ({
					...collection,
					items: items,
				}));
				await getPacks([...items.cards, ...items.stickers]);
			}
			setLoading(false);
		} catch (err) {
			console.error(err);
			setLoading(false);
		}
	};

	const refreshData = async () => {
		displayCirc();
	};

	useEffect(() => {
		selectedCollection && displayCirc();
	}, [selectedCollection]);

	return (
		<>
			<Meta title='Circulation | Kolex VIP' />
			<div className='flex flex-col items-center'>
				<div className='flex h-full w-full flex-col items-center justify-center pt-5'>
					<div className='text-gray-custom px-4 pt-2 text-center font-semibold'>
						Selected Collection:
						{selectedCollection && (
							<span>
								{" "}
								{selectedCollection.collection.properties.seasons[0]} -{" "}
								{selectedCollection.collection.properties.tiers[0]} - {selectedCollection.collection.name}
							</span>
						)}
					</div>
					<SetSelector setSelectedCollection={setSelectedCollection} />
				</div>
				{collection.info?.length > 0 && (
					<div className='mt-3 text-xl font-bold text-gray-300'>
						{collection.info[0].collection.properties.seasons[0]} {collection.info[0].collection.description}
					</div>
				)}
				{loading ? (
					<LoadingSpin />
				) : (
					<div className='mb-2 flex'>
						<span className='mx-auto'>
							<RefreshButton
								loading={loading}
								title='Refresh Circulation'
								func={refreshData}
								disabled={!selectedCollection}
							/>
						</span>
					</div>
				)}

				{collection.items.cards.length + collection.items.stickers.length > 0 && !loading && (
					<>
						{packs.length > 0 && (
							<div className='relative flex w-full flex-col items-center px-2 text-center'>
								<button className='text-gray-custom'>
									<span>
										{packs.length} {packs.length > 1 ? "Packs" : "Pack"} containing this set:
									</span>
								</button>
								<PacksList packs={packs} />
							</div>
						)}
						<CircList
							data={[...collection.items.cards, ...collection.items.stickers]}
							prices={[...cardPrices, ...stickerPrices]}
						/>
					</>
				)}
			</div>
		</>
	);
};
export default Circulation;

const getObj = (item, type) => {
	return {
		templateId: item.id,
		inCirculation: item.inCirculation,
		title: item.title,
		minted: item.minted,
		uuid: item.uuid,
		type: type,
	};
};
