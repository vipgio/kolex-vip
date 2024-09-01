import { useEffect, useState } from "react";
import SeasonSelect from "./setselector/SeasonSelect";
import CollectionSelect from "./setselector/CollectionSelect";
import SetSelect from "./setselector/SetSelect";

const NewSetSelector = ({ collections, setSelectedCollection }) => {
	const [selectedSeason, setSelectedSeason] = useState("");
	const [selectedCol, setSelectedCol] = useState("");
	const [selectedSet, setSelectedSet] = useState("");

	useEffect(() => {
		setSelectedCol("");
		setSelectedSet("");
	}, [selectedSeason]);

	useEffect(() => {
		if (selectedSet.id) {
			const seasonArray = collections.find(([season, _]) => season === selectedSeason);
			const collectionArray = seasonArray?.[1].find(([col, _]) => col === selectedCol);

			if (collectionArray[1].collections[0].collection) {
				const targetSet = collectionArray?.[1].collections.find((set) => set.collection.id === selectedSet.id);
				setSelectedCollection(targetSet);
			} else {
				const targetSet = collectionArray?.[1].collections
					.map((tier) => tier.collections)
					.flat()
					.find((subSet) => subSet.collection.id === selectedSet.id);
				setSelectedCollection(targetSet);
			}
		}
	}, [selectedSet]);

	return (
		<>
			<div className='relative ml-2 mb-1 grid w-[36rem] grid-cols-3 gap-2 divide-x text-gray-800'>
				<SeasonSelect
					selectedSeason={selectedSeason}
					setSelectedSeason={setSelectedSeason}
					collections={collections}
				/>
				<CollectionSelect
					selectedCol={selectedCol}
					setSelectedCol={setSelectedCol}
					selectedSeason={selectedSeason}
					collections={collections}
				/>
				<SetSelect
					selectedSet={selectedSet}
					setSelectedSet={setSelectedSet}
					selectedCol={selectedCol}
					collections={collections}
					selectedSeason={selectedSeason}
				/>
			</div>
		</>
	);
};

export default NewSetSelector;
