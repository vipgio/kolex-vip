import { useContext, useState, useEffect } from "react";
import axios from "axios";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
import { UserContext } from "@/context/UserContext";
import SetSelector from "@/HOC/SetSelector";
import Meta from "@/components/Meta";
import CardGallery from "@/components/mintsearch/CardGallery";
import LoadingSpin from "@/components/LoadingSpin";
import RefreshButton from "@/components/RefreshButton";

const Searcher = () => {
	const { user, categoryId } = useContext(UserContext);
	const [selectedCollection, setSelectedCollection] = useState(null);
	const [cards, setCards] = useState([]);
	const [owned, setOwned] = useState([]);
	const [filter, setFilter] = useState({
		batch: "A",
		min: 1,
		max: 25,
		price: 1,
		sigsOnly: false,
		upgradesOnly: false,
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		filter.sigsOnly && setFilter((prev) => ({ ...prev, upgradesOnly: false }));
	}, [filter.sigsOnly]);

	useEffect(() => {
		filter.upgradesOnly && setFilter((prev) => ({ ...prev, sigsOnly: false }));
	}, [filter.upgradesOnly]);

	const getCards = async (collectionId) => {
		setLoading(true);
		const { data } = await axios.get(`/api/collections/cards/${collectionId}`, {
			headers: {
				jwt: user.jwt,
			},
		});
		if (data.success) {
			setCards((prev) => [...prev, ...data.data]);
		}
	};

	const getStickers = async (collectionId) => {
		const { data } = await axios.get(`/api/collections/stickers/${collectionId}`, {
			headers: {
				jwt: user.jwt,
			},
		});
		if (data.success) {
			setCards((prev) => [...prev, ...data.data]);
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
		if (data.success) {
			const ownedItems = uniqBy(
				sortBy(
					[...data.data.cards, ...data.data.stickers].map((item) => {
						const obj = {
							mintBatch: item.mintBatch,
							mintNumber: item.mintNumber,
							rating: item.rating,
							templateId: item.cardTemplateId ? item.cardTemplateId : item.stickerTemplateId,
							id: item.id,
							type: item.cardTemplateId ? "card" : "sticker",
						};
						return obj;
					}),
					["mintBatch", "mintNumber"]
				),
				"templateId"
			);
			setOwned((prev) => [...prev, ...ownedItems]);
		}
	};

	const fetchData = async () => {
		setCards([]);
		setOwned([]);
		await getCards(selectedCollection.collection.id);
		await getStickers(selectedCollection.collection.id);
		await getOwned(user.user.id, selectedCollection.collection.id);
		setLoading(false);
	};

	useEffect(() => {
		if (selectedCollection) {
			fetchData();
		}
	}, [selectedCollection]);

	return (
		<>
			<Meta title='Mint Search | Kolex VIP' />
			<div className='my-10 rounded border border-gray-800 p-2 dark:border-gray-200'>
				{selectedCollection && (
					<RefreshButton
						title='Refresh Items'
						loading={loading}
						style='absolute top-24 right-4 mt-2'
						func={fetchData}
					/>
				)}
				<div className='px-2 pt-2 font-semibold text-gray-700 dark:text-gray-300'>
					Selected Collection:
					{selectedCollection && (
						<span>
							{" "}
							{selectedCollection.collection.properties.seasons[0]} -{" "}
							{selectedCollection.collection.properties.tiers[0]} - {selectedCollection.collection.name}
						</span>
					)}
				</div>
				<div>{user && <SetSelector setSelectedCollection={setSelectedCollection} />}</div>
				<div className='mb-1 flex flex-col pl-2 text-gray-700 dark:text-gray-300'>
					<div className='flex items-center'>
						<label htmlFor='sigs' className='hover:cursor-pointer'>
							Only search for signatures
						</label>
						<input
							type='checkbox'
							name='sigs'
							id='sigs'
							className='ml-1 mt-1 accent-primary-500 hover:cursor-pointer'
							checked={filter.sigsOnly}
							onChange={(e) => setFilter((prev) => ({ ...prev, sigsOnly: e.target.checked }))}
						/>
					</div>
					<div className='flex items-center'>
						<label htmlFor='upgrade' className='my-1 hover:cursor-pointer'>
							Only search for point upgrades
						</label>
						<input
							type='checkbox'
							name='upgrade'
							id='upgrade'
							className='ml-1 mr-1 mt-1 accent-primary-500 hover:cursor-pointer sm:mr-0'
							checked={filter.upgradesOnly}
							onChange={(e) => setFilter((prev) => ({ ...prev, upgradesOnly: e.target.checked }))}
						/>
					</div>
				</div>
				<div className='mb-2 flex w-fit flex-col pl-2 text-gray-700 dark:text-gray-300 sm:flex-row'>
					<div>
						<label htmlFor='batch'>Mint Batch: </label>
						<select
							id='batch'
							className='input-field mb-2 mr-3 w-24 p-0 sm:mb-0'
							onChange={(e) => setFilter((prev) => ({ ...prev, batch: e.target.value }))}
							disabled={filter.sigsOnly || filter.upgradesOnly}
						>
							<option value='A'>A</option>
							<option value='B'>B</option>
							<option value='C'>C</option>
							<option value='M'>M</option>
							<option value='HB'>HB</option>
							<option value='P'>P</option>
						</select>
					</div>
					<div>
						<label htmlFor='minMint'>Minimum Mint: </label>
						<input
							type='number'
							name='minMint'
							id='minMint'
							min={1}
							disabled={filter.sigsOnly || filter.upgradesOnly}
							className='input-field mb-2 mr-3 w-24 sm:mb-0'
							placeholder='Minimum Mint'
							value={filter.min}
							onChange={(e) => setFilter((prev) => ({ ...prev, min: e.target.value }))}
						/>
					</div>
					<div>
						<label htmlFor='maxMint'>Maximum Mint: </label>
						<input
							type='number'
							name='maxMint'
							id='maxMint'
							min={1}
							disabled={filter.sigsOnly || filter.upgradesOnly}
							className='input-field mb-2 mr-3 w-24 sm:mb-0'
							placeholder='Maximum Mint'
							value={filter.max}
							onChange={(e) => setFilter((prev) => ({ ...prev, max: e.target.value }))}
						/>
					</div>
					<div>
						<label htmlFor='maxPrice'>Maximum price: </label>
						<input
							type='number'
							name='maxPrice'
							id='maxPrice'
							min={0.1}
							step={0.01}
							className='input-field mb-2 w-24 sm:mb-0'
							placeholder='Maximum Price'
							value={filter.price}
							onChange={(e) => setFilter((prev) => ({ ...prev, price: e.target.value }))}
						/>
					</div>
				</div>
				{loading && (
					<div className='flex justify-center py-2'>
						<LoadingSpin />
					</div>
				)}
				{cards.length > 0 && !loading && (
					<CardGallery
						cards={cards}
						user={user}
						filter={filter}
						selectedCollection={selectedCollection}
						owned={owned}
						fetchData={fetchData}
						categoryId={categoryId}
					/>
				)}
			</div>
		</>
	);
};
export default Searcher;
