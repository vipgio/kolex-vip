import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiOutlineChevronUpDown } from "react-icons/hi2";
const CollectionSelect = ({ selectedCol, setSelectedCol, selectedSeason, collections }) => {
	return (
		<Listbox value={selectedCol} onChange={(e) => setSelectedCol(e)} disabled={selectedSeason.length === 0}>
			<Listbox.Button className='relative my-1 h-10 w-full cursor-pointer rounded-lg bg-white py-2 pl-4 pr-10 text-left shadow-md focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 disabled:cursor-not-allowed sm:text-sm'>
				<span className='block truncate'>{selectedCol.length === 0 ? "Collection" : selectedCol}</span>
				<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
					<HiOutlineChevronUpDown className='h-5 w-5 text-gray-400' />
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
					<Listbox.Options className='absolute top-full left-1/3 z-30 max-h-96 w-1/3 divide-y overflow-auto rounded-md bg-white py-0 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
						{collections
							.find(([season, _]) => season === selectedSeason)?.[1]
							.filter(([_, subsets]) => !subsets.info?.physical).length > 0 && ( // If there are digital collections, show the header
							<Listbox.Option
								className={({ active }) =>
									`relative select-none border-t border-gray-700 bg-gray-300 py-2 px-4 text-center text-xs ${
										active ? "bg-amber-100 text-amber-900" : "text-gray-900"
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
										`relative cursor-pointer select-none py-2 px-4 text-center ${
											active ? "bg-amber-100 text-amber-900" : "text-gray-900"
										}`
									}
								>
									<span className={`block truncate`}>{col}</span>
								</Listbox.Option>
							))}
						{collections
							.find(([season, _]) => season === selectedSeason)?.[1]
							.filter(([_, subsets]) => subsets.info?.physical).length > 0 && ( // If there are physical collections, show the header
							<Listbox.Option
								className={({ active }) =>
									`relative select-none border-t border-gray-700 bg-gray-300 py-2 px-4 text-center text-xs ${
										active ? "bg-amber-100 text-amber-900" : "text-gray-900"
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
										`relative cursor-pointer select-none py-2 px-4 text-center ${
											active ? "bg-amber-100 text-amber-900" : "text-gray-900"
										}`
									}
								>
									<span className={`block text-ellipsis`}>{col}</span>
								</Listbox.Option>
							))}
					</Listbox.Options>
				)}
			</Transition>
		</Listbox>
	);
};
export default CollectionSelect;
