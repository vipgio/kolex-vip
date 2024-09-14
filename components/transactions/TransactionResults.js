import { useContext, useState } from "react";
import uniqBy from "lodash/uniqBy";
import { UserContext } from "@/context/UserContext";
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
		<div className='mx-2'>
			<div className='m-1 mt-2 flex flex-col justify-start sm:ml-0 sm:flex-row'>
				<label htmlFor='filter' className='text-gray-custom font-semibold sm:m-1'>
					Show:{" "}
				</label>
				<select
					id='filter'
					className='h-8 rounded-md border border-gray-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-300'
					onChange={handleFilter}
				>
					<option value='both'>Income & Expense</option>
					<option value='income'>Income</option>
					<option value='expense'>Expense</option>
				</select>
			</div>
			<div className='my-1 flex'>
				<div>
					<div className='text-gray-custom m-1 font-medium'>Total events: {filteredResults.length}</div>
					<div className='text-gray-custom m-1 font-medium'>
						Total amount:
						<span
							className={
								Number(filteredResults.reduce((acc, cur) => acc + Number(cur.amount), 0)) > 0
									? "text-green-400"
									: "text-red-400"
							}
						>
							{" "}
							{filteredResults.reduce((acc, cur) => acc + Number(cur.amount), 0).toLocaleString()}{" "}
						</span>
						{results[0]?.costType.length <= 4
							? results[0]?.costType.toUpperCase()
							: results[0]?.costType[0].toUpperCase() + results[0]?.costType.slice(1)}
					</div>
				</div>
				<div className='ml-auto mr-2 flex items-center'>
					<ExportToCSV
						type='transaction'
						filename={`Transactions - ${filters.startDate
							?.toISOString()
							.split("T")[0]
							.replaceAll("-", "/")}-${filters.endDate?.toISOString().split("T")[0].replaceAll("-", "/")} - ${
							filters.costType
						}`}
						data={filteredResults}
					/>
				</div>
			</div>
			<div className='mx-1 mb-5 flex flex-col justify-center overflow-x-auto rounded border border-gray-300'>
				<table className='w-full table-auto'>
					<thead className='text-gray-custom bg-gray-200 dark:bg-gray-700'>
						<tr>
							<th className='table-cell'>Date</th>
							<th className='table-cell'>Description</th>
							<th className='table-cell'>Amount</th>
							<th className='table-cell'>Type</th>
							{results[0]?.costType !== "silvercoins" && <th className='table-cell'>Details</th>}
							<th className='table-cell'>Cost Type</th>
							<th className='table-cell'>History</th>
						</tr>
					</thead>
					<tbody>
						{uniqBy(filteredResults, (o) => o.id).map((tr) => (
							<TransactionResultsRow item={tr} allowed={user.info.allowed.includes("history")} key={tr.id} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
export default TransactionResults;
