import { CSVLink } from "react-csv";
const ExportToCSV = ({ data, filename, type }) => {
	const headers = {
		mint: [
			"Mint Batch",
			"Mint Number",
			"Title",
			"Owner",
			"ID",
			"Signed",
			"Points",
			"Point gain",
		],
		market: [
			"Mint Batch",
			"Mint Number",
			"Title",
			"Seller",
			"ID",
			"Signed",
			"Type",
			"Points",
			"Point gain",
			"Min Offer",
			"Price",
			"Link",
		],
		compact: ["Best Mint", "Title", "Owned", "Circulation"],
		full: [
			"Mint Batch",
			"Mint Number",
			"Title",
			"Circulation",
			"Listed",
			"Market ID",
			"Immutable",
			"ID",
			"Signed",
			"Owner",
			"Points",
			"Need",
			"Point Gain",
		],
		transaction: ["Date", "Description", "Amount", "Type", "Details", "Cost Type", "ID"],
	};

	const array =
		type === "mint"
			? data.map((item) => [
					//mint search
					item.mintBatch,
					item.mintNumber,
					item.title,
					item.owner.username,
					item.id,
					item.signatureImage ? "Yes" : "No",
					(item.rating * 10).toFixed(2),
					item.delta,
			  ])
			: type === "market"
			? data.map((item) => [
					//market search
					item[item.type].mintBatch,
					item[item.type].mintNumber,
					item.title,
					item.user.username,
					item.card ? item.card.id : item.sticker.id,
					item.card ? (item.card.signatureImage ? "Yes" : "No") : "No",
					item.type,
					(item[item.type].rating * 10).toFixed(2),
					item.delta,
					item.minOffer ? item.minOffer : "-",
					item.price,
					`https://kolex.gg/market/${item.type}/${
						item.card ? item.card.cardTemplateId : item.sticker.stickerTemplateId
					}/${item.marketId}`,
			  ])
			: type === "compact"
			? data.map((item) => [
					//scanner compact
					item.mintBatch,
					item.mintNumber,
					item.title,
					item.owned,
					item.inCirculation,
			  ])
			: type === "full"
			? data.map((item) => [
					//scanner
					item.mintBatch,
					item.mintNumber,
					item.title,
					item.inCirculation,
					item.status === "market" ? "Yes" : "No",
					item.marketId,
					item.status === "imx_locked" ? "Yes" : "No",
					item.id,
					item.signed ? "Yes" : "No",
					item.owner,
					(item.rating * 10).toFixed(2),
					item.need ? "Yes" : "No",
					Math.max(item.delta, 0),
			  ]) //transaction
			: data.map((item) => [
					item.created.replace("T", " ").split(".")[0],
					item.description,
					item.amount,
					item.type,
					item.details?.title ? item.details.title : "-",
					item.costType,
					item.details?.entityId ? item.details.entityId : "-",
			  ]);

	const csvData = [headers[type], ...array];
	return (
		<div>
			<button className='inline-flex cursor-pointer items-center justify-center rounded-md border border-transparent border-gray-200 bg-gray-800 text-center font-medium text-primary-500 shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 active:shadow-lg enabled:hover:bg-gray-700 enabled:hover:text-primary-600 enabled:active:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:enabled:hover:bg-gray-300 dark:enabled:active:bg-gray-400'>
				<CSVLink
					data={csvData}
					filename={filename}
					className='px-3 py-2 focus:outline-none'
					tabIndex={-1}
				>
					Export
				</CSVLink>
			</button>
		</div>
	);
};
export default ExportToCSV;
