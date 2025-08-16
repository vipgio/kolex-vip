import { Listbox, Transition } from "@headlessui/react";

import { Fragment } from "react";

import { ChevronIcon } from "@/components/Icons";

const CollectionSelect = ({ selectedCol, setSelectedCol, selectedSeason, collections }) => {
	return (
		<Listbox
			value={selectedCol}
			onChange={(e) => setSelectedCol(e)}
			disabled={selectedSeason.length === 0}
		>
			<Listbox.Button className='input-outline relative my-1 h-10 w-full rounded-lg bg-white py-2 pl-4 pr-10 text-left shadow-md sm:text-sm'>
				<span className='block truncate'>
					{selectedCol.length === 0 ? "Collection" : selectedCol.split("_")[0]}
				</span>
				<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
					<ChevronIcon className='h-5 w-5 text-gray-400' />
				</span>
			</Listbox.Button>
			<Transition
				as={Fragment}
				enter='transition ease-out duration-75'
				enterFrom='transform opacity-0 scale-95'
				enterTo='transform opacity-100 scale-100'
				leave='transition ease-in duration-75'
				leaveFrom='transform opacity-100 scale-100'
				leaveTo='transform opacity-0 scale-95'
			>
				{selectedSeason.length > 0 && ( // If a season is selected, show the collections
					<Listbox.Options className='absolute left-0 top-12 z-30 inline-grid max-h-96 w-full gap-1 overflow-auto rounded-md bg-white p-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
						{collections
							.find(([season, _]) => season === selectedSeason)?.[1]
							.filter(([_, subsets]) => !subsets.info?.physical).length > 0 && ( // If there are digital collections, show the header
							<Listbox.Option
								className={({ active }) =>
									`relative select-none rounded bg-gray-300 py-2 px-4 text-center ${
										active ? "bg-primary-400 text-primary-400" : "text-gray-800"
									}`
								}
								disabled
							>
								Digitals
							</Listbox.Option>
						)}
						{collections
							.find(([season, _]) => season === selectedSeason)?.[1]
							.filter(([_, subsets]) => !subsets.info?.physical)
							.sort((a, b) => a[0].localeCompare(b[0])) // Sort the collections alphabetically
							.map(([col, _]) => (
								<Listbox.Option
									key={col}
									value={col}
									className={({ active }) =>
										`relative cursor-pointer select-none rounded p-2 text-center ${
											active ? "bg-primary-400" : "text-gray-800"
										}`
									}
								>
									<span className={`block text-ellipsis`}>{col.split("_")[0]}</span>
								</Listbox.Option>
							))}
						{collections
							.find(([season, _]) => season === selectedSeason)?.[1]
							.filter(([_, subsets]) => subsets.info?.physical).length > 0 && ( // If there are physical collections, show the header
							<Listbox.Option
								className={({ active }) =>
									`relative select-none rounded bg-gray-300 py-2 px-4 text-center ${
										active ? "bg-primary-400" : "text-gray-800"
									}`
								}
								disabled
							>
								Hybrids
							</Listbox.Option>
						)}
						{collections
							.find(([season, _]) => season === selectedSeason)?.[1]
							.filter(([_, subsets]) => subsets.info?.physical)
							.sort((a, b) => a[0].localeCompare(b[0])) // Sort the collections alphabetically
							.map(([col, _]) => (
								<Listbox.Option
									key={col}
									value={col}
									className={({ active }) =>
										`relative cursor-pointer select-none rounded py-2 px-4 text-center ${
											active ? "bg-primary-400" : "text-gray-800"
										}`
									}
								>
									<span className={`block text-ellipsis`}>{col.split("_")[0]}</span>
								</Listbox.Option>
							))}
					</Listbox.Options>
				)}
			</Transition>
		</Listbox>
	);
};
export default CollectionSelect;
