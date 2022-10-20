import { UserContext } from "context/UserContext";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
import { useContext } from "react";
import { FaSignature, FaLock, FaBan } from "react-icons/fa";
import ExportToCSV from "../ExportToCSV";
import HistoryModal from "../HistoryModal";
import LoadingSpin from "../LoadingSpin";
const MintResults = ({
	setShowResults,
	results,
	loading,
	total,
	finished,
	filter,
	selectedCollection,
}) => {
	const { user } = useContext(UserContext);
	const suffix = filter.sigsOnly
		? "Signatures"
		: filter.upgradesOnly
		? "Point Upgrades"
		: `[${filter.batch}${filter.min}-${filter.batch}${filter.max}]`;
	return (
		<div className='fixed inset-0 z-30 flex flex-col items-center justify-center overscroll-none bg-black/90'>
			<div className='absolute inset-0 z-20 my-auto mx-8 flex h-fit max-h-[90vh] flex-col overflow-hidden overscroll-none rounded-md bg-gray-200 dark:bg-gray-900 sm:mx-16'>
				<div
					className='relative flex h-12 w-full items-center border-b border-b-white/10 bg-gray-300 dark:bg-gray-800' /*modal header*/
				>
					{!finished.current && (
						<button
							className='ml-2 rounded bg-red-400 p-1 font-semibold text-gray-800 hover:bg-red-500 active:bg-red-600 dark:text-gray-200'
							onClick={() => (finished.current = true)}
							title='Stop the search'
						>
							Stop
						</button>
					)}
					<h1 className='mx-auto py-2 text-3xl text-gray-800 dark:text-gray-200'>
						{loading ? (
							<LoadingSpin />
						) : (
							<>
								Results{" "}
								<span className='text-base'>
									{results.length}
									{!filter.sigsOnly && !filter.upgradesOnly && (
										<>
											<span className='text-orange-500'>/</span>
											{total}
										</>
									)}
								</span>
							</>
						)}
					</h1>
					<button
						className='absolute right-0 top-0 h-12 w-12 p-1 text-gray-900 transition-colors duration-300 hover:cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300 active:bg-indigo-300 active:text-orange-400 dark:text-gray-200 dark:hover:bg-gray-700'
						onClick={() => {
							setShowResults(false);
							finished.current = true;
						}}
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
						<thead className='bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'>
							<tr>
								<th className='py-1 px-2 sm:py-3 sm:px-6'>Mint</th>
								<th className='py-1 px-2 sm:py-3 sm:px-6'>Title</th>
								<th className='py-1 px-2 sm:py-3 sm:px-6'>ID</th>
								<th className='py-1 px-2 sm:py-3 sm:px-6'>Point gain</th>
								<th className='py-1 px-2 sm:py-3 sm:px-6'>Owner</th>
								<th className='py-1 px-2 sm:py-3 sm:px-6'>History</th>
							</tr>
						</thead>
						<tbody>
							{uniqBy(
								sortBy(results, [
									(o) => o.mintNumber,
									(o) => (o.cardTemplateId ? o.cardTemplateId : o.stickerTemplateId),
								]),
								(o) => o.id
							).map((item) => (
								<tr
									className='border-b border-gray-300 bg-gray-100 text-center text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600'
									key={item.id}
								>
									<td
										className={`py-1 px-2 sm:py-3 sm:px-6 ${
											item.signatureImage ? "text-yellow-500" : ""
										}`}
										title={item.signatureImage && "Signed"}
									>
										<div className='flex items-center justify-center'>
											{item.signatureImage && <FaSignature className='mr-2' />}
											{item.mintBatch}
											{item.mintNumber}
										</div>
									</td>

									<td className='min-w-[10rem] py-1 px-2 sm:py-3 sm:px-6'>
										{item.title}
									</td>
									<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.id}</td>
									<td className='py-1 px-2 sm:py-3 sm:px-6'>
										{item.delta > 0 ? `+${item.delta}` : 0}
									</td>

									<td className='py-1 px-2 sm:py-3 sm:px-6'>
										<a
											target='_blank'
											href={`https://kolex.gg/csgo/users/${item.owner.username}`}
											rel='noopener noreferrer'
											className='underline hover:text-orange-500'
										>
											{item.owner.username}
										</a>
									</td>
									<td className='py-1 px-2 sm:py-3 sm:px-6'>
										<div className='relative flex h-8 items-center justify-center'>
											{user.info.allowed.includes("history") ? (
												item.type !== "card" ? (
													<FaBan title="Doesn't work with stickers" />
												) : (
													<HistoryModal data={item} />
												)
											) : (
												<FaLock
													className='cursor-not-allowed'
													title='You need history access for this feature'
												/>
											)}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{results.length > 0 && (
					<div className='flex p-3'>
						<div className='ml-2 flex items-center text-yellow-500'>
							<FaSignature className='mr-2' /> Signed Item
						</div>

						<div className='ml-auto'>
							<ExportToCSV
								data={uniqBy(
									sortBy(results, [
										(o) => o.mintNumber,
										(o) => (o.cardTemplateId ? o.cardTemplateId : o.stickerTemplateId),
									]),
									(o) => o.id
								)}
								filename={`${selectedCollection.collection.properties.seasons[0]} - ${selectedCollection.collection.properties.tiers[0]} - ${selectedCollection.collection.name} - ${suffix} - Users`}
								type='mint'
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
export default MintResults;
