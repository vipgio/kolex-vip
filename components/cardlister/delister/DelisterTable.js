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
			<thead className='text-gray-custom sticky top-0 bg-gray-200 dark:bg-gray-700'>
				<tr>
					<th className='table-cell'>Mint</th>
					<th className='table-cell'>Title</th>
					<th className='table-cell'>
						Circ
						<span className='hidden sm:inline'>ulation</span>
					</th>
					<th className='table-cell'>Price</th>
					<th className='table-cell'>Floor</th>
					<th className='table-cell'>List Date</th>
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
								(filter.batch === "any" || item.card.mintBatch === filter.batch) &&
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
