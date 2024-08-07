import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiOutlineChevronUpDown } from "react-icons/hi2";

const NewSubSelector = ({ collections, setSelectedCollection }) => {
	const [selectedSeason, setSelectedSeason] = useState("");
	const [selectedCol, setSelectedCol] = useState("");
	const [selectedSet, setSelectedSet] = useState("");

	useEffect(() => {
		setSelectedCol("");
		setSelectedSet("");
	}, [selectedSeason]);

	useEffect(() => {
		if (selectedSet.id) {
			const seasonArray = collections.find(([season, _]) => season === selectedSeason);
			const collectionArray = seasonArray?.[1].find(([col, _]) => col === selectedCol);

			if (collectionArray[1][0].collection) {
				const targetSet = collectionArray?.[1].find((set) => set.collection.id === selectedSet.id);
				setSelectedCollection(targetSet);
			} else {
				const targetSet = collectionArray?.[1]
					.map(([tier, set]) => set)
					.flat()
					.find((subSet) => subSet.collection.id === selectedSet.id);
				setSelectedCollection(targetSet);
			}
		}
	}, [selectedSet]);

	return (
		<>
			<div className='relative ml-2 mb-1 grid w-[36rem] grid-cols-3 gap-2 divide-x'>
				<Listbox
					value={selectedSeason}
					onChange={(e) => setSelectedSeason(e)}
					disabled={collections.length === 0}
				>
					<Listbox.Button className='relative my-1 h-10 w-full cursor-pointer rounded-lg bg-white py-2 pl-4 pr-10 text-left shadow-md focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 disabled:cursor-not-allowed sm:text-sm'>
						<span className='block truncate'>{selectedSeason.length === 0 ? "Season" : selectedSeason}</span>
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
						<Listbox.Options className='absolute top-full z-30 w-1/3 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
							{collections.map(([season, _]) => (
								<Listbox.Option
									key={season}
									value={season}
									className={({ active }) =>
										`relative cursor-pointer select-none py-2 px-4 text-center ${
											active ? "bg-amber-100 text-amber-900" : "text-gray-900"
										}`
									}
								>
									<span className={`block truncate`}>{season}</span>
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</Listbox>

				<Listbox
					value={selectedCol}
					onChange={(e) => setSelectedCol(e)}
					disabled={selectedSeason.length === 0}
				>
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
						{selectedSeason.length > 0 && (
							<Listbox.Options className='absolute top-full left-1/3 z-30 max-h-96 w-1/3 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
								{collections
									.find(([season, _]) => season === selectedSeason)?.[1]
									.sort((a, b) => a[0].localeCompare(b[0]))
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
							</Listbox.Options>
						)}
					</Transition>
				</Listbox>

				<Listbox value={selectedSet} onChange={(e) => setSelectedSet(e)} disabled={selectedCol.length === 0}>
					<Listbox.Button className='relative my-1 h-10 w-full cursor-pointer rounded-lg bg-white py-2 pl-4 pr-10 text-left shadow-md focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 disabled:cursor-not-allowed sm:text-sm'>
						<span className='block truncate'>{selectedSet.length === 0 ? "Set" : selectedSet.name}</span>
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
						{selectedCol.length > 0 && (
							<Listbox.Options className='absolute top-full left-2/3 z-30 max-h-96 w-1/3 overflow-auto rounded-md bg-white pb-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
								{selectedCol.length > 0 &&
									selectedSeason.length > 0 &&
									collections
										.find(([season, _]) => season === selectedSeason)?.[1]
										.find(([col, _]) => col === selectedCol)?.[1]
										.map((set) =>
											set.collection ? (
												<Listbox.Option
													key={set.collection.id}
													value={set.collection}
													className={({ active }) =>
														`relative cursor-pointer select-none py-2 px-4 text-center ${
															active ? "bg-amber-100 text-amber-900" : "text-gray-900"
														}`
													}
												>
													<span className={`block truncate`}>{set.collection.name}</span>
												</Listbox.Option>
											) : (
												<>
													<Listbox.Option
														key={set[0]}
														value={set[0]}
														className={({ active }) =>
															`relative select-none border-t border-gray-700 bg-gray-300 py-2 px-4 text-center text-xs ${
																active ? "bg-amber-100 text-amber-900" : "text-gray-900"
															}`
														}
														disabled
													>
														<span className={`block truncate`}>{set[0]}</span>
													</Listbox.Option>
													{set[1].map((subSet) => (
														<Listbox.Option
															key={subSet.collection.id}
															value={subSet.collection}
															className={({ active }) =>
																`relative cursor-pointer select-none py-2 px-4 text-center ${
																	active ? "bg-amber-100 text-amber-900" : "text-gray-900"
																}`
															}
														>
															<span className={`block truncate`}>{subSet.collection.name}</span>
														</Listbox.Option>
													))}
												</>
											)
										)}
							</Listbox.Options>
						)}
					</Transition>
				</Listbox>
			</div>
		</>
	);
};

export default NewSubSelector;
