import PurchaseRow from "./PurchaseRow";

const PurchaseTable = ({ results, loading, setLoading }) => {
	return (
		<>
			<div className='max-h-full overflow-auto'>
				<table className='w-full table-auto'>
					<thead className='text-gray-custom bg-gray-200 dark:bg-gray-700'>
						<tr>
							<th className='table-cell'>User</th>
							<th className='table-cell'>Title</th>
							<th className='table-cell'>Price</th>
							<th className='hidden py-1 px-2 sm:table-cell sm:py-3 sm:px-6'>Min Offer</th>
							<th className='table-cell'>Mint Date</th>
							<th className='table-cell'>List Date</th>
							<th className='table-cell'>Buy</th>
						</tr>
					</thead>
					<tbody>
						{results.map((item) => (
							<PurchaseRow item={item} key={item.marketId} setLoading={setLoading} loading={loading} />
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};
export default PurchaseTable;
