import { useState } from "react";
import Image from "next/future/image";
import MassPackModal from "./MassPackModal";
import { useEffect } from "react";

const MassPackGrid = ({ packTemplate }) => {
	const [showModal, setShowModal] = useState(false);
	useEffect(() => {
		if (showModal) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [showModal]);
	return (
		<>
			<div
				className='m-2 mx-2 flex flex-col items-center rounded-md border border-gray-600 p-2 text-gray-800 transition-transform duration-200 hover:scale-105 hover:cursor-pointer hover:shadow-xl dark:text-gray-200'
				onClick={() => setShowModal(true)}
			>
				<div className='relative aspect-auto w-28 overflow-hidden'>
					<Image
						src={`https://cdn.epics.gg${packTemplate.image}` || ""}
						width={200}
						height={300}
						alt={packTemplate.name || "loading"}
						className='h-full w-full object-cover'
						priority='true'
						// unoptimized={true}
					/>
				</div>
				<div className='text-center font-semibold'>{packTemplate.name}</div>
				<div>
					<p>Packs: {packTemplate.packs.length}</p>
				</div>
			</div>
			{showModal && (
				<MassPackModal packTemplate={packTemplate} setShowModal={setShowModal} />
			)}
		</>
	);
};
export default MassPackGrid;
