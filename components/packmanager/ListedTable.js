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
					? [
							(o) => o.minted,
							(o) => o.templateId,
							(o) => Number(o.price),
							(o) => Number(o.floor),
					  ]
					: sortMethod === "price"
					? [
							(o) => Number(o.price),
							(o) => o.templateId,
							(o) => o.minted,
							(o) => Number(o.floor),
					  ]
					: sortMethod === "priceDec"
					? [
							(o) => -Number(o.floor),
							(o) => o.templateId,
							(o) => o.minted,
							(o) => Number(o.price),
					  ]
					: sortMethod === "floor"
					? [
							(o) => Number(o.floor),
							(o) => o.templateId,
							(o) => o.minted,
							(o) => Number(o.price),
					  ]
					: [
							(o) => o.templateId,
							(o) => o.minted,
							(o) => Number(o.floor),
							(o) => Number(o.price),
					  ]
		  );

	return (
		<table className='relative w-full table-auto'>
			<thead className='sticky top-0 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'>
				<tr>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Title</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>
						{compactMode ? "Count" : "Mint Date"}
					</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>
						{compactMode ? "Your Price Range" : "Your Price"}
					</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Floor</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>New Price</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Action</th>
				</tr>
			</thead>
			{compactMode ? (
				<tbody>
					{Object.entries(dataToShow).length > 0 &&
						Object.entries(dataToShow).map(([template, packs]) => (
							<tr
								className='border-b border-gray-300 bg-gray-100 text-center text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600'
								key={template}
							>
								<CompactRow
									packs={packs}
									setListed={setListed}
									insertFloor={insertFloor}
								/>
							</tr>
						))}
				</tbody>
			) : (
				<tbody>
					{dataToShow.length > 0 &&
						dataToShow.map((pack) => (
							<tr
								className='border-b border-gray-300 bg-gray-100 text-center text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600'
								key={pack.marketId}
								onClick={() => console.log(pack)}
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
