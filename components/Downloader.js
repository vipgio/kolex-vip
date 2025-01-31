import { useState } from "react";

import { DownloadIcon } from "./Icons";
import LoadingSpin from "./LoadingSpin";

const Downloader = ({ cards, collection }) => {
	const urls = cards.map((card) => card.images.size402);
	const [isLoading, setIsLoading] = useState(false);

	const downloadImages = async () => {
		setIsLoading(true);
		try {
			// Create a new instance of JSZip
			const JSZip = await import("jszip").then((module) => module.default);
			const zip = new JSZip();

			// Download all images and add them to the zip
			const imagePromises = urls.map(async (url, index) => {
				const response = await fetch(url);
				const blob = await response.blob();
				const filename = `${cards[index].title}${getFileExtension(url)}`;
				console.log(filename);
				zip.file(filename, blob);
			});

			await Promise.all(imagePromises);

			// Generate and download the zip file
			const content = await zip.generateAsync({ type: "blob" });
			const downloadUrl = URL.createObjectURL(content);

			const link = document.createElement("a");
			link.href = downloadUrl;
			link.download = `${collection.collection.properties.seasons[0]} - ${collection.collection.name}.zip`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(downloadUrl);
		} catch (error) {
			console.error("Error downloading images:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const getFileExtension = (url) => {
		console.log(url);
		const match = url.match(/\.([^./]+)(?:[?#]|$)/);
		return match ? `.${match[1]}` : ".jpg";
	};

	const test = () => {
		console.log("test");
	};

	return (
		<div className='flex flex-col items-center gap-4'>
			<button
				onClick={downloadImages}
				disabled={isLoading}
				className='flex items-center rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed'
			>
				{isLoading ? <LoadingSpin size={4} /> : <DownloadIcon title='Download images' />}
			</button>
		</div>
	);
};

export default Downloader;
