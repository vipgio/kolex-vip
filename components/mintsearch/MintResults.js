import { useContext } from "react";
import Link from "next/link";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
import { FaSignature, FaLock } from "react-icons/fa";
import { UserContext } from "@/context/UserContext";
import ExportToCSV from "../ExportToCSV";
import MintResultRow from "./MintResultRow";
import BigModal from "@/components/BigModal";
import Tooltip from "@/components/Tooltip";

const MintResults = ({
	showModal,
	setShowModal,
	results,
	loading,
	total,
	finished,
	filter,
	selectedCollection,
	usersChecked,
}) => {
	const { user } = useContext(UserContext);

	const suffix = filter.sigsOnly
		? "Signatures"
		: filter.upgradesOnly
		? "Point Upgrades"
		: `[${filter.batch}${filter.min}-${filter.batch}${filter.max}]`;

	return (
		<BigModal
			header={
				<>
					Results{" "}
					<span className='text-base'>
						{results.length}
						{!filter.sigsOnly && !filter.upgradesOnly && (
							<>
								<span className='text-primary-500'>/</span>
								{total}
							</>
						)}
					</span>
				</>
			}
			counter={
				<div className='text-center text-sm'>
					Checked <span className='text-orange-400'>{usersChecked}</span> Accounts
				</div>
			}
			showModal={showModal}
			setShowModal={setShowModal}
			loading={loading}
			closingFunction={() => (finished.current = true)}
			stopButton={
				!finished.current && (
					<button
						className='ml-2 rounded bg-red-400 p-1 font-semibold text-gray-800 hover:bg-red-500 active:bg-red-600 dark:text-gray-200'
						onClick={() => (finished.current = true)}
						title='Stop the search'
					>
						Stop
					</button>
				)
			}
			extraStyle='h-fit my-auto'
			escapeClose={false}
		>
			<div className='max-h-full overflow-auto'>
				<table className='w-full table-auto'>
					<thead className='text-gray-custom sticky top-0 z-10 bg-gray-200 dark:bg-gray-700'>
						<tr>
							<th className='table-cell'>Mint</th>
							<th className='table-cell'>Title</th>
							<th className='table-cell'>ID</th>
							<th className='table-cell'>Point gain</th>
							<th className='table-cell'>Owner</th>
							<th className='table-cell'>Link</th>
							<th className='table-cell'>History</th>
						</tr>
					</thead>
					<tbody>
						{uniqBy(
							sortBy(results, [
								(o) => o.mintBatch,
								(o) => o.mintNumber,
								(o) => -o.rating,
								(o) => (o.cardTemplateId ? o.cardTemplateId : o.stickerTemplateId),
							]),
							(o) => o.id
						).map((item) => (
							<MintResultRow item={item} allowed={user.info.allowed.includes("history")} key={item.id} />
						))}
					</tbody>
				</table>
			</div>
			{results.length > 0 && (
				<div className='flex p-3'>
					<div className='ml-2 flex items-center text-yellow-500'>
						<FaSignature className='mr-2' /> Signed
						<span className='ml-1 hidden sm:block'>Item</span>
					</div>

					<div className='ml-auto inline-flex gap-4'>
						<div className='flex items-center'>
							{user.info.allowed.includes("history") ? (
								<>
									<Tooltip text="Don't use it on like a million cards all at once." direction='left' />
									<Link
										href={{
											pathname: "/history",
											query: {
												href: JSON.stringify(
													results.filter((item) => item.type === "card").map((item) => item.id)
												),
											},
										}}
										as='/history'
										passHref
									>
										<button className='button' disabled={!user.info.allowed.includes("history")}>
											History
										</button>
									</Link>
								</>
							) : (
								<>
									<Tooltip text='You need access to the history feature for this.' direction='left' />
									<button className='button' disabled title='No Access'>
										History
										<FaLock />
									</button>
								</>
							)}
						</div>
						<ExportToCSV
							data={uniqBy(
								sortBy(results, [
									(o) => o.mintBatch,
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
		</BigModal>
	);
};
export default MintResults;
