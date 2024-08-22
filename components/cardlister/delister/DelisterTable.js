import sortBy from "lodash/sortBy";
import DelisterRow from "./DelisterRow";
const DelisterTable = ({
	listed,
	setListed,
	sortMethod,
	selectedTemplates,
	loading,
	setLoading,
	handleDelete,
	handleUpdate,
	filter,
}) => {
	return (
		<table className='w-full table-auto'>
			<thead className='bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'>
				<tr>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Mint</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Title</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Circulation</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Price</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>Floor</th>
					<th className='py-1 px-2 sm:py-3 sm:px-6'>List Date</th>
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
									(o) => o.card.mintBatch,
									(o) => o.card.mintNumber,
									(o) => Number(o.price),
									(o) => Number(o.floor),
									(o) => o.card.inCirculation,
							  ]
							: sortMethod === "price"
							? [
									(o) => Number(o.price),
									(o) => o.card.mintBatch,
									(o) => o.card.mintNumber,
									(o) => Number(o.floor),
									(o) => o.card.inCirculation,
							  ]
							: sortMethod === "floor"
							? [
									(o) => Number(o.floor),
									(o) => o.card.mintBatch,
									(o) => o.card.mintNumber,
									(o) => Number(o.price),
									(o) => o.card.inCirculation,
							  ]
							: sortMethod === "date"
							? [
									(o) => -o.marketId,
									(o) => o.card.mintBatch,
									(o) => o.card.mintNumber,
									(o) => Number(o.price),
									(o) => o.card.inCirculation,
							  ]
							: [
									(o) => o.card.inCirculation,
									(o) => o.card.mintBatch,
									(o) => o.card.mintNumber,
									(o) => Number(o.floor),
									(o) => Number(o.price),
							  ]
					)
						.filter(
							(item) =>
								item.card.mintBatch === filter.batch &&
								item.card.mintNumber <= filter.max &&
								item.card.mintNumber >= filter.min
						)
						.filter((item) => (filter.undercut ? item.price > item.card.floor : true))
						.map((item) => (
							<DelisterRow
								key={item.marketId}
								item={item}
								selectedTemplates={selectedTemplates}
								loading={loading}
								setLoading={setLoading}
								setListed={setListed}
								handleDelete={handleDelete}
								handleUpdate={handleUpdate}
							/>
						))}
			</tbody>
		</table>
	);
};
export default DelisterTable;
