import FilteredBox from "@/components/packs/FilteredBox";

const PacksList = ({ packs }) => {
	return (
		<div
			className={`my-2 mx-5 flex w-full gap-2 overflow-auto overflow-y-hidden rounded border border-primary-500 sm:w-[36rem] ${
				packs.length === 1 || packs.length === 2 ? "justify-center" : ""
			}`}
		>
			{packs.map((pack) => (
				<div key={pack.id} className='flex w-1/2 flex-shrink-0 p-2 sm:w-1/3 sm:p-3'>
					<FilteredBox pack={pack} />
				</div>
			))}
		</div>
	);
};
export default PacksList;
