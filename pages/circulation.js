import { useContext, useState, useEffect } from "react";
import isEmpty from "lodash/isEmpty";
import groupBy from "lodash/groupBy";
import pickBy from "lodash/pickBy";
import sortBy from "lodash/sortBy";
import { UserContext } from "context/UserContext";
import Meta from "@/components/Meta";
import CircList from "@/components/CircList";
import Dropdown from "@/components/Dropdown";
const coreNames = [
	"Common",
	"Uncommon",
	"Rare",
	"Epic",
	"Legendary",
	"Roles",
	"Mastery Roles",
	"Legendary Roles",
	"Tier 1 Superior",
	"Tier 2 Epic",
	"Tier 3 Legendary",
	"Pinnacle",
	"Signature Series",
];
const seasons = ["Founders Edition", "2018", "2019", "2020", "2021", "2022"];
const Circulation = () => {
	const { getCirc, getCollections, loading, setLoading } = useContext(UserContext);
	const [collection, setCollection] = useState({ info: {}, items: [] });
	const [collections, setCollections] = useState([]);
	const [selectedCollection, setSelectedCollection] = useState(null);

	useEffect(() => {
		const groupCollections = async () => {
			const { data } = await getCollections();
			const grouped = groupBy(data.data, (col) => col.collection.properties.seasons[0]);
			Object.entries(grouped).forEach(([season, seasonCollections]) => {
				const coreGrouped = groupBy(
					pickBy(
						seasonCollections,
						(col) =>
							coreNames.includes(col.collection.properties.tiers[0]) &&
							!col.collection.physical
					),
					(col) => col.collection.properties.tiers[0]
				);

				const eventsGrouped = groupBy(
					pickBy(
						seasonCollections,
						(col) => col.collection.properties.types[0] === "event_primary"
					),
					(col) => col.collection.properties.tiers[0]
				);

				const nonEventsGrouped = groupBy(
					pickBy(
						seasonCollections,
						(col) =>
							col.collection.properties.types[0] !== "event_primary" &&
							!coreNames.includes(col.collection.properties.tiers[0])
					),
					(col) => col.collection.properties.tiers[0]
				);
				setCollections((prev) => [
					...prev,
					[
						season,
						isEmpty(eventsGrouped)
							? Object.entries({
									Core: [...Object.entries(coreGrouped)],
									...nonEventsGrouped,
							  })
							: Object.entries({
									Events: [...Object.entries(eventsGrouped)],
									Core: [...Object.entries(coreGrouped)],
									...nonEventsGrouped,
							  }),
					],
				]);
			});
		};
		groupCollections();
	}, []);

	const displayCirc = async () => {
		setLoading(true);
		try {
			setCollection({ info: {}, items: [] });
			const { data } = await getCirc(selectedCollection.collection.id);
			if (data.success) {
				setCollection((collection) => ({ ...collection, items: data.data }));
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
				<div className='flex h-full w-full flex-col items-start justify-center pt-10 sm:items-center'>
					<div className='px-4 pt-2 font-semibold text-gray-300'>
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
					<Dropdown
						collections={sortBy(collections, (item) => seasons.indexOf(item[0]))}
						setSelectedCollection={setSelectedCollection}
					/>
					<button
						type='submit'
						disabled={loading}
						className={`big-button mx-3 sm:mx-0 ${
							loading ? "cursor-not-allowed opacity-50" : ""
						}`}
						onClick={displayCirc}
					>
						Get Circulations
					</button>
				</div>
				{collection.info?.length > 0 && (
					<div className='mt-3 text-xl font-bold text-gray-300'>
						{collection.info[0].collection.properties.seasons[0]}{" "}
						{collection.info[0].collection.description}
					</div>
				)}
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
