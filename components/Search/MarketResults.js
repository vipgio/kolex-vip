import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
const MarketResults = ({ setShowResults, results, loading }) => {
	return (
		<div className='fixed inset-0 z-20 flex flex-col items-center justify-center bg-black/70'>
			<div className='absolute inset-0 z-20 my-8 mx-8 flex flex-col overflow-hidden rounded-md bg-gray-900 sm:mx-24'>
				<div
					className='relative flex h-12 w-full items-center border-b border-b-white/10 bg-gray-800' /*modal header*/
				>
					<h1 className='mx-auto py-2 text-3xl text-gray-200'>
						{loading ? (
							<div className='h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-gray-700'></div>
						) : (
							"Results"
						)}
					</h1>
					<button
						className='absolute right-0 top-0 h-12 w-12 p-1 text-gray-300 transition-colors duration-300 hover:cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300 active:bg-indigo-300 active:text-orange-400'
						onClick={() => setShowResults(false)}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							strokeWidth={2}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>

				<div className='max-h-full overflow-auto'>
					<table className='w-full table-auto'>
						<thead className='bg-gray-700 text-gray-300'>
							<tr>
								<th className='py-1 px-2 sm:py-3 sm:px-6'>Mint</th>
								<th className='py-1 px-2 sm:py-3 sm:px-6'>Title</th>
								<th className='py-1 px-2 sm:py-3 sm:px-6'>Price</th>
								<th className='hidden py-1 px-2 sm:table-cell sm:py-3 sm:px-6'>
									Min Offer
								</th>
								<th className='py-1 px-2 sm:py-3 sm:px-6'>Seller</th>
								<th className='py-1 px-2 sm:py-3 sm:px-6'>Link to item</th>
							</tr>
						</thead>
						<tbody>
							{uniqBy(
								sortBy(results, (o) => {
									const mint = o.card ? o.card.mintNumber : o.sticker.mintNumber;
									return mint;
								}),
								(o) => o.marketId
							).map((item) => (
								<tr
									className='border-b border-gray-700 bg-gray-800 text-center text-gray-300 hover:bg-gray-600'
									key={item.marketId}
								>
									{item.card ? (
										<td className='py-1 px-2 sm:py-3 sm:px-6'>
											{item.card.mintBatch}
											{item.card.mintNumber}
										</td>
									) : (
										<td className='py-1 px-2 sm:py-3 sm:px-6'>
											{item.sticker.mintBatch}
											{item.sticker.mintNumber}
										</td>
									)}
									<td className='min-w-[10rem] py-1 px-2 sm:py-3 sm:px-6'>
										{item.title}
									</td>
									<td className='py-1 px-2 sm:py-3 sm:px-6'>${item.price}</td>
									<td className='hidden h-full min-w-[10rem] items-end py-1 px-2 sm:table-cell sm:py-3 sm:px-6'>
										{item.minOffer ? item.minOffer : "-"}
									</td>
									<td className='py-1 px-2 sm:py-3 sm:px-6'>
										<a
											target='_blank'
											href={`https://kolex.gg/csgo/users/${item.user.username}`}
											rel='noopener noreferrer'
											className='underline'
										>
											{item.user.username}
										</a>
									</td>
									<td className='py-1 px-2 sm:py-3 sm:px-6'>
										<a
											target='_blank'
											href={`https://kolex.gg/csgo/marketplace/${item.type}/${
												item.card
													? item.card.cardTemplateId
													: item.sticker.stickerTemplateId
											}/${item.marketId}`}
											rel='noopener noreferrer'
											className='text-orange-500 underline'
										>
											Click
										</a>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<div //fullscreen close button
				className='fixed z-10 h-screen w-screen'
				onClick={() => setShowResults(false)}
			></div>
		</div>
	);
};
export default MarketResults;
