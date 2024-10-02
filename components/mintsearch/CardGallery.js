import { memo, useState, useRef, useEffect, Fragment } from "react";
import sortBy from "lodash/sortBy";
import pick from "lodash/pick";
import { API } from "@/config/config";
import { useAxios } from "@/hooks/useAxios";
import MarketResults from "./MarketResults";
import MintResults from "./MintResults";
import CardGalleryItem from "./CardGalleryItem";
import { ShoppingCartIcon, UserIcon, SearchIcon } from "@/components/Icons";
import fixDecimal from "@/utils/NumberUtils";

const CardGallery = memo(({ cards, filter, selectedCollection, owned, categoryId }) => {
	const { fetchData } = useAxios();
	const [selectedCards, setSelectedCards] = useState([]);
	const [showMarketResults, setShowMarketResults] = useState(false);
	const [showMintResults, setShowMintResults] = useState(false);
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [needOnly, setNeedOnly] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [usersChecked, setUsersChecked] = useState(0);
	const finished = useRef(false);

	const totalExpected = selectedCards.length * (filter.max - filter.min + 1);

	useEffect(() => {
		//prevent hidden selected items
		setSelectedCards([]);
	}, [needOnly]);

	useEffect(() => {
		if (results.length === totalExpected && totalExpected > 0 && !filter.sigsOnly) {
			finished.current = true;
		}
	}, [results]);

	const processItems = (items, templateKey, user) =>
		items.map((item) => {
			const ownedItem = owned.find((own) => own.templateId === item[templateKey]);
			const ownedRating = ownedItem ? ownedItem?.rating : 0;
			return {
				...sizeReducer(item),
				type: item.type ? item.type : item.card ? "card" : "sticker",
				owner: pick(user, ["id", "username"]),
				title: selectedCards.find((o) => o.id === item[templateKey]).title,
				templateUUID: selectedCards.find((o) => o.id === item[templateKey]).uuid,
				delta: fixDecimal((item.rating - ownedRating) * 10),
			};
		});

	const mintSearch = async () => {
		setLoading(true);
		finished.current = false;
		setResults([]);
		setUsersChecked(0);
		getAllLeaderboard(1);
	};

	const searchUser = async (userId, collectionId, categoryId) => {
		const { result, error } = await fetchData({
			endpoint: `${API}/collections/${collectionId}/users/${userId}/owned2?categoryId=${categoryId}`,
			direct: true,
		});
		if (error) {
			console.error(error);
		}
		return result;
	};

	const getAllLeaderboard = async (firstPage) => {
		let page = firstPage;
		try {
			const data = await getLeaderboard(selectedCollection.collection.id, page);
			if (data && data.length === 0) setLoading(false);
			if (data && data.length > 0) {
				const users = data.map((rank) => ({
					id: rank.user.id,
					username: rank.user.username,
				}));
				for (const leaderboardUser of users) {
					if (!finished.current) {
						try {
							const items = await searchUser(leaderboardUser.id, selectedCollection.collection.id, categoryId);
							if (items) {
								setUsersChecked((prev) => prev + 1);
								if (!filter.sigsOnly && !filter.upgradesOnly) {
									//normal search, follow filters
									const foundCards = processItems(
										items.cards.filter(
											(item) =>
												(filter.batch === "any" || item.mintBatch === filter.batch) &&
												item.mintNumber >= filter.min &&
												item.mintNumber <= filter.max &&
												selectedCards.some((selCard) => selCard.id === item.cardTemplateId)
										),
										"cardTemplateId",
										leaderboardUser
									);
									if (foundCards.length > 0) setResults((prev) => [...prev, ...foundCards]);

									const foundStickers = processItems(
										items.stickers.filter(
											(item) =>
												(filter.batch === "any" || item.mintBatch === filter.batch) &&
												item.mintNumber >= filter.min &&
												item.mintNumber <= filter.max &&
												selectedCards.some((selCard) => selCard.id === item.stickerTemplateId)
										),
										"stickerTemplateId",
										leaderboardUser
									);
									if (foundStickers.length > 0) setResults((prev) => [...prev, ...foundStickers]);
								} else if (filter.sigsOnly) {
									const found = processItems(
										items.cards.filter(
											(card) =>
												card.signatureImage &&
												selectedCards.some((selCard) => selCard.id === card.cardTemplateId)
										),
										"cardTemplateId",
										leaderboardUser
									);

									if (found.length > 0) setResults((prev) => [...prev, ...found]);
								} else if (filter.upgradesOnly) {
									const foundCards = processItems(items.cards, "cardTemplateId", leaderboardUser).filter(
										(item) => item && item.delta > 0
									);
									if (foundCards.length > 0) setResults((prev) => [...prev, ...foundCards]);

									const foundStickers = processItems(
										items.stickers,
										"stickerTemplateId",
										leaderboardUser
									).filter((item) => item && item.delta > 0);
									if (foundStickers.length > 0) setResults((prev) => [...prev, ...foundStickers]);
								}
							}
						} catch (err) {
							console.error(err);
						}
					}
				}
				if (data.length === 20 && !finished.current) {
					getAllLeaderboard(++page);
				} else {
					finished.current = true;
					setLoading(false);
				}
			}
		} catch (err) {
			console.error(err);
		}
	};

	const getLeaderboard = async (collectionId, page) => {
		const { result, error } = await fetchData(`/api/leaderboard/${collectionId}?page=${page}`);
		if (error) {
			console.error(error);
		}
		return result;
	};

	const marketSearch = async () => {
		setResults([]);
		setLoading(true);
		finished.current = false;

		for await (const card of selectedCards) {
			if (!finished.current) {
				await getAllListings(card, 1);
			}
		}
		finished.current = true;
		setLoading(false);
	};

	const getAllListings = async (item, firstPage) => {
		let page = firstPage;
		setLoading(true);
		try {
			const data = await getMarketInfo(item.id, page, item.type);
			if (data && data.count > 0) {
				const ownedItem = owned.find((own) => own.templateId === item.id);
				const ownedRating = ownedItem ? ownedItem?.rating : 0;
				let accepted = [];
				if (item.type === "card") {
					if (!filter.sigsOnly && !filter.upgradesOnly) {
						//normal search, follow filters
						accepted = data.market[0]
							.filter(
								(listing) =>
									Number(listing.price) <= filter.price &&
									listing.card.mintNumber >= filter.min &&
									listing.card.mintNumber <= filter.max &&
									(filter.batch === "any" || listing.card.mintBatch === filter.batch)
							)
							.map((listing) => sizeReducer(listing));
					} else if (filter.sigsOnly) {
						accepted = data.market[0]
							.filter((listing) => Number(listing.price) <= filter.price && listing.card.signatureImage)
							.map((listing) => sizeReducer(listing));
					} else if (filter.upgradesOnly) {
						accepted = data.market[0]
							.filter((listing) => listing.card.rating > ownedRating && Number(listing.price) <= filter.price)
							.map((listing) => sizeReducer(listing));
					}
				}
				if (item.type === "sticker") {
					if (!filter.sigsOnly && !filter.upgradesOnly) {
						accepted = data.market[0]
							.filter(
								(listing) =>
									Number(listing.price) <= filter.price &&
									listing.sticker.mintNumber >= filter.min &&
									listing.sticker.mintNumber <= filter.max &&
									(filter.batch === "any" || listing.sticker.mintBatch === filter.batch)
							)
							.map((listing) => sizeReducer(listing));
					} else if (filter.upgradesOnly) {
						accepted = data.market[0]
							.filter((listing) => listing.sticker.rating > ownedRating)
							.map((listing) => sizeReducer(listing));
					}
				}
				setResults((prev) => [
					...prev,
					...accepted.map((list) => ({
						...list,
						uuid: list.card ? list.card.uuid : list.sticker.uuid,
						title: item.title,
						delta: fixDecimal((list[item.type].rating - ownedRating) * 10),
						templateUUID: item.uuid,
					})),
				]);
				if (
					data.count === 40 &&
					Number(data.market[0][data.count - 1].price) <= filter.price &&
					!finished.current
				) {
					getAllListings(item, ++page);
				}
			}
			// if (data.count < 40) {
			// 	setLoading(false);
			// }
		} catch (err) {
			console.error(err);
		}
	};

	const getMarketInfo = async (cardId, page, type) => {
		const { result, error } = await fetchData(`/api/market/item/${cardId}?page=${page}&type=${type}`);
		if (error) {
			console.error(error);
		}
		return result;
	};

	return (
		<>
			<div className='ml-1 flex h-full'>
				<div className='flex flex-col sm:flex-row'>
					<button
						onClick={() =>
							setSelectedCards(
								cards
									.filter((item) => (needOnly ? !owned.some((owned) => owned.templateId === item.id) : true))
									.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
									.map((template) => ({
										title: template.title,
										type: template.cardType ? "card" : "sticker",
										uuid: template.uuid,
										id: template.id,
									}))
							)
						}
						className='simple-button order-2 m-1 inline-flex justify-center sm:order-1'
					>
						Select All
					</button>
					<button onClick={() => setSelectedCards([])} className='simple-button order-3 m-1 sm:order-2'>
						Deselect All
					</button>
					<span className='order-1 inline-flex w-fit items-center sm:order-3'>
						<label htmlFor='need' className='text-gray-custom mr-1 ml-2 hover:cursor-pointer'>
							Need Only
						</label>
						<input
							type='checkbox'
							name='need'
							id='need'
							onChange={(e) => setNeedOnly(e.target.checked)}
							className='checkbox'
						/>
					</span>
				</div>
				<div className='ml-auto mr-2 flex flex-col justify-end py-1 sm:block'>
					<button
						className='button mb-2 sm:mr-2 sm:mb-0'
						onClick={() => {
							setShowMarketResults(true);
							marketSearch();
						}}
						disabled={!selectedCards.length}
					>
						<ShoppingCartIcon className='mr-2 text-primary-500' />
						<span>Search Market</span>
					</button>
					<button
						className='button'
						onClick={() => {
							setShowMintResults(true);
							mintSearch();
						}}
						disabled={!selectedCards.length}
					>
						<UserIcon className='mr-2 text-primary-500' />
						<span>Search Users</span>
					</button>
				</div>
			</div>
			<div className='my-1 ml-2 flex w-fit items-center'>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search item name'
						className='input-field'
						onChange={(e) => setSearchQuery(e.target.value.trimStart())}
						value={searchQuery}
					/>
					<SearchIcon className='pointer-events-none absolute top-2.5 right-1.5 text-gray-500' />
				</div>
				<div className='text-gray-custom ml-4'>{selectedCards.length} Items selected</div>
			</div>
			<div className='m-2 mt-4 grid grid-cols-2 gap-5 sm:grid-cols-5'>
				{sortBy(cards, [(o) => o.treatmentId, (o) => o.team?.id, (o) => o.id])
					.filter((item) => (needOnly ? !owned.some((owned) => owned.templateId === item.id) : true))
					.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
					.map((item) => (
						<Fragment key={item.uuid}>
							<CardGalleryItem item={item} selectedCards={selectedCards} setSelectedCards={setSelectedCards} />
						</Fragment>
					))}
			</div>
			{showMarketResults && (
				<MarketResults
					showModal={showMarketResults}
					setShowModal={setShowMarketResults}
					results={results}
					loading={loading || !finished}
					finished={finished}
					filter={filter}
					selectedCollection={selectedCollection}
				/>
			)}
			{showMintResults && (
				<MintResults
					showModal={showMintResults}
					setShowModal={setShowMintResults}
					results={results}
					loading={loading}
					total={totalExpected}
					finished={finished}
					filter={filter}
					selectedCollection={selectedCollection}
					usersChecked={usersChecked}
				/>
			)}
		</>
	);
});
CardGallery.displayName = "CardGallery";
export default CardGallery;

const commonFields = [
	"mintBatch",
	"mintNumber",
	"rating",
	"id",
	"marketId",
	"signatureImage",
	"type",
	"uuid",
	"status",
	"price",
	"minOffer",
	"marketId",
	"type",
];

const sizeReducer = (item) => {
	const reduced = {
		...pick(item, commonFields),
		...(item.type === "card" && { cardTemplateId: item.cardTemplateId }),
		...((item.type === "sticker" || !item.type) && {
			stickerTemplateId: item.stickerTemplateId || item.sticker.stickerTemplateId,
		}),
		...(item.card && {
			card: pick(item.card, [...commonFields, "cardTemplateId"]),
		}),
		...(item.sticker && {
			sticker: pick(item.sticker, [...commonFields, "stickerTemplateId"]),
		}),
		...(item.user && {
			user: pick(item.user, ["id", "username"]),
		}),
	};
	return reduced;
};
