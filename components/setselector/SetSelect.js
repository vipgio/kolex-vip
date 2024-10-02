import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronIcon } from "@/components/Icons";

const SetSelect = ({ selectedCol, selectedSet, selectedSeason, collections, setSelectedSet }) => {
	return (
		<Listbox value={selectedSet} onChange={(e) => setSelectedSet(e)} disabled={selectedCol.length === 0}>
			<Listbox.Button className='input-outline relative my-1 h-10 w-full rounded-lg bg-white py-2 pl-4 pr-10 text-left shadow-md sm:text-sm'>
				<span className='block truncate'>{selectedSet.length === 0 ? "Set" : selectedSet.name}</span>
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
				{selectedCol.length > 0 && ( // If a collection is selected, show the sets
					<Listbox.Options className='absolute top-12 left-0 z-30 inline-grid max-h-96 w-full gap-1 overflow-auto rounded-md bg-white p-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
						{collections
							.find(([season, _]) => season === selectedSeason)?.[1]
							.find(([col, _]) => col === selectedCol)?.[1]
							.collections.sort((a, b) => a.collection?.name.localeCompare(b.collection?.name))
							.map((set) =>
								set.collection ? (
									<Listbox.Option
										key={set.collection.id}
										value={set.collection}
										className={({ active }) =>
											`relative cursor-pointer select-none rounded p-2 text-center ${
												active ? "bg-primary-400" : "text-gray-800"
											}`
										}
									>
										<span className={`block text-ellipsis`}>{set.collection.name}</span>
									</Listbox.Option>
								) : (
									<Fragment key={set.tier}>
										<Listbox.Option
											key={set.tier}
											value={set.tier}
											className={({ active }) =>
												`relative select-none rounded bg-gray-300 py-2 px-4 text-center ${
													active ? "bg-primary-400" : "text-gray-800"
												}`
											}
											disabled
										>
											<span className={`block text-ellipsis`}>{set.tier}</span>
										</Listbox.Option>
										{set.collections
											.sort((a, b) => a.collection?.name.localeCompare(b.collection?.name))
											.map((subSet) => (
												<Listbox.Option
													key={subSet.collection.id}
													value={subSet.collection}
													className={({ active }) =>
														`relative cursor-pointer select-none rounded py-2 px-4 text-center ${
															active ? "bg-primary-400" : "text-gray-800"
														}`
													}
												>
													<span className={`block text-ellipsis`}>{subSet.collection.name}</span>
												</Listbox.Option>
											))}
									</Fragment>
								)
							)}
					</Listbox.Options>
				)}
			</Transition>
		</Listbox>
	);
};
export default SetSelect;
