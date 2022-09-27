import React, { useContext, useState, useEffect } from "react";
import isEmpty from "lodash/isEmpty";
import groupBy from "lodash/groupBy";
import pickBy from "lodash/pickBy";
import sortBy from "lodash/sortBy";
import isEqual from "lodash/isEqual";
import Dropdown from "@/components/Dropdown";
import { UserContext } from "context/UserContext";

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

const SetSelector = React.memo(
	({ setSelectedCollection }) => {
		const { getCollections } = useContext(UserContext);
		const [collections, setCollections] = useState([]);
		useEffect(() => {
			const groupCollections = async () => {
				const { data } = await getCollections();
				const grouped = groupBy(data.data, (col) => col.collection.properties.seasons[0]);
				Object.entries(grouped).forEach(([season, seasonCollections]) => {
					const coreGrouped = groupBy(
						pickBy(seasonCollections, (col) =>
							coreNames.includes(col.collection.properties.tiers[0])
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
		return (
			<div>
				<Dropdown
					collections={sortBy(collections, (item) => seasons.indexOf(item[0]))}
					setSelectedCollection={setSelectedCollection}
				/>
			</div>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
SetSelector.displayName = "SetSelector";
export default SetSelector;
