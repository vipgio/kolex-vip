import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
const MintResults = ({ setShowResults, results, loading, total }) => {
	return (
		<div className='fixed inset-0 z-20 flex flex-col items-center justify-center overscroll-none bg-black/90'>
			<div className='absolute inset-0 z-20 my-auto mx-8 flex h-fit max-h-[80vh] flex-col overflow-hidden overscroll-none rounded-md bg-gray-900 sm:mx-24'>
				<div
					className='relative flex h-12 w-full items-center border-b border-b-white/10 bg-gray-800' /*modal header*/
				>
					<h1
						className='mx-auto py-2 text-3xl text-gray-200'
						onClick={() => console.log(results)}
					>
						{loading ? (
							<div className='h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-gray-700'></div>
						) : (
							<>
								Results{" "}
								<span className='text-base'>
									{results.length}
									<span className='text-orange-500'>/</span>
									{total}
								</span>
							</>
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
								<th className='py-1 px-2 sm:py-3 sm:px-6'>ID</th>
								<th className='py-1 px-2 sm:py-3 sm:px-6'>Owner</th>
							</tr>
						</thead>
						<tbody>
							{uniqBy(
								sortBy(results, (o) => o.mintNumber),
								(o) => o.id
							).map((item) => (
								<tr
									className='border-b border-gray-700 bg-gray-800 text-center text-gray-300 hover:bg-gray-600'
									key={item.id}
								>
									<td
										className={`py-1 px-2 sm:py-3 sm:px-6 ${
											item.signatureImage ? "text-yellow-400" : ""
										}`}
										title={item.signatureImage && "Signed"}
									>
										{item.mintBatch}
										{item.mintNumber}
									</td>

									<td className='min-w-[10rem] py-1 px-2 sm:py-3 sm:px-6'>
										{item.title}
									</td>
									<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.id}</td>

									<td className='py-1 px-2 sm:py-3 sm:px-6'>
										<a
											target='_blank'
											href={`https://kolex.gg/csgo/users/${item.owner.username}`}
											rel='noopener noreferrer'
											className='underline'
										>
											{item.owner.username}
										</a>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
export default MintResults;
