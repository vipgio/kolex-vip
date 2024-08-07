import { useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { CDN } from "@/config/config";
import ImageWrapper from "HOC/ImageWrapper";
import PriceDetails from "./PriceDetails";

const CardGalleryItem = ({ item, selectedTemplates, setSelectedTemplates }) => {
	const [showDetails, setShowDetails] = useState(false);

	return (
		<div
			title={item.count === item.listed ? "All items are already listed" : item.title}
			className={`relative flex ${
				item.count === 0 || item.listed === item.count
					? "cursor-not-allowed"
					: "cursor-pointer hover:scale-105"
			} flex-col items-center rounded border border-gray-500 text-gray-700 shadow-md transition-all dark:text-gray-300`}
			onClick={() => {
				selectedTemplates.some((e) => e.id === item.id)
					? setSelectedTemplates((prev) => prev.filter((selected) => item.id !== selected.id))
					: setSelectedTemplates((prev) => [...prev, item]);
			}}
		>
			<div className='relative aspect-auto w-24 overflow-hidden rounded-md p-0.5 sm:w-36'>
				<ImageWrapper
					src={item.images?.size402 || `${CDN}${item.images[0].url}`}
					width={200 * 1.5}
					height={300 * 1.5}
					alt={item.title}
					className={`h-full w-full rounded-lg border-4 object-cover transition-colors ${
						selectedTemplates.some((e) => e.id === item.id)
							? "border-primary-500 grayscale-0"
							: "border-transparent"
					}`}
				/>
				{!selectedTemplates.some((e) => e.id === item.id) && (
					<div className='absolute inset-1 z-20 rounded-md bg-black/60'></div>
				)}
			</div>
			{item.listed > 0 && (
				<div
					className='absolute right-2 top-2 flex items-center justify-center rounded bg-green-500 px-1 text-gray-900 dark:text-gray-100'
					title={item.listed < item.count ? `Some items are already listed` : "All items are already listed"}
				>
					{item.listed}x
					<AiOutlineShoppingCart size={18} className='h-4 w-4' />
				</div>
			)}
			<div className='mb-1 p-1 text-center text-sm'>{item.title}</div>
			<div className='mt-auto flex w-full items-center border-y border-gray-400'>
				<span className='ml-1'>Floor:</span>
				<span
					className='ml-auto mr-1.5 inline-flex h-3/4 w-4 items-center justify-center rounded bg-primary-500 text-center text-sm'
					title='Click for details'
					onClick={(e) => {
						e.stopPropagation();
						setShowDetails(true);
					}}
				>
					i
				</span>
				<span className='mr-1'>{item.floor ? "$" + item.floor : "-"}</span>
			</div>
			<div className='flex w-full border-b border-gray-400'>
				<span className='ml-1'>Circ:</span>
				<span className='ml-auto mr-1'>
					{item.inCirculation}
					{item.minted ? `/${item.minted}` : ``}
				</span>
			</div>
			<div className='w-full text-center text-sm font-semibold text-primary-500'>
				x
				<span className='text-base' title='Owned count'>
					{item.count}
				</span>
			</div>
			{showDetails && <PriceDetails item={item} showModal={showDetails} setShowModal={setShowDetails} />}
		</div>
	);
};
export default CardGalleryItem;
