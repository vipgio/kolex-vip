import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import DatePicker from "react-datepicker";
import { HiCheck, HiOutlineChevronUpDown } from "react-icons/hi2";
import { minPrice } from "@/config/config";
import LoadingSpin from "../LoadingSpin";
import "react-datepicker/dist/react-datepicker.css";
import Tooltip from "../Tooltip";

const Filters = ({ filters, setFilters, defaultFilters, loading, onSubmit }) => {
	const costTypes = ["usd", "silvercoins", "epicoins"];

	const onChange = (dates) => {
		const [start, end] = dates;
		setFilters((prev) => ({ ...prev, startDate: start }));
		setFilters((prev) => ({ ...prev, endDate: end }));
	};

	return (
		<>
			<form onSubmit={onSubmit} className='half-border pb-5'>
				<div className='mx-auto flex w-1/2 flex-col items-center p-1'>
					<div className='my-3 inline-flex flex-col justify-center lg:flex-row'>
						<div className='mx-auto mt-5 flex items-center lg:mx-3'>
							<Tooltip
								direction='left'
								text='This is your local time/date, results will be in UTC timezone, so expect a few hours of difference in results. Pick a day before/after your target to have all the results.'
							/>
							<DatePicker
								className='input-field inline-flex w-fit cursor-pointer items-center pr-5 text-sm'
								placeholderText='Date Range'
								dateFormat='yyyy/MM/dd'
								todayButton='Today'
								selected={filters.startDate}
								startDate={filters.startDate}
								endDate={filters.endDate}
								maxDate={new Date()}
								selectsRange
								showPopperArrow={false}
								onChange={onChange}
							/>
						</div>
						<div className='relative mt-3 w-48'>
							<Listbox
								value={filters.costType}
								onChange={(e) => setFilters((prev) => ({ ...prev, costType: e }))}
							>
								<Listbox.Button className='relative mt-1 h-10 w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
									<span className='block truncate'>
										{filters.costType.length > 0
											? filters.costType.length <= 4
												? filters.costType.toUpperCase()
												: filters.costType[0].toUpperCase() + filters.costType.slice(1)
											: "Select a cost type..."}
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
									<Listbox.Options className='absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
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
														filters.costType === type ? "font-medium" : "font-normal"
													}`}
												>
													{type.length <= 4
														? type.toUpperCase()
														: type[0].toUpperCase() + type.slice(1)}
												</span>
												{filters.costType === type ? (
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
					</div>

					{/* <div className='mt-3 flex items-center gap-x-2'>
							<label
								htmlFor='min'
								className='font-medium text-gray-700 dark:text-gray-300'
							>
								Price range from
							</label>
							<input
								type='number'
								name='min'
								id='min'
								className='input-field w-24'
								min={minPrice}
								step={0.01}
								max={filters.max}
								value={filters.min}
								onChange={(e) => setFilters((prev) => ({ ...prev, min: e.target.value }))}
								autoComplete='off'
								required
							/>
							<label
								htmlFor='max'
								className='font-medium text-gray-700 dark:text-gray-300'
							>
								to
							</label>
							<input
								type='number'
								name='max'
								id='max'
								className='input-field w-24'
								min={filters.min}
								step={0.01}
								max={1000000}
								value={filters.max}
								onChange={(e) => setFilters((prev) => ({ ...prev, max: e.target.value }))}
								autoComplete='off'
								required
							/>
						</div> */}
					{/* <div className='my-3 flex w-full flex-col justify-evenly px-5 text-gray-700 dark:text-gray-300 lg:flex-row'>
						<div className='flex items-center justify-center'>
							<label htmlFor='income' className='hover:cursor-pointer'>
								Hide the incomes
							</label>
							<input
								type='checkbox'
								name='income'
								id='income'
								className='ml-1 mt-1 hover:cursor-pointer'
								checked={filters.income}
								onChange={(e) =>
									setFilters((prev) => ({ ...prev, income: e.target.checked }))
								}
							/>
						</div>
						<div className='flex items-center justify-center'>
							<label htmlFor='expense' className='hover:cursor-pointer'>
								Hide the expenses
							</label>
							<input
								type='checkbox'
								name='expense'
								id='expense'
								className='ml-1 mt-1 hover:cursor-pointer'
								checked={filters.expense}
								onChange={(e) =>
									setFilters((prev) => ({ ...prev, expense: e.target.checked }))
								}
							/>
						</div>
					</div> */}

					<button
						className='submit-button'
						type='submit'
						disabled={!filters.costType || !filters.startDate || loading}
					>
						{loading ? <LoadingSpin /> : "Start"}
					</button>
				</div>
			</form>

			{/* <div>
				<button onClick={() => console.log(filters)}>filters</button>
			</div> */}

			{/* <div>
				<button onClick={() => setFilters(defaultFilters)}>RESET</button>
			</div> */}
		</>
	);
};
export default Filters;
