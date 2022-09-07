import Image from "next/future/image";
import { useState } from "react";
import axios from "axios";
import sortBy from "lodash/sortBy";
import MarketResults from "./MarketResults";

const CardGallery = ({ cards, selectedCards, setSelectedCards, user, filter }) => {
	const [showResults, setShowResults] = useState(false);
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);

	const marketSearch = async () => {
		setLoading(true);
		for (const card of selectedCards) {
			await getAllListings(card, 1);
		}
		setLoading(false);
		// selectedCards.forEach(async (card) => {
		// 	await getAllListings(card, 1);
		// });
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
			<div className='ml-1 flex'>
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
				<button
					className='my-1 ml-auto mr-2 cursor-pointer rounded-md border border-gray-200 px-3 text-center text-gray-300 transition-colors hover:bg-gray-300 hover:text-gray-800 active:bg-gray-400'
					onClick={() => {
						setResults([]);
						setShowResults(true);
						marketSearch();
					}}
				>
					Search Market
				</button>
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
			{showResults && (
				<MarketResults
					setShowResults={setShowResults}
					results={results}
					loading={loading}
				/>
			)}
		</>
	);
};
export default CardGallery;
