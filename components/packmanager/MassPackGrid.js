import { useState } from "react";
import ImageWrapper from "HOC/ImageWrapper";
import MassPackModal from "./MassPackModal";

const MassPackGrid = ({ packTemplate }) => {
	const [showModal, setShowModal] = useState(false);
	return (
		<>
			<div
				className='m-2 mx-2 flex flex-col items-center rounded-md border border-gray-600 p-2 text-gray-800 transition-transform duration-200 hover:scale-105 hover:cursor-pointer hover:shadow-xl dark:text-gray-200'
				onClick={() => setShowModal(true)}
			>
				<div className='relative aspect-auto w-28 overflow-hidden'>
					<ImageWrapper
						className='h-full w-full object-cover'
						src={`https://cdn.kolex.gg${packTemplate.image}` || ""}
						width={200}
						height={300}
						alt={packTemplate.name || "loading"}
					/>
				</div>
				<div className='mt-auto text-center'>
					<div className='mt-1 font-semibold'>{packTemplate.name}</div>
					<div>
						<p>Packs: {packTemplate.packs.length}</p>
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
export default MassPackGrid;
