import PurchaseRow from "./PurchaseRow";

const PurchaseTable = ({ results, loading, setLoading }) => {
	return (
		<>
			<div className='max-h-full overflow-auto'>
				<table className='w-full table-auto'>
					<thead className='bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'>
						<tr>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>User</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Title</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Price</th>
							<th className='hidden py-1 px-2 sm:table-cell sm:py-3 sm:px-6'>Min Offer</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Mint Date</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>List Date</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Buy</th>
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
