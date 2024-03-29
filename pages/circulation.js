import { useContext, useState, useEffect } from "react";
import { UserContext } from "context/UserContext";
import SetSelector from "HOC/SetSelector";
import Meta from "@/components/Meta";
import CircList from "@/components/CircList";
import LoadingSpin from "@/components/LoadingSpin";
import { useAxios } from "hooks/useAxios";

const Circulation = () => {
	const { getCardCirc, getStickerCirc, loading, setLoading, categoryId } =
		useContext(UserContext);
	const [collection, setCollection] = useState({
		info: {},
		items: { cards: [], stickers: [] },
	});
	const [selectedCollection, setSelectedCollection] = useState(null);
	const [cardPrices, setCardPrices] = useState([]);
	const [stickerPrices, setStickerPrices] = useState([]);
	const { fetchData } = useAxios();

	const getCardPrices = async (page) => {
		try {
			const { result } = await fetchData(`/api/market/templates`, {
				collectionIds: selectedCollection.collection.id,
				type: "card",
				page: page,
				price: "asc",
				categoryId: categoryId,
			});
			if (result?.templates.length > 0) {
				setCardPrices((prev) => [...prev, ...result.templates]);
				await getCardPrices(++page);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const getStickerPrices = async (page) => {
		try {
			const { result } = await fetchData(`/api/market/templates`, {
				collectionIds: selectedCollection.collection.id,
				type: "sticker",
				page: page,
				price: "asc",
				categoryId: categoryId,
			});
			setStickerPrices((prev) => [...prev, ...result.templates]);
			result && result.templates.length > 0 && (await getStickerPrices(++page));
		} catch (err) {
			console.log(err);
		}
	};

	const displayCirc = async () => {
		setLoading(true);
		try {
			setCollection({
				info: {},
				items: { cards: [], stickers: [] },
			});

			const { data: cards } = await getCardCirc(selectedCollection.collection.id);
			cards.data.length > 0 && (await getCardPrices(1));

			const { data: stickers } = await getStickerCirc(selectedCollection.collection.id);
			stickers.data.length > 0 && (await getStickerPrices(1));

			if (cards.success && stickers.success) {
				const items = {
					cards: cards.data.map((card) => getObj(card, "card")),
					stickers: stickers.data.map((sticker) => getObj(sticker, "sticker")),
				};
				setCollection((collection) => ({
					...collection,
					items: items,
				}));
			}
			setLoading(false);
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	};

	useEffect(() => {
		setCardPrices([]);
		setStickerPrices([]);
		selectedCollection && displayCirc();
	}, [selectedCollection]);

	return (
		<>
			<Meta title='Circulation | Kolex VIP' />
			<div className='flex flex-col items-center'>
				<div className='flex h-full w-full flex-col items-center justify-center pt-5'>
					<div className='px-4 pt-2 text-center font-semibold text-gray-700 dark:text-gray-300'>
						Selected Collection:
						{selectedCollection && (
							<span onClick={() => console.log(cardPrices)}>
								{" "}
								{selectedCollection.collection.properties.seasons[0]} -{" "}
								{selectedCollection.collection.properties.tiers[0]} -{" "}
								{selectedCollection.collection.name}
							</span>
						)}
					</div>
					<SetSelector setSelectedCollection={setSelectedCollection} />
				</div>
				{collection.info?.length > 0 && (
					<div className='mt-3 text-xl font-bold text-gray-300'>
						{collection.info[0].collection.properties.seasons[0]}{" "}
						{collection.info[0].collection.description}
					</div>
				)}
				{loading ? <LoadingSpin /> : null}
				{collection.items.cards.length + collection.items.stickers.length > 0 &&
					!loading && (
						<CircList
							data={[...collection.items.cards, ...collection.items.stickers]}
							prices={[...cardPrices, ...stickerPrices]}
						/>
					)}
			</div>
		</>
	);
};
export default Circulation;

const getObj = (item, type) => {
	return {
		id: item.id,
		inCirculation: item.inCirculation,
		title: item.title,
		minted: item.minted,
		uuid: item.uuid,
		type: type,
	};
};
