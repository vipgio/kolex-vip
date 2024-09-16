import FilteredBox from "./FilteredBox";

const ImageModeGallery = ({ packs, filters }) => {
	return (
		<div className='mt-4 grid grid-cols-2 gap-3 p-1.5 px-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'>
			{packs
				.filter(
					(pack) =>
						filters.seasons.includes(pack.properties.seasons[0]) &&
						(filters.costTypes.length > 0 ? filters.costTypes.includes(pack.costType) : true)
				)
				.sort((a, b) => a.purchaseStart - b.purchaseStart)
				.map((pack) => (
					<FilteredBox pack={pack} key={pack.id} />
				))}
		</div>
	);
};
export default ImageModeGallery;
