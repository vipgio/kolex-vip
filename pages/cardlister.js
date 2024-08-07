import { useState, useContext, useEffect } from "react";
import pick from "lodash/pick";
import { UserContext } from "context/UserContext";
import { useAxios } from "hooks/useAxios";
import SetSelector from "HOC/SetSelector";
import Meta from "@/components/Meta";
import LoadingSpin from "@/components/LoadingSpin";
import CardGallery from "@/components/cardlister/CardGallery";
import ListedModal from "@/components/cardlister/ListedModal";
import Tooltip from "@/components/Tooltip";
import RefreshButton from "@/components/RefreshButton";

const Cardlister = () => {
	const { user } = useContext(UserContext);
	const { fetchData } = useAxios();
	const [selectedCollection, setSelectedCollection] = useState(null);
	const [templates, setTemplates] = useState([]);
	const [showListedModal, setShowListedModal] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		selectedCollection && getCards();
	}, [selectedCollection]);

	const getCards = async () => {
		setLoading(true);
		setTemplates([]);
		try {
			const { data: templates } = await getCollection(selectedCollection.collection.id);
			const cards = await getCardIds(user.user.id, selectedCollection.collection.id);
			const owned = await getOwned(user.user.id, selectedCollection.collection.id);
			if (templates) {
				const countedTemplates = templates.map((card) => {
					const cardCount = cards.find((o) => o.cardTemplateId === card.id);
					const stickerCount = cards.find((o) => o.stickerTemplateId === card.id);
					const count = cardCount || stickerCount;
					return {
						...pick(card, [
							"id",
							"title",
							"images",
							"inCirculation",
							"cardType",
							"treatmentId",
							"uuid",
							"minted",
						]),
						count: count ? (count.cardIds ? count.cardIds.length : count.stickerIds.length) : 0,
						type: card.cardType ? "card" : "sticker",
						listed: [...owned.cards, ...owned.stickers].filter(
							(own) =>
								(own.cardTemplateId === card.id || own.stickerTemplateId === card.id) &&
								own.status === "market"
						).length,
					};
				});
				setTemplates(countedTemplates);
				await getAllMarket(
					templates.filter((item) => item.cardType),
					1,
					"card"
				);
				await getAllMarket(
					templates.filter((item) => !item.cardType),
					1,
					"sticker"
				);
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	};

	const getCollection = async (collectionId) => {
		const { result: cards, errorCards } = await fetchData(`/api/collections/cards/${collectionId}`);
		const { result: stickers, errorStickers } = await fetchData(`/api/collections/stickers/${collectionId}`);
		if (errorCards || errorStickers) {
			console.error(errorCards || errorStickers);
			return;
		}
		const result = {
			success: cards && stickers,
			data: [...cards, ...stickers],
		};
		return result;
	};

	const getCardIds = async (userId, collectionId) => {
		const { result, error } = await fetchData(`/api/collections/users/${userId}/cardids`, {
			collectionId: collectionId,
		});
		if (error) {
			console.error(error);
			return;
		}
		return result;
	};

	const getAllMarket = async (cards, firstPage, type) => {
		setLoading(true);
		let page = firstPage;
		if (cards.length > 0) {
			try {
				const data = await getMarketInfo(cards, page, type);
				if (data && data.templates.length > 0) {
					setTemplates((prev) =>
						prev.map((temp) => {
							const index = data.templates.findIndex((o) => o.entityTemplateId === temp.id);
							if (index !== -1) {
								return {
									...temp,
									floor: data.templates[index]?.lowestPrice,
								};
							} else {
								return temp;
							}
						})
					);
					// if (data.templates.length > 0) getAllMarket(cards, ++page, type);
					setLoading(false);
					return data;
				}
			} catch (err) {
				console.log(err);
			}
		} else {
			setLoading(false);
		}
	};

	const getMarketInfo = async (templates, page, type) => {
		const { result, error } = await fetchData(`/api/market/templates`, {
			type: type,
			page: page,
			price: "asc",
			collectionIds: selectedCollection.collection.id,
		});
		if (error) {
			console.error(error);
			return;
		}
		return result;
	};

	const getOwned = async (userId, collectionId) => {
		const { result, error } = await fetchData(`/api/users/scan`, {
			collectionId: collectionId,
			userId: userId,
		});
		if (error) {
			console.error(error);
			return;
		}
		return result;
	};

	return (
		<>
			<Meta title='Card Lister | Kolex VIP' />
			<div className='flex'>
				<div className='flex flex-col'>
					<div className='mt-10 px-2 pt-2 font-semibold text-gray-700 dark:text-gray-300'>
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
				<div className='ml-auto mr-2 mb-2 flex items-end'>
					<RefreshButton
						style='absolute top-14 right-2 mt-2'
						func={getCards}
						loading={loading}
						disabled={loading || !selectedCollection}
						title='Refresh Items'
					/>

					<div className='flex items-center'>
						<Tooltip
							direction='left'
							text={`It will load ALL your items. If you have too many it's gonna take a while or you can stop loading the items by clicking on "Stop".`}
						/>
						<button className='button' onClick={() => setShowListedModal(true)}>
							Manage Listings
						</button>
					</div>
				</div>
			</div>
			{loading && (
				<div className='flex justify-center py-2'>
					<LoadingSpin />
				</div>
			)}
			{templates.length > 0 && <CardGallery templates={templates} user={user} />}
			{showListedModal && <ListedModal showModal={showListedModal} setShowModal={setShowListedModal} />}
		</>
	);
};
export default Cardlister;
