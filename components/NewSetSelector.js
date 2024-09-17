import { useEffect, useState } from "react";
import SeasonSelect from "./setselector/SeasonSelect";
import CollectionSelect from "./setselector/CollectionSelect";
import SetSelect from "./setselector/SetSelect";

const NewSetSelector = ({ collections, setSelectedCollection, loading }) => {
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
			<div className='relative ml-2 mb-1 flex w-[60vw] flex-initial flex-col gap-1 text-gray-800 sm:grid sm:w-[36rem] sm:grid-cols-3 sm:gap-2'>
				<div className='relative text-gray-800'>
					<SeasonSelect
						selectedSeason={selectedSeason}
						setSelectedSeason={setSelectedSeason}
						collections={collections}
						loading={loading}
					/>
				</div>
				<div className='relative text-gray-800'>
					<CollectionSelect
						selectedCol={selectedCol}
						setSelectedCol={setSelectedCol}
						selectedSeason={selectedSeason}
						collections={collections}
					/>
				</div>
				<div className='relative text-gray-800'>
					<SetSelect
						selectedSet={selectedSet}
						setSelectedSet={setSelectedSet}
						selectedCol={selectedCol}
						collections={collections}
						selectedSeason={selectedSeason}
					/>
				</div>
			</div>
		</>
	);
};

export default NewSetSelector;
