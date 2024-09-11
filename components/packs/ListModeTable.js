import { useState } from "react";
import ListModeRow from "./ListModeRow";

const ListModeTable = ({ packs, filters }) => {
	const [sortMethod, setSortMethod] = useState("date");
	const sortItems = (items, option) => {
		return items
			.filter(
				(pack) =>
					filters.seasons.includes(pack.properties.seasons[0]) &&
					(filters.costTypes.length > 0 ? filters.costTypes.includes(pack.costType) : true)
			)
			.sort((a, b) => {
				if (option === "name") {
					return a.name.localeCompare(b.name);
				} else if (option === "cost") {
					return a.cost - b.cost;
				} else if (option === "releaseDate") {
					return new Date(a.releaseDate) - new Date(b.releaseDate);
				} else if (option === "minted") {
					return a.mintCount - b.mintCount;
				} else if (option === "unopened") {
					return a.mintCount - a.openedCount - (b.mintCount - b.openedCount) || a.mintCount - b.mintCount;
				}
				return 0;
			});
	};
	const sortedItems = sortItems([...packs], sortMethod);

	return (
		<>
			<div className='text-gray-custom my-2'>
				<label htmlFor='batch'>Sort By: </label>
				<select
					id='batch'
					className='input-field mb-2 mr-3 w-36 p-0 sm:mb-0'
					onChange={(e) => setSortMethod(() => e.target.value)}
					value={sortMethod}
				>
					<option value='date'>Release Date</option>
					<option value='name'>Name</option>
					<option value='cost'>Cost</option>
					<option value='minted'>Minted</option>
					<option value='unopened'>Unopened</option>
				</select>
			</div>
			<div className='mb-10 overflow-x-auto rounded border'>
				<table className='w-full table-auto'>
					<thead className='text-gray-custom bg-gray-200 dark:bg-gray-700'>
						<tr>
							<th className='table-cell'>Name</th>
							<th className='table-cell'>Season</th>
							<th className='table-cell'>Acquired</th>
							<th className='table-cell'>Cost</th>
							<th className='table-cell'>Cost Type</th>
							<th className='table-cell'>Minted</th>
							<th className='table-cell'>Inventory Count</th>
							<th className='table-cell'>Opened</th>
							<th className='table-cell'>Unopened</th>
							<th className='table-cell'>Release Date</th>
						</tr>
					</thead>
					<tbody>
						{sortedItems.map((pack) => (
							<ListModeRow key={pack.id} pack={pack} />
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};
export default ListModeTable;
