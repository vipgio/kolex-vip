import { useContext, useState, useEffect } from "react";
import { UserContext } from "context/UserContext";
import Meta from "@/components/Meta";
import CircList from "@/components/CircList";
import SetSelector from "HOC/SetSelector";
import LoadingSpin from "@/components/LoadingSpin";

const Circulation = () => {
	const { getCardCirc, getStickerCirc, loading, setLoading } = useContext(UserContext);
	const [collection, setCollection] = useState({ info: {}, items: [] });
	const [selectedCollection, setSelectedCollection] = useState(null);

	useEffect(() => {
		selectedCollection && displayCirc();
	}, [selectedCollection]);

	const displayCirc = async () => {
		setLoading(true);
		try {
			setCollection({ info: {}, items: [] });
			const { data: cards } = await getCardCirc(selectedCollection.collection.id);
			const { data: stickers } = await getStickerCirc(selectedCollection.collection.id);
			if (cards.success && stickers.success) {
				setCollection((collection) => ({
					...collection,
					items: [...cards.data, ...stickers.data],
				}));
				setLoading(false);
			}
		} catch (err) {
			alert(err);
			setLoading(false);
		}
	};

	return (
		<>
			<Meta title='Circulation | Kolex VIP' />
			<div className='mt-10 flex flex-col items-center'>
				<div className='flex h-full w-full flex-col items-center justify-center pt-10'>
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
				{loading && <LoadingSpin />}
				{collection.items.length > 0 && (
					<div className='overflow-hidden'>
						<CircList data={collection.items} />
					</div>
				)}
			</div>
		</>
	);
};
export default Circulation;
