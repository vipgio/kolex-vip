import FilteredBox from "@/components/packs/FilteredBox";

const PacksList = ({ packs }) => {
	let listStyle
	if (packs.length === 1 || packs.length === 2){
		listStyle = 'justify-center my-2 flex w-[60vw] sm:w-[36rem] overflow-auto overflow-y-hidden rounded border border-gray-500'
	} else {
		listStyle = 'my-2 flex w-[60vw] sm:w-[36rem] overflow-auto overflow-y-hidden rounded border border-gray-500'
	}
	return (
		<div className={listStyle}>
			{packs.map((pack) => (
				<div key={pack.id} className='sm:w-1/3 w-1/2 flex-shrink-0 p-3 flex'>
					<FilteredBox pack={pack} />
				</div>
			))}
		</div>
	);
};
export default PacksList;
