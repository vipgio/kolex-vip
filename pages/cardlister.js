import { useState, useContext, useEffect } from "react";
import axios from "axios";
import pick from "lodash/pick";
import { UserContext } from "context/UserContext";
import SetSelector from "HOC/SetSelector";
import Meta from "@/components/Meta";
import LoadingSpin from "@/components/LoadingSpin";
import CardGallery from "@/components/cardlister/CardGallery";
import ListedModal from "@/components/cardlister/ListedModal";
import Tooltip from "@/components/Tooltip";

const Cardlister = () => {
	const { user } = useContext(UserContext);
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
			const { data: cards } = await getCardIds(
				user.user.id,
				selectedCollection.collection.id
			);
			const { data: owned } = await getOwned(
				user.user.id,
				selectedCollection.collection.id
			);
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
						]),
						count: count
							? count.cardIds
								? count.cardIds.length
								: count.stickerIds.length
							: 0,
						type: card.cardType ? "card" : "sticker",
						listedAny: [...owned.cards, ...owned.stickers].some(
							(own) => own.cardTemplateId === card.id && own.status === "market"
						),
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
		const { data: cards } = await axios.get(`/api/collections/cards/${collectionId}`, {
			headers: {
				jwt: user.jwt,
			},
		});
		const { data: stickers } = await axios.get(
			`/api/collections/stickers/${collectionId}`,
			{
				headers: {
					jwt: user.jwt,
				},
			}
		);
		const result = {
			success: cards.success && stickers.success,
			data: [...cards.data, ...stickers.data],
		};
		return result;
	};

	const getCardIds = async (userId, collectionId) => {
		const { data } = await axios.get(`/api/collections/users/${userId}/cardids`, {
			params: {
				collectionId: collectionId,
			},
			headers: {
				jwt: user.jwt,
			},
		});
		return data;
	};

	const getAllMarket = async (cards, firstPage, type) => {
		let page = firstPage;
		if (cards.length > 0)
			try {
				const data = await getMarketInfo(cards, page, type);
				if (data.success && data.data.templates.length > 0) {
					setTemplates((prev) =>
						prev.map((temp) => {
							const index = data.data.templates.findIndex(
								(o) => o.entityTemplateId === temp.id
							);
							if (index !== -1) {
								return {
									...temp,
									floor: data.data.templates[index]?.lowestPrice,
								};
							} else {
								return temp;
							}
						})
					);
					if (data.data.templates.length > 0) getAllMarket(cards, ++page, type);
					return data;
				}
			} catch (err) {
				console.log(err);
			}
	};

	const getMarketInfo = async (templates, page, type) => {
		try {
			const { data } = await axios.get(`/api/market/templates`, {
				params: {
					templateIds: templates.map((o) => o.id).toString(),
					type: type,
					page: page,
					price: "asc",
				},
				headers: {
					jwt: user.jwt,
				},
			});
			return data;
		} catch (err) {
			console.log(err);
		}
	};

	const getOwned = async (userId, collectionId) => {
		const { data } = await axios.get(`/api/users/scan`, {
			params: {
				collectionId: collectionId,
				userId: userId,
			},
			headers: {
				jwt: user.jwt,
			},
		});
		return data;
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
								{selectedCollection.collection.properties.tiers[0]} -{" "}
								{selectedCollection.collection.name}
							</span>
						)}
					</div>
					<SetSelector setSelectedCollection={setSelectedCollection} />
				</div>
				<div className='ml-auto mr-2 mb-2 flex items-end'>
					<button
						title='Refresh packs'
						className='absolute top-14 right-2 mt-2 flex flex-col items-center rounded-md bg-red-500 p-1 font-semibold disabled:cursor-not-allowed disabled:opacity-50'
						disabled={loading}
						onClick={getCards}
					>
						{/* Refresh packs */}
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className={`h-6 w-6 cursor-pointer ${loading && "animate-spin-ac"}`}
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							strokeWidth={2}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
							/>
						</svg>
					</button>
					<div className='flex items-center'>
						<Tooltip
							direction='left'
							text={`It will load ALL your items. If you have too many it's gonna take a while or you can stop loading the items by clicking on "Stop".`}
						/>
						<button className='button' onClick={() => setShowListedModal(true)}>
							Edit All Listings
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
			{showListedModal && (
				<ListedModal showModal={showListedModal} setShowModal={setShowListedModal} />
			)}
		</>
	);
};
export default Cardlister;
