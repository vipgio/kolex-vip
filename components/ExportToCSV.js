import { CSVLink } from "react-csv";
import { webApp } from "@/config/config";
const ExportToCSV = ({ data, filename, type }) => {
	const commonHeaders = ["Mint Batch", "Mint Number", "Title", "Template ID"];
	const defineHeaders = () => {
		return {
			mint: [...commonHeaders, "Owner", "ID", "Signed", "Points", "Point gain"],
			market: [
				...commonHeaders,
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
			compact: [...commonHeaders, "Owned", "Circulation"],
			full: [
				...commonHeaders,
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
	};

	const headers = defineHeaders();

	const mapData = (type, data) => {
		const mappingFunctions = {
			mint: (item) => {
				const { mintBatch, mintNumber, title, id, owner, signatureImage, rating, delta } = item;
				const templateId = item.templateId || item.cardTemplateId || item.stickerTemplateId;
				return [
					mintBatch,
					mintNumber,
					title,
					templateId,
					owner.username,
					id,
					signatureImage ? "Yes" : "No",
					(rating * 10).toFixed(2),
					delta,
				];
			},
			market: (item) => {
				const {
					type: itemType,
					title,
					user,
					card,
					sticker,
					delta,
					minOffer,
					price,
					templateUUID,
					uuid,
				} = item;
				const itemTypeData = item[itemType];
				const templateId = item.templateId || itemTypeData.cardTemplateId || itemTypeData.stickerTemplateId;
				return [
					itemTypeData.mintBatch,
					itemTypeData.mintNumber,
					title,
					templateId,
					user.username,
					card ? card.id : sticker.id,
					card ? (card.signatureImage ? "Yes" : "No") : "No",
					itemType,
					(itemTypeData.rating * 10).toFixed(2),
					delta,
					minOffer || "-",
					price,
					`${webApp}/${itemType}/${templateUUID}/${uuid}`,
				];
			},
			compact: ({ mintBatch, mintNumber, title, templateId, owned, inCirculation }) => [
				mintBatch,
				mintNumber,
				title,
				templateId,
				owned,
				inCirculation,
			],
			full: (item) => {
				const {
					mintBatch,
					mintNumber,
					title,
					templateId,
					inCirculation,
					status,
					marketId,
					id,
					signed,
					owner,
					rating,
					need,
					delta,
				} = item;
				return [
					mintBatch,
					mintNumber,
					title,
					templateId,
					inCirculation,
					status === "market" ? "Yes" : "No",
					marketId,
					status === "imx_locked" ? "Yes" : "No",
					id,
					signed ? "Yes" : "No",
					owner,
					(rating * 10).toFixed(2),
					need ? "Yes" : "No",
					Math.max(delta, 0),
				];
			},
			transaction: (item) => {
				const { created, description, amount, type, details, costType } = item;
				return [
					created.replace("T", " ").split(".")[0],
					description,
					amount,
					type,
					details?.title || "-",
					costType,
					details?.entityId || "-",
				];
			},
		};

		const mappingFunction = mappingFunctions[type] || mappingFunctions.transaction;
		return data.map(mappingFunction);
	};

	const array = mapData(type, data);

	const csvData = [headers[type], ...array];
	return (
		<CSVLink data={csvData} filename={filename} tabIndex={-1}>
			<button className='button'>Export</button>
		</CSVLink>
	);
};
export default ExportToCSV;
