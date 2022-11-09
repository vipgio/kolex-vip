import { useContext } from "react";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
import { FaSignature } from "react-icons/fa";
import { UserContext } from "context/UserContext";
import ExportToCSV from "../ExportToCSV";
import LoadingSpin from "../LoadingSpin";
import MintResultRow from "./MintResultRow";
import BigModal from "../BigModal";

const MintResults = ({
	showModal,
	setShowModal,
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
		<BigModal
			header={
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
		>
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
							<MintResultRow
								item={item}
								allowed={user.info.allowed.includes("history")}
								key={item.id}
							/>
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
		</BigModal>
	);
};
export default MintResults;
