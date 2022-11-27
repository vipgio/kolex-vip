import React, { useState, useRef, useEffect, Fragment } from "react";
import axios from "axios";
import sortBy from "lodash/sortBy";
import { FiUser, FiShoppingCart } from "react-icons/fi";
import MarketResults from "./MarketResults";
import MintResults from "./MintResults";
import fixDecimal from "utils/NumberUtils";
import CardGalleryItem from "./CardGalleryItem";

const CardGallery = React.memo(({ cards, user, filter, selectedCollection, owned }) => {
	const [selectedCards, setSelectedCards] = useState([]);
	const [showMarketResults, setShowMarketResults] = useState(false);
	const [showMintResults, setShowMintResults] = useState(false);
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [needOnly, setNeedOnly] = useState(false);
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

	const mintSearch = async () => {
		setLoading(true);
		finished.current = false;
		setResults([]);
		getAllLeaderboard(1);
	};

	const getAllLeaderboard = async (firstPage) => {
		let page = firstPage;
		try {
			const data = await getLeaderboard(selectedCollection.collection.id, page);
			if (data.success && data.data.length === 0) setLoading(false);
			if (data.success && data.data.length > 0) {
				const users = data.data.map((rank) => ({
					id: rank.user.id,
					username: rank.user.username,
				}));
				for (const leaderboardUser of users) {
					if (!finished.current) {
						try {
							const { data } = await axios.get(`/api/users/scan`, {
								params: {
									collectionId: selectedCollection.collection.id,
									userId: leaderboardUser.id,
								},
								headers: {
									jwt: user.jwt,
								},
							});
							if (data.success) {
								if (!filter.sigsOnly && !filter.upgradesOnly) {
									const foundCards = data.data.cards
										.filter(
											(item) =>
												item.mintBatch === filter.batch &&
												item.mintNumber >= filter.min &&
												item.mintNumber <= filter.max &&
												selectedCards.some(
													(selCard) => selCard.id === item.cardTemplateId
												)
										)
										.map((item) => {
											const ownedItem = owned.find(
												(own) => own.templateId === item.cardTemplateId
											);
											const ownedRating = ownedItem ? ownedItem?.rating : 0;
											return {
												...item,
												owner: leaderboardUser,
												title: selectedCards.find((o) => o.id === item.cardTemplateId)
													.title,
												delta: fixDecimal((item.rating - ownedRating) * 10),
											};
										});
									if (foundCards.length > 0)
										setResults((prev) => [...prev, ...foundCards]);

									const foundtickers = data.data.stickers
										.filter(
											(item) =>
												item.mintBatch === filter.batch &&
												item.mintNumber >= filter.min &&
												item.mintNumber <= filter.max &&
												selectedCards.some(
													(selCard) => selCard.id === item.stickerTemplateId
												)
										)
										.map((item) => {
											const ownedItem = owned.find(
												(own) => own.templateId === item.stickerTemplateId
											);
											const ownedRating = ownedItem ? ownedItem?.rating : 0;
											return {
												...pickObj(item),
												owner: leaderboardUser,
												title: selectedCards.find((o) => o.id === item.stickerTemplateId)
													.title,
												delta: fixDecimal((item.rating - ownedRating) * 10),
											};
										});
									if (foundtickers.length > 0)
										setResults((prev) => [...prev, ...foundtickers]);
								} else if (filter.sigsOnly) {
									const found = data.data.cards
										.filter(
											(card) =>
												card.signatureImage &&
												selectedCards.some(
													(selCard) => selCard.id === card.cardTemplateId
												)
										)
										.map((item) => {
											const ownedItem = owned.find(
												(own) => own.templateId === item.cardTemplateId
											);
											const ownedRating = ownedItem ? ownedItem?.rating : 0;
											return {
												...pickObj(item),
												owner: leaderboardUser,
												title: selectedCards.find((o) => o.id === item.cardTemplateId)
													.title,
												delta: fixDecimal((item.rating - ownedRating) * 10),
											};
										});

									if (found.length > 0) setResults((prev) => [...prev, ...found]);
								} else if (filter.upgradesOnly) {
									const foundCards = data.data.cards
										.map((item) => {
											const ownedItem = owned.find(
												(own) => own.templateId === item.cardTemplateId
											);
											const ownedRating = ownedItem ? ownedItem?.rating : 0;
											const delta = fixDecimal((item.rating - ownedRating) * 10);
											if (
												selectedCards.some(
													(selCard) => selCard.id === item.cardTemplateId
												)
											) {
												return {
													...pickObj(item),
													owner: leaderboardUser,
													title: selectedCards.find((o) => o.id === item.cardTemplateId)
														.title,
													delta: delta,
												};
											}
										})
										.filter((item) => item && item.delta > 0);
									if (foundCards.length > 0)
										setResults((prev) => [...prev, ...foundCards]);

									const foundStickers = data.data.stickers
										.map((item) => {
											const ownedItem = owned.find(
												(own) => own.templateId === item.stickerTemplateId
											);
											const ownedRating = ownedItem ? ownedItem?.rating : 0;
											const delta = fixDecimal((item.rating - ownedRating) * 10);
											if (
												selectedCards.some(
													(selCard) => selCard.id === item.stickerTemplateId
												)
											) {
												return {
													...pickObj(item),
													owner: leaderboardUser,
													title: selectedCards.find(
														(o) => o.id === item.stickerTemplateId
													).title,
													delta: delta,
												};
											}
										})
										.filter((item) => item && item.delta > 0);
									if (foundStickers.length > 0)
										setResults((prev) => [...prev, ...foundStickers]);
								}
							}
						} catch (err) {
							console.log(err);
						}
					}
				}
				if (data.data.length === 20 && !finished.current) {
					getAllLeaderboard(++page);
				} else {
					finished.current = true;
					setLoading(false);
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	const getLeaderboard = async (collectionId, page) => {
		const { data } = await axios.get(`/api/leaderboard/${collectionId}?page=${page}`, {
			headers: {
				jwt: user.jwt,
			},
		});
		return data;
	};

	const marketSearch = async () => {
		setResults([]);
		setLoading(true);
		finished.current = false;

		for (const card of selectedCards) {
			if (!finished.current) {
				await getAllListings(card, 1);
			}
		}

		setLoading(false);
		finished.current = true;
	};

	const getAllListings = async (item, firstPage) => {
		let page = firstPage;
		try {
			const data = await getMarketInfo(item.id, page, item.type);
			if (data.success && data.data.count > 0) {
				const ownedItem = owned.filter((own) => own.templateId === item.id)[0];
				const ownedRating = ownedItem ? ownedItem?.rating : 0;
				let accepted = [];
				if (item.type === "card") {
					if (!filter.sigsOnly && !filter.upgradesOnly) {
						//normal search, follow filters
						accepted = data.data.market[0].filter(
							(listing) =>
								Number(listing.price) <= filter.price &&
								listing.card.mintNumber >= filter.min &&
								listing.card.mintNumber <= filter.max &&
								listing.card.mintBatch === filter.batch
						);
					} else if (filter.sigsOnly) {
						accepted = data.data.market[0].filter(
							(listing) =>
								Number(listing.price) <= filter.price && listing.card.signatureImage
						);
					} else if (filter.upgradesOnly) {
						accepted = data.data.market[0].filter(
							(listing) =>
								listing.card.rating > ownedRating && Number(listing.price) <= filter.price
						);
					}
				}
				if (item.type === "sticker") {
					if (!filter.sigsOnly && !filter.upgradesOnly) {
						accepted = data.data.market[0].filter(
							(listing) =>
								Number(listing.price) <= filter.price &&
								listing.sticker.mintNumber >= filter.min &&
								listing.sticker.mintNumber <= filter.max &&
								listing.sticker.mintBatch === filter.batch
						);
					} else if (filter.upgradesOnly) {
						accepted = data.data.market[0].filter(
							(listing) => listing.sticker.rating > ownedRating
						);
					}
				}
				setResults((prev) => [
					...prev,
					...accepted.map((list) => ({
						...list,
						title: item.title,
						delta: fixDecimal((list[item.type].rating - ownedRating) * 10),
					})),
				]);
				if (
					data.data.count === 40 &&
					Number(data.data.market[0][39].price) < filter.price &&
					!finished.current
				) {
					getAllListings(item, ++page);
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	const getMarketInfo = async (cardId, page, type) => {
		const { data } = await axios.get(
			`/api/market/card/${cardId}?page=${page}&type=${type}`,
			{
				headers: {
					jwt: user.jwt,
				},
			}
		);
		return data;
	};

	return (
		<>
			<div className='ml-1 flex h-full'>
				<div className='flex flex-col sm:block'>
					<button
						onClick={() =>
							setSelectedCards(
								cards
									.filter((item) =>
										needOnly ? !owned.some((owned) => owned.templateId === item.id) : true
									)
									.map((card) => ({
										id: card.id,
										title: card.title,
										type: card.cardType ? "card" : "sticker",
									}))
							)
						}
						className='simple-button m-1 inline-flex justify-center'
					>
						Select All
					</button>
					<button onClick={() => setSelectedCards([])} className='simple-button m-1'>
						Deselect All
					</button>
					<span className='inline-flex w-fit items-center'>
						<label
							htmlFor='need'
							className='mr-1 ml-2 text-gray-800 hover:cursor-pointer dark:text-gray-200'
						>
							Need Only
						</label>
						<input
							type='checkbox'
							name='need'
							id='need'
							onChange={(e) => setNeedOnly(e.target.checked)}
							className='accent-orange-500 hover:cursor-pointer'
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
						<FiShoppingCart className='mr-2 text-orange-500' />
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
						<FiUser className='mr-2 text-orange-500' />
						<span>Search Users</span>
					</button>
				</div>
			</div>
			<div className='m-2 grid grid-cols-2 gap-3 sm:grid-cols-5'>
				{sortBy(cards, [(o) => o.treatmentId, (o) => o.team?.id, (o) => o.id])
					.filter((item) =>
						needOnly ? !owned.some((owned) => owned.templateId === item.id) : true
					)
					.map((item) => (
						<Fragment key={item.uuid}>
							<CardGalleryItem
								item={item}
								selectedCards={selectedCards}
								setSelectedCards={setSelectedCards}
							/>
						</Fragment>
					))}
			</div>
			{showMarketResults && (
				<MarketResults
					showModal={showMarketResults}
					setShowModal={setShowMarketResults}
					results={results}
					loading={loading}
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
				/>
			)}
		</>
	);
});
CardGallery.displayName = "CardGallery";
export default CardGallery;

const pickObj = (item) => {
	return {
		mintBatch: item.mintBatch,
		mintNumber: item.mintNumber,
		rating: item.rating,
		cardTemplateId: item.cardTemplateId,
		id: item.id,
		signatureImage: item.signatureImage,
		status: item.status,
		type: item.type,
	};
};
