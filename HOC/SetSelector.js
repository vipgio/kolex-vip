import React, { useContext, useState, useEffect } from "react";
import groupBy from "lodash/groupBy";
import pickBy from "lodash/pickBy";
import sortBy from "lodash/sortBy";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";
import { useAxios } from "@/hooks/useAxios";
import { UserContext } from "@/context/UserContext";
import SetSelectorDropdown from "@/components/SetSelectorDropdown";
import NewSetSelector from "@/components/NewSetSelector";
import { set } from "lodash";

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
const seasons = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "Founders Edition"];

const SetSelector = React.memo(
	({ setSelectedCollection }) => {
		const { user, categoryId } = useContext(UserContext);
		const { fetchData } = useAxios();
		const [collections, setCollections] = useState([]);
		const [loading, setLoading] = useState(true);

		function updatePhysicalKey(section) {
			// Update the physical key in the info object
			if (!section.info) {
				section.info = {};
			}
			section.info.physical = section.collections.some((collection) => collection.collection.physical);
		}

		useEffect(() => {
			const groupCollections = async () => {
				setLoading(true);
				const data = (await getCollections()).map((item) => ({
					...item,
					collection: omit(item.collection, "images"),
				}));
				const grouped = groupBy(data, (col) => col.collection.properties.seasons[0]);
				Object.entries(grouped).forEach(([season, seasonCollections]) => {
					const coreGrouped = {
						collections: Object.entries(
							groupBy(
								pickBy(seasonCollections, (col) => coreNames.includes(col.collection.properties.tiers[0])),
								(col) => col.collection?.properties.tiers[0]
							)
						).map(([tier, collections]) => {
							const entry = {
								tier,
								collections: collections,
								info: {
									physical: false, // Initialize as false
									locked: false,
								},
							};

							updatePhysicalKey(entry); // Update the entry with the correct physical key

							return entry;
						}),
					};

					const eventsGrouped = {
						collections: Object.entries(
							groupBy(
								pickBy(seasonCollections, (col) => col.collection.properties.types[0] === "event_primary"),
								(col) => col.collection?.properties.tiers[0]
							)
						).map(([tier, collections]) => {
							const entry = {
								tier,
								collections: collections,
								info: {
									physical: false, // Initialize as false
									locked: false,
								},
							};

							updatePhysicalKey(entry); // Update the entry with the correct physical key

							return entry;
						}),
					};

					const nonEventsGrouped = {
						collections: Object.entries(
							groupBy(
								pickBy(
									seasonCollections,
									(col) =>
										col.collection.properties.types[0] !== "event_primary" &&
										!coreNames.includes(col.collection.properties.tiers[0])
								),
								(col) => col.collection.properties.tiers[0]
							)
						).reduce((acc, [key, value]) => {
							const entry = {
								collections: value,
								info: {},
							};
							updatePhysicalKey(entry);
							acc[key] = entry;
							return acc;
						}, {}),
					};

					setCollections((prev) => [
						...prev,
						[
							season,
							Object.entries({
								...(eventsGrouped.collections.length > 0 ? { Events: eventsGrouped } : {}), // Add the events groupings if they exist
								...(coreGrouped.collections.length > 0 ? { Core: coreGrouped } : {}), // Add the events groupings if they exist
								...(nonEventsGrouped.collections || nonEventsGrouped),
							}), // Add the non-events groupings
						],
					]);
					setLoading(false);
				});
			};
			setCollections([]);
			groupCollections();
		}, []);

		const getCollections = async () => {
			const { result, error } = await fetchData(`/api/collections/users/${user.user.id}/user-summary`, {
				userId: user.user.id,
				categoryId: categoryId,
			});
			if (error) {
				console.error(error);
			}
			return result;
		};

		return (
			<div>
				<NewSetSelector
					collections={sortBy(collections, (item) => seasons.indexOf(item[0]))}
					setSelectedCollection={setSelectedCollection}
					loading={loading}
				/>
				{/* <SetSelectorDropdown
					collections={sortBy(collections, (item) => seasons.indexOf(item[0]))}
					setSelectedCollection={setSelectedCollection}
				/> */}
			</div>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
SetSelector.displayName = "SetSelector";
export default SetSelector;
