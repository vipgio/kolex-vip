import { CDN } from "@/config/config";
import ImageWrapper from "@/HOC/ImageWrapper";

const CardGalleryItem = ({ item, selectedCards, setSelectedCards }) => {
	const handleItem = () => {
		selectedCards.some((e) => e.uuid === item.uuid)
			? setSelectedCards((prev) => prev.filter((selectedItem) => selectedItem.uuid !== item.uuid))
			: setSelectedCards((prev) => [
					...prev,
					{
						uuid: item.uuid,
						title: item.title,
						type: item.cardType ? "card" : "sticker",
						id: item.id,
					},
			  ]);
	};
	return (
		<button className={`gallery-item flex flex-col items-center border border-gray-500`} onClick={handleItem}>
			<div className='relative aspect-auto w-28 overflow-hidden rounded-md p-0.5 sm:w-36'>
				<ImageWrapper
					src={item.images?.size402 || `${CDN}${item.images[0].url}`}
					width={200 * 1.5}
					height={300 * 1.5}
					alt={item.title}
					className={`h-full w-full rounded-lg border-4 object-cover transition-colors ${
						selectedCards.some((e) => e.uuid === item.uuid)
							? "border-primary-500 grayscale-0"
							: "border-transparent"
					}`}
				/>
				{!selectedCards.some((e) => e.uuid === item.uuid) && (
					<div className='absolute inset-1 z-20 rounded-md bg-black/60'></div>
				)}
			</div>
			<div className='text-gray-custom px-1 py-0.5 text-center text-sm'>{item.title}</div>
		</button>
	);
};
export default CardGalleryItem;
