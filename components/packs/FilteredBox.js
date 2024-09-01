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
				className='flex h-full cursor-pointer rounded border border-gray-500 pr-1 transition-all hover:scale-105'
				onClick={openModal}
			>
				<div className='m-1 flex h-24 w-1/3 items-center justify-center'>
					<ImageWrapper
						src={`${CDN}${pack.images.find((img) => img.name === "image").url}`}
						width={50}
						height={75}
						alt={pack.name}
					/>
				</div>
				<div className='text-gray-custom m-1 w-2/3'>
					<div className='text-lg font-semibold'>{pack.name}</div>
					<div>Season: {pack.properties.seasons[0]}</div>
					<div>
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
