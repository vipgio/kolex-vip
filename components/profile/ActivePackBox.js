import { CDN } from "@/config/config";
import ImageWrapper from "@/HOC/ImageWrapper";
import { useState } from "react";
import PackModal from "../packs/PackModal";
const ActivePackBox = ({ pack }) => {
	const [showPackInfo, setShowPackInfo] = useState(false);
	const openModal = () => {
		setShowPackInfo(true);
	};

	return (
		<>
			<button className='gallery-item flex w-full border border-gray-500 p-1' onClick={openModal}>
				<div className='mr-1 flex h-24 w-1/4 items-center justify-center'>
					<ImageWrapper
						src={`${CDN}${pack.images.url}` || ""}
						width={50}
						height={75}
						alt={pack.name}
						className='h-full w-auto object-contain'
					/>
				</div>
				<div className='flex w-3/4 flex-col justify-center text-left sm:mt-2 sm:justify-start'>
					<div>{pack.name}</div>
					<div>
						<span className='text-primary-500'>{pack.inventoryCount.toLocaleString()}</span> Packs left
					</div>
				</div>
			</button>
			<PackModal pack={pack} isOpen={showPackInfo} setIsOpen={setShowPackInfo} />
		</>
	);
};
export default ActivePackBox;
