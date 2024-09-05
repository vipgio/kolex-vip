import { CSVLink } from "react-csv";
const ExportButton = ({ data }) => {
	const headers = [
		"Template ID",
		"Card ID",
		"Mint",
		"Card Name",
		"Timestamp",
		"Action",
		"From",
		"To",
		"Amount",
		"Cost Type",
	];

	const array = data.map((item) => [
		...item.history.toReversed().map((event) => [
			item.cardTemplateId, //template id
			item.id, //card id
			`${item.mintBatch}${item.mintNumber}`, //mint
			item.template?.title, //card name
			event.created.replace("T", " ").split(".")[0],
			event.type,
			event.sender?.username || "-",
			event.receiver?.username || "-",
			event.value,
			event.costType,
		]),
		[],
	]);

	const csvData = [headers, ...array.flat()];
	return (
		<div>
			<button className='inline-flex cursor-pointer items-center justify-center rounded-md border border-transparent border-gray-200 bg-gray-800 text-center font-medium text-primary-500 shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 active:shadow-lg enabled:hover:bg-gray-700 enabled:hover:text-primary-600 enabled:active:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:enabled:hover:bg-gray-300 dark:enabled:active:bg-gray-400'>
				<CSVLink data={csvData} filename='History' className='px-3 py-2 focus:outline-none' tabIndex={-1}>
					Export
				</CSVLink>
			</button>
		</div>
	);
};
export default ExportButton;
