import { CSVLink } from "react-csv";
import { webApp } from "@/config/config";
const ExportToCSV = ({ data, filename, type }) => {
	const headers = {
		mint: ["Mint Batch", "Mint Number", "Title", "Owner", "ID", "Signed", "Points", "Point gain"],
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
					`${webApp}/${item.type}/${item.templateUUID}/${item.uuid}`,
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
			<button className='button'>
				<CSVLink data={csvData} filename={filename} tabIndex={-1}>
					Export
				</CSVLink>
			</button>
		</div>
	);
};
export default ExportToCSV;
