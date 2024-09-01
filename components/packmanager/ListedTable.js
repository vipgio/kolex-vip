import sortBy from "lodash/sortBy";
import groupBy from "lodash/groupBy";
import ListedRow from "./ListedRow";
import CompactRow from "./CompactRow";

const ListedTable = ({ listed, sortMethod, setListed, insertFloor, compactMode }) => {
	const dataToShow = compactMode
		? groupBy(listed, "templateId")
		: sortBy(
				listed,
				sortMethod === "mintDate"
					? [(o) => o.minted, (o) => o.templateId, (o) => Number(o.price), (o) => Number(o.floor)]
					: sortMethod === "price"
					? [(o) => Number(o.price), (o) => o.templateId, (o) => o.minted, (o) => Number(o.floor)]
					: sortMethod === "priceDec"
					? [(o) => -Number(o.floor), (o) => o.templateId, (o) => o.minted, (o) => Number(o.price)]
					: sortMethod === "floor"
					? [(o) => Number(o.floor), (o) => o.templateId, (o) => o.minted, (o) => Number(o.price)]
					: [(o) => o.templateId, (o) => o.minted, (o) => Number(o.floor), (o) => Number(o.price)]
		  );

	return (
		<table className='relative w-full table-auto'>
			<thead className='text-gray-custom sticky top-0 bg-gray-200 dark:bg-gray-700'>
				<tr>
					<th className='table-cell'>Title</th>
					<th className='table-cell'>{compactMode ? "Count" : "Mint Date"}</th>
					<th className='table-cell'>{compactMode ? "Your Price Range" : "Your Price"}</th>
					<th className='table-cell'>Floor</th>
					<th className='table-cell'>New Price</th>
					<th className='table-cell'>Action</th>
				</tr>
			</thead>
			{compactMode ? (
				<tbody>
					{Object.entries(dataToShow).length > 0 &&
						Object.entries(dataToShow).map(([template, packs]) => (
							<tr
								className='text-gray-custom border-b border-gray-300 bg-gray-100 text-center hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
								key={template}
							>
								<CompactRow packs={packs} setListed={setListed} insertFloor={insertFloor} />
							</tr>
						))}
				</tbody>
			) : (
				<tbody>
					{dataToShow.length > 0 &&
						dataToShow.map((pack) => (
							<tr
								className='text-gray-custom border-b border-gray-300 bg-gray-100 text-center hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
								key={pack.marketId}
							>
								<ListedRow setListed={setListed} pack={pack} insertFloor={insertFloor} />
							</tr>
						))}
				</tbody>
			)}
		</table>
	);
};
export default ListedTable;
