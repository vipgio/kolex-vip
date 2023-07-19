import { useContext, useState } from "react";
import uniqBy from "lodash/uniqBy";
import { UserContext } from "context/UserContext";
import TransactionResultsRow from "./TransactionResultsRow";
import ExportToCSV from "../ExportToCSV";

const TransactionResults = ({ results, filters }) => {
	const { user } = useContext(UserContext);
	const [filterMethod, setFilterMethod] = useState("both");
	const filteredResults =
		filterMethod === "both"
			? results
			: filterMethod === "income"
			? results.filter((tr) => tr.amount > 0)
			: results.filter((tr) => tr.amount < 0);

	const handleFilter = (e) => {
		setFilterMethod(e.target.value);
	};
	return (
		<>
			<div className='mt-2 flex flex-col justify-start sm:flex-row'>
				<label
					htmlFor='filter'
					className='font-semibold text-gray-700 dark:text-gray-300 sm:m-1'
				>
					Show:{" "}
				</label>
				<select
					id='filter'
					className='h-8 rounded-md border border-gray-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-300'
					onChange={handleFilter}
				>
					<option value='both'>Income & Expense</option>
					<option value='income'>Income</option>
					<option value='expense'>Expense</option>
				</select>
			</div>
			<div className='flex'>
				<div>
					<div className='m-1 font-medium text-gray-700 dark:text-gray-300'>
						Total events: {filteredResults.length}
					</div>
					<div className='m-1 font-medium text-gray-700 dark:text-gray-300'>
						Total amount:
						<span
							className={
								Number(
									filteredResults.reduce((acc, cur) => acc + Number(cur.amount), 0)
								) > 0
									? "text-green-400"
									: "text-red-400"
							}
						>
							{" "}
							{filteredResults
								.reduce((acc, cur) => acc + Number(cur.amount), 0)
								.toLocaleString()}{" "}
						</span>
						{results[0]?.costType.length <= 4
							? results[0]?.costType.toUpperCase()
							: results[0]?.costType[0].toUpperCase() + results[0]?.costType.slice(1)}
					</div>
				</div>
				<div className='ml-auto mr-2'>
					<ExportToCSV
						type='transaction'
						filename={`Transactions - ${filters.startDate
							?.toISOString()
							.split("T")[0]
							.replaceAll("-", "/")}-${filters.endDate
							?.toISOString()
							.split("T")[0]
							.replaceAll("-", "/")} - ${filters.costType}`}
						data={filteredResults}
					/>
				</div>
			</div>
			<div className='mx-1 mb-5 flex flex-col justify-center overflow-x-auto rounded border border-gray-300'>
				<table className='w-full table-auto'>
					<thead className='bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'>
						<tr>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Date</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Description</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Amount</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Type</th>
							{results[0]?.costType !== "silvercoins" && (
								<th className='py-1 px-2 sm:py-3 sm:px-6'>Details</th>
							)}
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Cost Type</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>History</th>
						</tr>
					</thead>
					<tbody>
						{uniqBy(filteredResults, (o) => o.id).map((tr) => (
							<TransactionResultsRow
								item={tr}
								allowed={user.info.allowed.includes("history")}
								key={tr.id}
							/>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};
export default TransactionResults;
