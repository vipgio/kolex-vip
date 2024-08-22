import { useState } from "react";
import { CDN } from "@/config/config";
import ImageWrapper from "HOC/ImageWrapper";
import MassPackModal from "./MassPackModal";

const PackGalleryItem = ({ packTemplate }) => {
	const [showModal, setShowModal] = useState(false);
	return (
		<>
			<div
				className='relative m-2 flex flex-col items-center rounded-md border border-gray-600 p-2 text-gray-800 transition-transform duration-200 hover:scale-105 hover:cursor-pointer hover:shadow-xl dark:text-gray-200'
				onClick={() => setShowModal(true)}
			>
				<div className='relative aspect-auto w-28 overflow-hidden'>
					<ImageWrapper
						className='h-full w-full object-cover'
						src={`${CDN}${packTemplate.image}` || ""}
						width={200}
						height={300}
						alt={packTemplate.name || "loading"}
					/>
				</div>
				<div className='mt-2 flex w-full flex-grow flex-col justify-between divide-y divide-gray-700/20 text-center dark:divide-gray-300/20'>
					<div className='font-semibold'>{packTemplate.name}</div>
					<div className='mt-auto'>
						<p className='flex justify-between'>
							<span>Packs:</span>
							<span>{packTemplate.packs.length}</span>
						</p>
					</div>
					<div className='flex justify-between'>
						<span>Floor:</span>
						<span>${packTemplate.floor}</span>
					</div>
					<div className='flex justify-between'>
						<span>Value:</span>
						<span>${(packTemplate.floor * packTemplate.packs.length).toFixed(2)}</span>
					</div>
				</div>
			</div>
			{showModal && (
				<div className='fixed z-50'>
					<MassPackModal packTemplate={packTemplate} showModal={showModal} setShowModal={setShowModal} />
				</div>
			)}
		</>
	);
};
export default PackGalleryItem;
