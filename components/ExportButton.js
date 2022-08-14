const ExportButton = ({ data, filename }) => {
	const headers = (headers = [
		"Mint",
		"Title",
		"Circulation",
		"Listed",
		"Immutable",
		"ID",
		"Points",
	]);
	const createCSV = () => {
		const exportArray = data.map(
			(item) =>
				`${item.mintBatch}${item.mintNumber}|${item.title}|${item.inCirculation}|${
					item.status === "market" ? "Yes" : "No"
				}|${item.status === "imx_locked" ? "Yes" : "No"}|${item.id}|${(
					item.rating * 10
				).toFixed(2)}`
		);
		exportArray.unshift(headers.join("|"));
		return exportArray.toString().split(",").join("\n");
	};
	const handleExport = () => {
		const csv = createCSV();
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		if (navigator.msSaveBlob) {
			// In case of IE 10+
			navigator.msSaveBlob(blob, filename);
		} else {
			const link = document.createElement("a");
			if (link.download !== undefined) {
				// Browsers that support HTML5 download attribute
				const url = URL.createObjectURL(blob);
				link.setAttribute("href", url);
				link.setAttribute("download", filename);
				link.style.visibility = "hidden";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	};
	return (
		<div>
			<button
				onClick={handleExport}
				className='rounded-md border bg-white p-1 font-semibold text-green-500 shadow-md'
			>
				Export
			</button>
		</div>
	);
};
export default ExportButton;
