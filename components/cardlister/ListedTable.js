import sortBy from "lodash/sortBy";
import ListedRow from "./ListedRow";
const ListedTable = ({ listed, sortMethod, setListed, insertFloor }) => {
	return (
		<table className='w-full table-auto'>
			<thead className='text-gray-custom bg-gray-200 dark:bg-gray-700'>
				<tr>
					<th className='table-cell'>Mint</th>
					<th className='table-cell'>Title</th>
					<th className='table-cell'>Circulation</th>
					<th className='table-cell'>Price</th>
					<th className='table-cell'>Floor</th>
					<th className='table-cell'>New Price</th>
					<th className='table-cell'>Action</th>
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
							className='text-gray-custom border-b border-gray-300 bg-gray-100 text-center hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
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
