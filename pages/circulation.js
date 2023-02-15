import { useContext, useState, useEffect } from "react";
import { UserContext } from "context/UserContext";
import Meta from "@/components/Meta";
import CircList from "@/components/CircList";
import SetSelector from "HOC/SetSelector";
import LoadingSpin from "@/components/LoadingSpin";
import { useAxios } from "hooks/useAxios";

const Circulation = () => {
	const { getCardCirc, getStickerCirc, loading, setLoading } = useContext(UserContext);
	const [collection, setCollection] = useState({
		info: {},
		items: { cards: [], stickers: [] },
	});
	const [selectedCollection, setSelectedCollection] = useState(null);
	const { fetchData } = useAxios();

	const getLinkedPacks = async (templateIds, items) => {
		const { result: packs } = await fetchData("/api/packs/contains", {
			templateIds: templateIds,
		});
		if (packs.length > 0) {
			const { result: packInfo } = await fetchData(`/api/packs/templates/${packs[0].id}`);
			const stickersMinted = items.stickers.map((sticker) => ({
				...sticker,
				mintCount: packInfo.entityTemplates.stickerTemplates.find(
					(template) => template.id === sticker.id
				)?.mintCount,
			}));
			const cardsMinted = items.cards.map((card) => ({
				...card,
				mintCount: packInfo.entityTemplates.cardTemplates.find(
					(template) => template.id === card.id
				)?.mintCount,
			}));

			setCollection((prev) => ({
				info: {
					...prev.info,
				},
				items: { cards: cardsMinted, stickers: stickersMinted },
			}));
		}
		setLoading(false);
	};

	const displayCirc = async () => {
		setLoading(true);
		try {
			setCollection({
				info: {},
				items: { cards: [], stickers: [] },
			});
			const { data: cards } = await getCardCirc(selectedCollection.collection.id);
			const { data: stickers } = await getStickerCirc(selectedCollection.collection.id);
			if (cards.success && stickers.success) {
				const items = {
					cards: cards.data.map((card) => getObj(card, "card")),
					stickers: stickers.data.map((sticker) => getObj(sticker, "sticker")),
				};
				setCollection((collection) => ({
					...collection,
					items: items,
				}));
				await getLinkedPacks([...cards.data, ...stickers.data][0].id, items);
			}
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	};

	useEffect(() => {
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
							<span>
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
						<CircList data={[...collection.items.cards, ...collection.items.stickers]} />
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
