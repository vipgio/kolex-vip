import Link from "next/link";
import { memo, useContext, useState } from "react";

import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";

import { UserContext } from "@/context/UserContext";

import BigModal from "@/components/BigModal";
import { LockIcon, SignatureIcon } from "@/components/Icons";
import Tooltip from "@/components/Tooltip";
import HistoryModal from "@/components/history/HistoryModal";

import ExportToCSV from "../ExportToCSV";
import MarketResultRow from "./MarketResultRow";

const MarketResults = memo(
	({ showModal, setShowModal, results, loading, finished, filter, selectedCollection }) => {
		const { user } = useContext(UserContext);
		const [hideBadDeals, setHideBadDeals] = useState(false);
		const [sortMethod, setSortMethod] = useState("mint");
		const [advanced, setAdvanced] = useState(false);

		const suffix = advanced
			? ""
			: filter.sigsOnly
				? "Signatures"
				: filter.upgradesOnly
					? "Point Upgrades"
					: `[${filter.batch}${filter.min}-${filter.batch}${filter.max}]`;

		const uniqResults = uniqBy(sortBy(results, sortCriteria[sortMethod] || []), (o) => o.marketId);

		const shownResults = hideBadDeals
			? uniqResults.filter((item, index) => {
					const sameTitles = uniqResults
						.slice(0, index)
						.find(
							(betterItem) =>
								betterItem.title === item.title &&
								Number(betterItem.price) <= Number(item.price) &&
								(betterItem[betterItem.type].mintBatch <= item[item.type].mintBatch ||
									betterItem[betterItem.type].mintNumber <= item[item.type].mintNumber),
						);
					return sameTitles ? false : true;
				})
			: uniqResults;

		const [selectedItem, setSelectedItem] = useState(null);
		const [isModalOpen, setIsModalOpen] = useState(false);

		const openModal = (item) => {
			setSelectedItem(item);
			setIsModalOpen(true);
		};
		return (
			<BigModal
				header='Results'
				loading={loading}
				showModal={showModal}
				setShowModal={setShowModal}
				closingFunction={() => {
					finished.current = true;
				}}
				extraStyle='h-fit my-auto'
				hasToast={true}
				stopButton={
					!finished.current && (
						<button
							className='my-outline ml-2 rounded bg-red-400 p-1 font-semibold hover:bg-red-500 active:bg-red-600 text-gray-custom'
							onClick={() => (finished.current = true)}
							title='Stop the search'
						>
							Stop
						</button>
					)
				}
				escapeClose={false}
			>
				{results.length > 0 && (
					<>
						<div className='m-2 flex items-center justify-between'>
							<div>
								<label htmlFor='sort' className='text-gray-custom'>
									Sort By:
								</label>
								<select
									name='sort'
									id='sort'
									className='dropdown mx-2 my-1'
									onChange={(e) => setSortMethod(e.target.value)}
									value={sortMethod}
								>
									<option value='mint'>Mint</option>
									<option value='price'>Price</option>
									<option value='point'>Point gain</option>
									<option value='ppv'>Point/Price</option>
									{advanced && <option value='p*m'>Point*Mint</option>}
									{advanced && <option value='index'>Index</option>}
								</select>
							</div>
							<div className='text-gray-custom'>
								<input
									type='checkbox'
									name='advanced'
									id='advanced'
									checked={advanced}
									onChange={(e) => setAdvanced(e.target.checked)}
									className='checkbox'
								/>
								<label
									htmlFor='advanced'
									className='text-gray-custom ml-1 w-min cursor-pointer sm:w-auto'
								>
									Advanced
								</label>
							</div>
						</div>

						<div className='max-h-full overflow-auto'>
							<table className='w-full table-auto'>
								<thead className='text-gray-custom sticky top-0 z-10 bg-gray-200 dark:bg-gray-700'>
									<tr>
										<th className='table-cell'>Mint</th>
										<th className='table-cell'>Title</th>
										<th className='table-cell'>Price</th>
										<th className='hidden py-1 px-2 sm:table-cell sm:py-3 sm:px-6'>
											Min Offer
										</th>
										<th className='table-cell'>Point gain</th>
										{advanced && (
											<th className='table-cell' title='Points Per Value'>
												PPV
											</th>
										)}
										{advanced && (
											<th className='table-cell' title='Points * Mint'>
												P*M
											</th>
										)}
										<th className='table-cell'>Seller</th>
										{advanced && (
											<div className='flex items-center justify-center py-1 px-2 sm:py-3 sm:px-6'>
												<th className='table-cell !px-0'>Index</th>
												<Tooltip
													text='PPV / P*M - Some arbitary formula that I came up with. Higher is better.'
													direction='right'
												/>
											</div>
										)}
										<th className='table-cell'>Link</th>
										<th className='table-cell'>History</th>
										<th className='table-cell'>Buy</th>
									</tr>
								</thead>
								<tbody>
									{shownResults.map((item) => (
										<MarketResultRow
											key={item.marketId}
											item={item}
											allowed={user.info.allowed.includes("history")}
											adv={advanced}
											openModal={openModal}
										/>
									))}
								</tbody>
							</table>
							{isModalOpen && selectedItem && (
								<HistoryModal
									data={selectedItem}
									isOpen={isModalOpen}
									setIsOpen={setIsModalOpen}
									type={selectedItem.type}
									method={selectedItem.type === "card" ? "uuid" : undefined}
								/>
							)}
						</div>

						<div className='flex items-center p-3'>
							<div className='ml-2 flex flex-col'>
								<div className='inline-flex items-center'>
									<input
										type='checkbox'
										name='badDeals'
										id='badDeals'
										checked={hideBadDeals}
										onChange={(e) => setHideBadDeals(e.target.checked)}
										className='checkbox'
									/>
									<label
										htmlFor='badDeals'
										className='text-gray-custom ml-1 w-min cursor-pointer sm:w-auto'
									>
										Hide bad deals
									</label>
									<Tooltip
										direction='right'
										text='Hide items that have a better mint and cheaper alternative in the results. Might not show expected results when using other sorting methods.'
									/>
								</div>
								<span className='inline-flex items-center text-yellow-500'>
									<SignatureIcon className='mr-2' /> Signed
									<span className='ml-1 hidden sm:block'>Item</span>
								</span>
							</div>
							<div className='ml-auto inline-flex gap-4'>
								<div className='flex items-center'>
									{user.info.allowed.includes("history") ? (
										<>
											<Tooltip
												text="Don't use it on like a million cards all at once."
												direction='left'
											/>
											<Link
												href={{
													pathname: "/history",
													query: {
														href: JSON.stringify(
															results
																.filter((item) => item.type === "card")
																.map((item) => item.card.id),
														),
													},
												}}
												as='/history'
												passHref
											>
												<button
													className='button'
													disabled={!user.info.allowed.includes("history")}
												>
													History
												</button>
											</Link>
										</>
									) : (
										<>
											<Tooltip
												text='You need access to the history feature for this.'
												direction='left'
											/>
											<button className='button' disabled title='No Access'>
												History
												<LockIcon />
											</button>
										</>
									)}
								</div>
								{!advanced && (
									<ExportToCSV
										data={shownResults}
										filename={`${selectedCollection.collection.properties.seasons[0]} - ${selectedCollection.collection.properties.tiers[0]} - ${selectedCollection.collection.name} - ${suffix} - Market`}
										type='market'
									/>
								)}
							</div>
						</div>
					</>
				)}
			</BigModal>
		);
	},
);
MarketResults.displayName = "MarketResults";
export default MarketResults;

const sortCriteria = {
	mint: [
		(o) => (o.card || o.sticker).mintBatch,
		(o) => (o.card || o.sticker).mintNumber,
		(o) => Number(o.price),
		(o) => o.card?.cardTemplateId || o.stickerTemplateId,
	],
	price: [
		(o) => Number(o.price),
		(o) => (o.card || o.sticker).mintBatch,
		(o) => (o.card || o.sticker).mintNumber,
		(o) => o.card?.cardTemplateId || o.stickerTemplateId,
	],
	point: [
		(o) => -Number(Math.max(Number(o.delta), 0)),
		(o) => Number(o.price),
		(o) => (o.card || o.sticker).mintBatch,
		(o) => (o.card || o.sticker).mintNumber,
		(o) => o.card?.cardTemplateId || o.stickerTemplateId,
	],
	ppv: [
		(o) => -(Math.max(Number(o.delta), 0) / Number(o.price)),
		(o) => Number(o.price),
		(o) => (o.card || o.sticker).mintBatch,
		(o) => (o.card || o.sticker).mintNumber,
		(o) => o.card?.cardTemplateId || o.stickerTemplateId,
	],
	"p*m": [
		(o) => Number(o.price) * (o.card || o.sticker).mintNumber,
		(o) => Number(o.price),
		(o) => (o.card || o.sticker).mintBatch,
		(o) => (o.card || o.sticker).mintNumber,
		(o) => o.card?.cardTemplateId || o.stickerTemplateId,
	],
	index: [
		(o) => -o.delta / (Number(o.price) * Number(o.price) * (o.card || o.sticker).mintNumber),
		(o) => (o.card || o.sticker).mintBatch,
		(o) => (o.card || o.sticker).mintNumber,
		(o) => Number(o.price),
		(o) => o.card?.cardTemplateId || o.stickerTemplateId,
	],
};
