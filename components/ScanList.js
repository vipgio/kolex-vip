import React, { useState, useEffect } from "react";
import sortBy from "lodash/sortBy";
import isEqual from "lodash/isEqual";
import sumBy from "lodash/sumBy";
import uniqBy from "lodash/uniqBy";
import ExportButton from "./ExportButton";

const ScanList = React.memo(
	({ scanResults, user, collection }) => {
		const sorted = sortBy(
			[...scanResults.cards, ...scanResults.stickers],
			["mintBatch", "mintNumber"]
		);
		const [filterMethod, setFilterMethod] = useState("all");
		const [filteredResults, setFilteredResults] = useState(sorted);

		useEffect(() => {
			filterMethod === "all" && setFilteredResults(sorted);
			filterMethod === "best" &&
				setFilteredResults(
					uniqBy(sorted, (o) =>
						o.cardTemplate ? o.cardTemplate.id : o.stickerTemplate.id
					)
				);
			filterMethod === "dupes" &&
				setFilteredResults(
					sorted
						.filter(
							// don't show the best set
							(item, index, self) =>
								item.cardTemplate
									? index !==
									  self.findIndex(
											(t) => t.cardTemplate && t.cardTemplate.id === item.cardTemplate.id
									  )
									: true
						)
						.filter((item, index, self) =>
							item.sticketTemplate
								? index !==
								  self.findIndex(
										(t) =>
											t.sticketTemplate &&
											t.sticketTemplate.id === item.sticketTemplate.id
								  )
								: true
						)
				);
			filterMethod === "second" &&
				setFilteredResults(
					uniqBy(
						sorted
							.filter(
								// don't show the best set then show the remaining sets
								(item, index, self) =>
									item.cardTemplate
										? index !==
										  self.findIndex(
												(t) =>
													t.cardTemplate && t.cardTemplate.id === item.cardTemplate.id
										  )
										: true
							)
							.filter((item, index, self) =>
								item.sticketTemplate
									? index !==
									  self.findIndex(
											(t) =>
												t.sticketTemplate &&
												t.sticketTemplate.id === item.sticketTemplate.id
									  )
									: true
							),
						(o) => (o.cardTemplate ? o.cardTemplate.id : o.stickerTemplate.id)
					)
				);
		}, [filterMethod]);

		return (
			<>
				<div className='my-5 px-5'>
					<div className='flex items-center pb-3'>
						<label htmlFor='filter' className='mb-2 mr-2 text-gray-300'>
							Select a filter method:{" "}
						</label>
						<select
							id='filter'
							// className='rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900'
							className='rounded-md border-gray-300 p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500'
							onChange={(e) => setFilterMethod(e.target.value)}
						>
							<option value='all'>All items</option>
							<option value='best'>Best set</option>
							<option value='dupes'>All duplicates</option>
							<option value='second'>Second set</option>
						</select>
						<div className='ml-auto'>
							<ExportButton
								filename={`${user.username} - ${collection.collection.properties.seasons[0]} - ${collection.collection.properties.tiers[0]} - ${collection.collection.name}`}
								data={filteredResults}
							/>
						</div>
					</div>
					<div className='mb-1 flex flex-col justify-center overflow-x-auto rounded-md border border-gray-300'>
						<table className='w-full overflow-hidden text-left text-gray-500 dark:text-gray-400'>
							<thead className='bg-gray-50 uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
								<tr>
									<th className='py-1 px-2 sm:py-3 sm:px-6'>Mint</th>
									<th className='py-1 px-2 sm:py-3 sm:px-6'>Title</th>
									<th className='py-1 px-2 sm:py-3 sm:px-6'>Circulation</th>
									<th className='py-1 px-2 sm:py-3 sm:px-6'>Listed</th>
									<th className='py-1 px-2 sm:py-3 sm:px-6'>Immutable</th>
									<th className='py-1 px-2 sm:py-3 sm:px-6'>ID</th>
									<th className='py-1 px-2 sm:py-3 sm:px-6'>Item Points</th>
								</tr>
							</thead>
							<tbody>
								{filteredResults.map((card) => (
									<tr
										className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
										key={card.id}
									>
										<td className='py-1 px-2 sm:py-3 sm:px-6'>
											{card.mintBatch}
											{card.mintNumber}
										</td>
										<td className='min-w-[10rem] py-1 px-2 sm:py-3 sm:px-6'>
											{card.cardTemplate
												? card.cardTemplate.title
												: card.stickerTemplate.title}
										</td>
										<td className='py-1 px-2 sm:py-3 sm:px-6'>
											{card.cardTemplate
												? card.cardTemplate.inCirculation
												: card.stickerTemplate.inCirculation}
										</td>
										<td className='py-1 px-2 sm:py-3 sm:px-6'>
											{card.status === "market" ? "Yes" : "No"}
										</td>
										<td className='py-1 px-2 sm:py-3 sm:px-6'>
											{card.status === "imx_locked" ? "Yes" : "No"}
										</td>
										<td className='py-1 px-2 sm:py-3 sm:px-6'>{card.id}</td>
										<td className='py-1 px-2 sm:py-3 sm:px-6'>
											{(card.rating * 10).toFixed(2)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{(filterMethod === "best" || filterMethod === "second") && (
						<div className='font-semibold text-orange-400'>
							Total points: {(sumBy(filteredResults, "rating") * 10).toFixed(2)}
						</div>
					)}
				</div>
			</>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
ScanList.displayName = "ScanList";
export default ScanList;
