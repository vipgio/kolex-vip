import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import LoadingSpin from "@/components/LoadingSpin";
import { ChevronIcon } from "@/components/Icons";

const SeasonSelect = ({ selectedSeason, setSelectedSeason, collections, loading }) => {
	return (
		<Listbox value={selectedSeason} onChange={(e) => setSelectedSeason(e)} disabled={collections.length === 0}>
			<Listbox.Button className='input-outline relative my-1 h-10 w-full cursor-pointer rounded-lg bg-white py-2 pl-4 pr-10 text-left shadow-md sm:text-sm'>
				<span className='block truncate'>
					{loading ? <LoadingSpin size={4} /> : selectedSeason.length === 0 ? "Season" : selectedSeason}
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
				<Listbox.Options className='absolute top-12 left-0 z-30 inline-grid w-full gap-1 rounded-md bg-white p-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
					{collections.map(
						(
							[season, _] // Show all seasons
						) => (
							<Listbox.Option
								key={season}
								value={season}
								className={({ active }) =>
									`relative cursor-pointer select-none rounded py-2 px-4 text-center ${
										active ? "bg-primary-400" : "text-gray-800"
									}`
								}
							>
								<span className={`block truncate`}>{season}</span>
							</Listbox.Option>
						)
					)}
				</Listbox.Options>
			</Transition>
		</Listbox>
	);
};
export default SeasonSelect;
