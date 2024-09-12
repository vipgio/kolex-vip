import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiOutlineChevronUpDown } from "react-icons/hi2";
import LoadingSpin from "@/components/LoadingSpin";
const SeasonSelect = ({ selectedSeason, setSelectedSeason, collections, loading }) => {
	return (
		<Listbox value={selectedSeason} onChange={(e) => setSelectedSeason(e)} disabled={collections.length === 0}>
			<Listbox.Button className='relative my-1 h-10 w-full cursor-pointer rounded-lg bg-white py-2 pl-4 pr-10 text-left shadow-md focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 disabled:cursor-not-allowed sm:text-sm'>
				<span className='block truncate'>
					{loading ? <LoadingSpin size={4} /> : selectedSeason.length === 0 ? "Season" : selectedSeason}
				</span>
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
				<Listbox.Options className='absolute top-full z-30 w-[60vw] rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:w-1/3 sm:text-sm'>
					{collections.map(
						(
							[season, _] // Show all seasons
						) => (
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
						)
					)}
				</Listbox.Options>
			</Transition>
		</Listbox>
	);
};
export default SeasonSelect;
