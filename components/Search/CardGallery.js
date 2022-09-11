import Image from "next/future/image";
import { useState } from "react";
import axios from "axios";
import sortBy from "lodash/sortBy";
import MarketResults from "./MarketResults";
import { FiUser, FiShoppingCart, FiLock } from "react-icons/fi";
import MintResults from "./MintResults";
import { useRef } from "react";

const CardGallery = ({
	cards,
	selectedCards,
	setSelectedCards,
	user,
	filter,
	selectedCollection,
}) => {
	const [showMarketResults, setShowMarketResults] = useState(false);
	const [showMintResults, setShowMintResults] = useState(false);
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const counted = useRef(0);

	const totalExpected = selectedCards.length * (filter.max - filter.min + 1);

	const mintSearch = async () => {
		setLoading(true);
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
					if (counted.current < totalExpected) {
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
								const items = [...data.data.cards, ...data.data.stickers];
								const found = items
									.filter(
										(card) =>
											card.mintBatch === filter.batch &&
											card.mintNumber >= filter.min &&
											card.mintNumber <= filter.max &&
											selectedCards.some((selCard) => selCard.id === card.cardTemplateId)
									)
									.map((item) => ({
										...item,
										owner: leaderboardUser,
										title: selectedCards.find((o) => o.id === item.cardTemplateId).title,
									}));
								counted.current += found.length;
								setResults((prev) => [...prev, ...found]);
							}
						} catch (err) {
							console.log(err);
						}
					}
				}
				if (data.data.length === 20) {
					getAllLeaderboard(++page);
				} else {
					counted.current = 0;
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
		setLoading(true);
		setResults([]);
		for (const card of selectedCards) {
			await getAllListings(card, 1);
		}
		setLoading(false);
	};

	const getAllListings = async (card, firstPage) => {
		let page = firstPage;
		try {
			const data = await getMarketInfo(card.id, page, card.type);
			if (data.success && data.data.count > 0) {
				if (card.type === "card") {
					const accepted = data.data.market[0].filter(
						(listing) =>
							Number(listing.price) <= filter.price &&
							listing.card.mintNumber >= filter.min &&
							listing.card.mintNumber <= filter.max &&
							listing.card.mintBatch === filter.batch
					);
					setResults((prev) => [
						...prev,
						...accepted.map((list) => ({ ...list, title: card.title })),
					]);
				}
				if (card.type === "sticker") {
					const accepted = data.data.market[0].filter(
						(listing) =>
							Number(listing.price) <= filter.price &&
							listing.sticker.mintNumber >= filter.min &&
							listing.sticker.mintNumber <= filter.max &&
							listing.sticker.mintBatch === filter.batch
					);
					setResults((prev) => [
						...prev,
						...accepted.map((list) => ({ ...list, title: card.title })),
					]);
				}
				if (
					data.data.count === 40 &&
					Number(data.data.market[0][39].price) < filter.price
				) {
					getAllListings(card, ++page);
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
				<div>
					<button
						onClick={() =>
							setSelectedCards(
								cards.map((card) => ({
									id: card.id,
									title: card.title,
									type: card.cardType ? "card" : "sticker",
								}))
							)
						}
						className='m-1 cursor-pointer rounded-md border border-gray-200 px-3 py-2 text-center text-gray-300 transition-colors hover:bg-gray-300 hover:text-gray-800 active:bg-gray-400'
					>
						Select All
					</button>
					<button
						onClick={() => setSelectedCards([])}
						className='m-1 cursor-pointer rounded-md border border-gray-200 px-3 py-2 text-center text-gray-300 transition-colors hover:bg-gray-300 hover:text-gray-800 active:bg-gray-400'
					>
						Deselect All
					</button>
				</div>
				<div className='ml-auto mr-2 flex justify-end py-1'>
					<button
						className='mr-2 inline-flex cursor-pointer items-center rounded-md border border-gray-200 py-2 px-3 text-center text-gray-300 transition-colors enabled:hover:bg-gray-300 enabled:hover:text-gray-800 enabled:active:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50'
						onClick={() => {
							setShowMarketResults(true);
							marketSearch();
						}}
						disabled={!selectedCards.length || !user.premium}
					>
						{user.premium ? (
							<FiShoppingCart className='mr-2 text-orange-500' />
						) : (
							<FiLock className='mr-2 text-orange-500' />
						)}
						<span>Search Market</span>
					</button>
					<button
						className='inline-flex cursor-pointer items-center rounded-md border border-gray-200 py-2 px-3 text-center text-gray-300 transition-colors enabled:hover:bg-gray-300 enabled:hover:text-gray-800 enabled:active:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50'
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
				{sortBy(cards, [(o) => o.treatmentId, (o) => o.team?.id]).map((card) => (
					<div
						key={card.uuid}
						className={`flex cursor-pointer flex-col items-center border border-gray-500 transition-transform hover:scale-105`}
						onClick={() => {
							selectedCards.some((e) => e.id === card.id)
								? setSelectedCards((prev) => prev.filter((item) => item.id !== card.id))
								: setSelectedCards((prev) => [
										...prev,
										{
											id: card.id,
											title: card.title,
											type: card.cardType ? "card" : "sticker",
										},
								  ]);
						}}
					>
						<div className='relative aspect-auto w-24 overflow-hidden rounded-md p-0.5 sm:w-36'>
							<Image
								src={card.images?.size402 || `https://cdn.kolex.gg${card.images[0].url}`}
								width={200 * 1.5}
								height={300 * 1.5}
								quality={100}
								alt={card.title}
								className={`h-full w-full rounded-lg border-4 object-cover transition-colors ${
									selectedCards.some((e) => e.id === card.id)
										? "border-orange-500 grayscale-0"
										: "border-transparent"
								}`}
								priority='true'
							/>
							{!selectedCards.some((e) => e.id === card.id) && (
								<div className='absolute inset-1 z-20 rounded-md bg-black/60'></div>
							)}
						</div>
						<div className='text-center text-sm text-gray-300'>{card.title}</div>
					</div>
				))}
			</div>
			{showMarketResults && (
				<MarketResults
					setShowResults={setShowMarketResults}
					results={results}
					loading={loading}
				/>
			)}
			{showMintResults && (
				<MintResults
					setShowResults={setShowMintResults}
					results={results}
					loading={loading}
					total={totalExpected}
				/>
			)}
		</>
	);
};
export default CardGallery;
