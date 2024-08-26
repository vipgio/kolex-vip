import sortBy from "lodash/sortBy";
import ListedRow from "./ListedRow";
const ListedTable = ({ listed, sortMethod, setListed, insertFloor }) => {
	return (
		<table className='w-full table-auto'>
			<thead className='bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'>
				<tr>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Mint</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Title</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Circulation</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Price</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Floor</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>New Price</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Action</th>
				</tr>
			</thead>
			<tbody>
				{listed.length > 0 &&
					sortBy(
						listed,
						sortMethod === "mint"
							? [
									(o) => o.mintBatch,
									(o) => o.mintNumber,
									(o) => Number(o.price),
									(o) => Number(o.floor),
									(o) => o.circulation,
							  ]
							: sortMethod === "price"
							? [
									(o) => Number(o.price),
									(o) => o.mintBatch,
									(o) => o.mintNumber,
									(o) => Number(o.floor),
									(o) => o.circulation,
							  ]
							: sortMethod === "floor"
							? [
									(o) => Number(o.floor),
									(o) => o.mintBatch,
									(o) => o.mintNumber,
									(o) => Number(o.price),
									(o) => o.circulation,
							  ]
							: sortMethod === "date"
							? [
									(o) => -o.marketId,
									(o) => o.mintBatch,
									(o) => o.mintNumber,
									(o) => Number(o.price),
									(o) => o.circulation,
							  ]
							: [
									(o) => o.circulation,
									(o) => o.mintBatch,
									(o) => o.mintNumber,
									(o) => Number(o.floor),
									(o) => Number(o.price),
							  ]
					).map((item) => (
						<tr
							className='border-b border-gray-300 bg-gray-100 text-center text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600'
							key={item.marketId}
						>
							<ListedRow setListed={setListed} item={item} insertFloor={insertFloor} />
						</tr>
					))}
			</tbody>
		</table>
	);
};
export default ListedTable;
