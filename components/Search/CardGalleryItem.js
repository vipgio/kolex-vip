import { CDN } from "@/config/config";
import ImageWrapper from "HOC/ImageWrapper";

const CardGalleryItem = ({ item, selectedCards, setSelectedCards }) => {
	const handleItem = () => {
		selectedCards.some((e) => e.id === item.id)
			? setSelectedCards((prev) =>
					prev.filter((selectedItem) => selectedItem.id !== item.id)
			  )
			: setSelectedCards((prev) => [
					...prev,
					{
						id: item.id,
						title: item.title,
						type: item.cardType ? "card" : "sticker",
					},
			  ]);
	};
	return (
		<div
			className={`flex cursor-pointer flex-col items-center rounded border border-gray-500 transition-transform hover:scale-105`}
			onClick={handleItem}
		>
			<div className='relative aspect-auto w-28 overflow-hidden rounded-md p-0.5 sm:w-36'>
				<ImageWrapper
					src={item.images?.size402 || `${CDN}${item.images[0].url}`}
					width={200 * 1.5}
					height={300 * 1.5}
					alt={item.title}
					className={`h-full w-full rounded-lg border-4 object-cover transition-colors ${
						selectedCards.some((e) => e.id === item.id)
							? "border-orange-500 grayscale-0"
							: "border-transparent"
					}`}
				/>
				{!selectedCards.some((e) => e.id === item.id) && (
					<div className='absolute inset-1 z-20 rounded-md bg-black/60'></div>
				)}
			</div>
			<div className='px-1 py-0.5 text-center text-sm text-gray-700 dark:text-gray-300'>
				{item.title}
			</div>
		</div>
	);
};
export default CardGalleryItem;
