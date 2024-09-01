import FilteredBox from "@/components/packs/FilteredBox";

const PacksList = ({ packs }) => {
	return (
		<div className='my-2 flex w-[36rem] justify-center overflow-x-auto overflow-y-hidden rounded border border-gray-500'>
			{packs.map((pack) => (
				<div key={pack.id} className='w-1/2 flex-shrink-0 p-3'>
					<FilteredBox pack={pack} />
				</div>
			))}
		</div>
	);
};
export default PacksList;
