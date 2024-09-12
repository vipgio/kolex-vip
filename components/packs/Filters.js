import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiCheck, HiOutlineChevronUpDown } from "react-icons/hi2";
import uniqBy from "lodash/uniqBy";

const Filters = ({ filters, setFilters, packs }) => {
	const packSeasons = uniqBy(packs, (p) => p.properties.seasons[0])
		.map((pack) => pack.properties.seasons[0])
		.reverse();
	const costTypes = uniqBy(packs, "costType").map((pack) => pack.costType);

	return (
		<div className='flex w-full flex-col items-center justify-center p-1 sm:flex-row sm:items-end'>
			<div className='relative w-72'>
				<Listbox
					multiple
					value={filters.seasons}
					onChange={(e) => setFilters((prev) => ({ ...prev, seasons: e }))}
				>
					<Listbox.Label className='text-gray-custom mr-2'>Seasons:</Listbox.Label>
					<Listbox.Button className='relative h-10 w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
						<span className='block truncate'>
							{filters.seasons.length > 0 ? filters.seasons.join(", ") : "Select seasons"}
						</span>
						<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
							<HiOutlineChevronUpDown className='h-5 w-5 text-gray-400' />
						</span>
					</Listbox.Button>
					<Transition
						as={Fragment}
						leave='transition ease-in duration-100'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<Listbox.Options className='absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
							{packSeasons.map((season) => (
								<Listbox.Option
									key={season}
									value={season}
									className={({ active }) =>
										`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
											active ? "bg-amber-100 text-amber-900" : "text-gray-900"
										}`
									}
								>
									<span
										className={`block truncate ${
											filters.seasons.includes(season) ? "font-medium" : "font-normal"
										}`}
									>
										{season}
									</span>
									{filters.seasons.includes(season) ? (
										<span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
											<HiCheck className='h-5 w-5' />
										</span>
									) : null}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</Listbox>
			</div>
			<div className='relative mt-3 w-72 sm:mt-0 sm:ml-3'>
				<Listbox
					multiple
					value={filters.costTypes}
					onChange={(e) => setFilters((prev) => ({ ...prev, costTypes: e }))}
				>
					<Listbox.Label className='text-gray-custom mr-2'>Cost Types:</Listbox.Label>
					<Listbox.Button className='relative h-10 w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
						<span className='block truncate'>
							{filters.costTypes.length > 0
								? filters.costTypes
										.map((type) =>
											type === "usd" ? type.toUpperCase() : type[0].toUpperCase() + type.slice(1)
										)
										.join(", ")
								: "Any"}
						</span>
						<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
							<HiOutlineChevronUpDown className='h-5 w-5 text-gray-400' />
						</span>
					</Listbox.Button>
					<Transition
						as={Fragment}
						leave='transition ease-in duration-100'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
							{costTypes.map((type) => (
								<Listbox.Option
									key={type}
									value={type}
									className={({ active }) =>
										`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
											active ? "bg-amber-100 text-amber-900" : "text-gray-900"
										}`
									}
								>
									<span
										className={`block truncate ${
											filters.costTypes.includes(type) ? "font-medium" : "font-normal"
										}`}
									>
										{type === "usd" ? type.toUpperCase() : type[0].toUpperCase() + type.slice(1)}
									</span>
									{filters.costTypes.includes(type) ? (
										<span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
											<HiCheck className='h-5 w-5' />
										</span>
									) : null}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</Listbox>
			</div>
			<div className='mt-3 inline-flex items-end sm:ml-3 sm:mt-0'>
				<button onClick={() => setFilters((prev) => ({ ...prev, show: true }))} className='submit-button'>
					Show
				</button>
			</div>
		</div>
	);
};
export default Filters;
