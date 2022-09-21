import React, { useState, useEffect } from "react";
import sortBy from "lodash/sortBy";
import isEqual from "lodash/isEqual";
import sumBy from "lodash/sumBy";
import uniqBy from "lodash/uniqBy";
import countBy from "lodash/countBy";
import CompactList from "./CompactList";
import FullList from "./FullList";
import ExportToCSV from "../ExportToCSV";

const ScanResult = React.memo(
	({ scanResults, user, collection, templates }) => {
		const strippedResults = [...scanResults.cards, ...scanResults.stickers].map(
			(result) => {
				return {
					mintBatch: result.mintBatch,
					mintNumber: result.mintNumber,
					title:
						result.type === "card"
							? templates.filter((template) => template.id === result.cardTemplateId)[0]
									.title
							: result.stickerTemplate.title,
					id: result.id,
					inCirculation:
						result.type === "card"
							? templates.filter((template) => template.id === result.cardTemplateId)[0]
									.inCirculation
							: result.stickerTemplate.inCirculation,
					rating: result.rating,
					status: result.status,
					signed: result.signatureImage ? true : false,
					templateId:
						result.type === "card" ? result.cardTemplateId : result.stickerTemplate.id,
					type: result.type === "card" ? "card" : "sticker",
				};
			}
		);
		const sorted = sortBy(strippedResults, ["mintBatch", "mintNumber"]);
		const [filterMethod, setFilterMethod] = useState("all");
		const [filteredResults, setFilteredResults] = useState(sorted);

		useEffect(() => {
			filterMethod === "all" && setFilteredResults(sorted);
			filterMethod === "best" && setFilteredResults(uniqBy(sorted, (o) => o.templateId));
			filterMethod === "dupes" &&
				setFilteredResults(
					sorted.filter(
						// don't show the best set
						(item, index, self) =>
							index !== self.findIndex((t) => t.templateId === item.templateId)
					)
				);
			filterMethod === "second" &&
				setFilteredResults(
					uniqBy(
						sorted.filter(
							// don't show the best set then show the remaining sets
							(item, index, self) =>
								index !== self.findIndex((t) => t.templateId === item.templateId)
						),
						(o) => o.templateId
					)
				);
			filterMethod === "compact" &&
				setFilteredResults(
					sorted
						.map((item) => ({
							...item,
							owned: countBy(sorted, (o) => o.templateId)[item.templateId],
						}))
						.filter(
							(item, index, self) =>
								index === self.findIndex((t) => t.templateId === item.templateId)
						)
				);
		}, [filterMethod]);

		return (
			<>
				<div className='my-5 px-5'>
					<div className='flex items-center pb-3'>
						<label htmlFor='filter' className='m-2 text-gray-300'>
							Select a filter method:{" "}
						</label>
						<select
							id='filter'
							className='rounded-md border-gray-300 p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500'
							onChange={(e) => setFilterMethod(e.target.value)}
						>
							<option value='all'>All items</option>
							<option value='best'>Best set</option>
							<option value='dupes'>All duplicates</option>
							<option value='second'>Second set</option>
							<option value='compact'>Compact</option>
						</select>
						{user && filteredResults.length > 0 && (
							<div className='ml-auto'>
								<ExportToCSV
									type={filterMethod === "compact" ? "compact" : "full"}
									filename={`${user.username} - ${
										collection.collection.properties.seasons[0]
									} - ${collection.collection.properties.tiers[0]} - ${
										collection.collection.name
									} - ${filterMethod[0].toUpperCase() + filterMethod.slice(1)}`}
									data={filteredResults}
								/>
							</div>
						)}
					</div>

					<>
						<div className='mb-1 flex flex-col justify-center overflow-x-auto rounded-md border border-gray-300'>
							{filterMethod !== "compact" ? (
								<FullList results={filteredResults} />
							) : (
								<CompactList results={filteredResults} />
							)}
						</div>
						{(filterMethod === "best" || filterMethod === "second") &&
							filteredResults.length > 0 && (
								<div className='font-semibold text-orange-400'>
									Total points: {(sumBy(filteredResults, "rating") * 10).toFixed(2)}
								</div>
							)}
					</>
				</div>
			</>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
ScanResult.displayName = "ScanResult";
export default ScanResult;
