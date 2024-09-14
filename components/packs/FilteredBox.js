import { useState } from "react";
import { CDN } from "@/config/config";
import ImageWrapper from "@/HOC/ImageWrapper";
import PackModal from "./PackModal";

const FilteredBox = ({ pack }) => {
	const [showModal, setShowModal] = useState(false);

	const openModal = (e) => {
		e.stopPropagation();
		setShowModal(true);
	};

	return (
		<>
			<div
				className='flex h-full w-full cursor-pointer flex-col items-center rounded border border-primary-500 transition-all hover:scale-105 sm:flex-row sm:pr-1'
				onClick={openModal}
			>
				<div className='m-1 flex w-1/3 items-center justify-center sm:h-24'>
					<ImageWrapper
						src={`${CDN}${pack.images.find((img) => img.name === "image").url}`}
						width={75}
						height={100}
						alt={pack.name}
					/>
				</div>
				<div className='text-gray-custom m-1 flex w-full flex-col gap-2 sm:w-2/3'>
					<div className='text-lg font-semibold'>{pack.name}</div>
					<div className='hidden sm:block'>Season: {pack.properties.seasons[0]}</div>
					<div className='hidden sm:block'>
						{" "}
						Cost: {Number(pack.cost).toLocaleString()}{" "}
						{pack.costType === "usd"
							? pack.costType.toUpperCase()
							: pack.costType[0].toUpperCase() + pack.costType.slice(1)}
					</div>
				</div>
				{showModal ? <PackModal pack={pack} isOpen={showModal} setIsOpen={setShowModal} /> : null}
			</div>
		</>
	);
};
export default FilteredBox;
