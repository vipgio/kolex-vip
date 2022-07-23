import Image from "next/future/image";
const MassPackGrid = ({ pack }) => {
	return (
		<div className='m-2 mx-2 flex flex-col items-center rounded-md border border-gray-600 p-2 transition-transform duration-200 hover:scale-110 hover:cursor-pointer hover:shadow-xl'>
			<div className='relative aspect-auto w-28 overflow-hidden'>
				<Image
					src={`https://cdn.epics.gg${pack.image}` || ""}
					layout='fill'
					quality={100}
					alt={pack.name || "loading"}
					className='h-full w-full object-cover'
				/>
			</div>
			<div className='text-center font-semibold'>{pack.name}</div>
			<div className=''>
				<p>Packs: {pack.packs.length}</p>
			</div>
		</div>
	);
};
export default MassPackGrid;
