import _ from "lodash";
import React, { useState, useEffect } from "react";

const ScanList = React.memo(
	({ scanResults }) => {
		console.log(scanResults);
		const sorted = _.sortBy(
			[...scanResults.cards, ...scanResults.stickers],
			["mintBatch", "mintNumber"]
		);
		const [filterMethod, setFilterMethod] = useState("all");
		const [filteredResults, setFilteredResults] = useState(sorted);

		useEffect(() => {
			filterMethod === "all" && setFilteredResults(sorted);
			filterMethod === "best" &&
				setFilteredResults(
					_.uniqBy(sorted, (o) =>
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
					_.uniqBy(
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

		const handleExport = (filename) => {
			const blob = new Blob(["hi"], { type: "text/csv;charset=utf-8;" });
			if (navigator.msSaveBlob) {
				// In case of IE 10+
				navigator.msSaveBlob(blob, filename);
			} else {
				const link = document.createElement("a");
				if (link.download !== undefined) {
					// Browsers that support HTML5 download attribute
					const url = URL.createObjectURL(blob);
					link.setAttribute("href", url);
					link.setAttribute("download", filename);
					link.style.visibility = "hidden";
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}
			}
		};
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
						<div className='ml-auto' onClick={() => handleExport(`fileee.csv`)}>
							EXPORT
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
									<th className='py-1 px-2 sm:py-3 sm:px-6'>Item ID</th>
									<th className='py-1 px-2 sm:py-3 sm:px-6'>Item Score</th>
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
										<td className='py-1 px-2 sm:py-3 sm:px-6'>
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
							Total points: {(_.sumBy(filteredResults, "rating") * 10).toFixed(2)}
						</div>
					)}
				</div>
			</>
		);
	},
	(oldProps, newProps) => _.isEqual(oldProps, newProps)
);
export default ScanList;
