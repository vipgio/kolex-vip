import { CSVLink } from "react-csv";
const ExportToCSV = ({ data, filename, type }) => {
	const headers = {
		mint: ["Mint", "Title", "Owner", "ID", "Signed", "Points"],
		market: [
			"Mint",
			"Title",
			"Seller",
			"ID",
			"Signed",
			"Type",
			"Points",
			"Min Offer",
			"Price",
			"Link",
		],
		full: [
			"Mint",
			"Title",
			"Circulation",
			"Listed",
			"Immutable",
			"ID",
			"Signed",
			"Points",
		],
		compact: ["Best Mint", "Title", "Owned", "Circulation"],
	};

	const array =
		type === "mint"
			? data.map((item) => [
					`${item.mintBatch}${item.mintNumber}`,
					item.title,
					item.owner.username,
					item.id,
					item.signatureImage ? "Yes" : "No",
					(item.rating * 10).toFixed(2),
			  ])
			: type === "market"
			? data.map((item) => [
					`${item[item.type].mintBatch}${item[item.type].mintNumber}`,
					item.title,
					item.user.username,
					item.card ? item.card.id : item.sticker.id,
					item.card ? (item.card.signatureImage ? "Yes" : "No") : "No",
					item.type,
					(item[item.type].rating * 10).toFixed(2),
					item.minOffer ? item.minOffer : "-",
					item.price,
					`https://kolex.gg/csgo/marketplace/${item.type}/${
						item.card ? item.card.cardTemplateId : item.sticker.stickerTemplateId
					}/${item.marketId}`,
			  ])
			: type === "compact"
			? data.map((item) => [
					`${item.mintBatch}${item.mintNumber}`,
					item.title,
					item.owned,
					item.inCirculation,
			  ])
			: data.map((item) => [
					`${item.mintBatch}${item.mintNumber}`,
					item.title,
					item.inCirculation,
					item.status === "market" ? "Yes" : "No",
					item.status === "imx_locked" ? "Yes" : "No",
					item.id,
					item.signed ? "Yes" : "No",
					(item.rating * 10).toFixed(2),
			  ]);

	const csvData = [headers[type], ...array];
	return (
		<div>
			<button className='relative rounded-md border border-transparent bg-gray-100 py-1 text-sm font-medium text-orange-500 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 active:bg-gray-300 active:shadow-lg'>
				<CSVLink
					data={csvData}
					filename={filename}
					className='border border-transparent p-2 focus:outline-none'
					tabIndex={-1}
				>
					Export
				</CSVLink>
			</button>
		</div>
	);
};
export default ExportToCSV;
