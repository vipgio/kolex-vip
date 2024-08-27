import React, { useState } from "react";
import sortBy from "lodash/sortBy";
import isEqual from "lodash/isEqual";
import sumBy from "lodash/sumBy";
import uniqBy from "lodash/uniqBy";
import countBy from "lodash/countBy";
import ExportToCSV from "@/components/ExportToCSV";
import CompactList from "./CompactList";
import FullList from "./FullList";
import fixDecimal from "@/utils/NumberUtils";

const ScanResult = React.memo(
	({ scanResults, user, collection, templates, ownedItems, isSelfScan, singleUserSearch }) => {
		const userList = user
			.map((usr) => usr["username"])
			.join(", ")
			.toString();
		const [filterMethod, setFilterMethod] = useState("all");
		const strippedResults = scanResults.map((result) => {
			const ownedItem = sortBy(ownedItems, ["mintBatch", "mintNumber"]).find(
				(own) => own.templateId === result.templateId
			);
			const ownedRating = ownedItem ? ownedItem?.rating : 0;
			return {
				...result,
				signatureImage: result.signatureImage ? true : false,
				rating: Number(result.rating),
				title:
					result.type === "card"
						? templates.find((template) => template.id === result.templateId).title
						: result.title,
				inCirculation:
					result.type === "card"
						? templates.find((template) => template.id === result.templateId).inCirculation
						: result.inCirculation,
				type: result.type === "card" ? "card" : "sticker",
				delta: !isSelfScan && fixDecimal((result.rating - ownedRating) * 10),
				need: ownedRating === 0,
			};
		});
		const sortedInc = sortBy(strippedResults, ["mintBatch", "mintNumber", (o) => -o.signatureImage]);
		const sorted = sortedInc.map((item, index, self) => {
			const firstPosition = self.findIndex((o) => o.templateId === item.templateId);
			if (firstPosition === index) {
				//if it's the best item
				const nextPosition = sortedInc //find the second one then get their rating difference
					.slice(index + 1)
					.find((o) => o.templateId === item.templateId);
				return {
					...item,
					pointsToLose: nextPosition ? fixDecimal(item.rating - nextPosition.rating) : item.rating,
				};
			} else {
				//if it's a dupe
				return {
					...item,
					pointsToLose: 0,
				};
			}
		});
		const filteredResults =
			filterMethod === "all"
				? sorted
				: filterMethod === "best"
				? uniqBy(sorted, "templateId")
				: filterMethod === "worst"
				? uniqBy(sorted.slice().reverse(), "templateId").slice().reverse()
				: filterMethod === "dupes"
				? sorted.filter(
						// don't show the best set
						(item, index, self) => index !== self.findIndex((o) => o.templateId === item.templateId)
				  )
				: filterMethod === "second"
				? uniqBy(
						sorted.filter(
							// don't show the best set then show the remaining best one after
							(item, index, self) => index !== self.findIndex((o) => o.templateId === item.templateId)
						),
						"templateId"
				  )
				: uniqBy(
						//compact
						sorted.map((item) => ({
							...item,
							owned: countBy(sorted, (o) => o.templateId)[item.templateId],
						})),
						"templateId"
				  );

		const handleFilter = (e) => {
			setFilterMethod(e.target.value);
		};

		return (
			<>
				<div className='my-5'>
					<div className='flex items-end pb-3'>
						<div className='flex flex-col justify-start sm:flex-row'>
							<label htmlFor='filter' className='my-1 text-gray-800 dark:text-gray-300 sm:m-2'>
								Select a filter method:{" "}
							</label>
							<select id='filter' className='dropdown' onChange={handleFilter}>
								<option value='all'>All items</option>
								<option value='best'>Best set</option>
								<option value='dupes'>All duplicates</option>
								<option value='second'>Second set</option>
								<option value='worst'>Worst set</option>
								<option value='compact'>Compact</option>
							</select>
						</div>
						{user && filteredResults.length > 0 && (
							<div className='ml-auto'>
								<ExportToCSV
									type={filterMethod === "compact" ? "compact" : "full"}
									filename={`${userList} - ${collection.collection.properties.seasons[0]} - ${
										collection.collection.properties.tiers[0]
									} - ${collection.collection.name} - ${
										filterMethod[0].toUpperCase() + filterMethod.slice(1)
									}`}
									data={filteredResults}
								/>
							</div>
						)}
					</div>

					<>
						{(filterMethod === "best" || filterMethod === "second" || filterMethod === "worst") &&
							filteredResults.length > 0 && (
								<div className='mb-1 ml-1 font-semibold text-orange-400'>
									Total points: {(sumBy(filteredResults, "rating") * 10).toFixed(2)}
								</div>
							)}
						<div className='mb-1 flex flex-col justify-center rounded-md border border-gray-300'>
							{filterMethod !== "compact" ? (
								<FullList
									results={filteredResults}
									owner={user}
									isSelfScan={isSelfScan}
									ownedItems={isSelfScan ? ownedItems : uniqBy(ownedItems, "templateId")}
									filterMethod={filterMethod}
									singleUserSearch={singleUserSearch}
								/>
							) : (
								<CompactList results={filteredResults} owner={user} />
							)}
						</div>
					</>
				</div>
			</>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
ScanResult.displayName = "ScanResult";
export default ScanResult;
