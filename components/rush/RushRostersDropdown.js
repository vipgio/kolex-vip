import { useContext } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { RushContext } from "@/context/RushContext";
import LoadingSpin from "../LoadingSpin";
import { ChevronIcon, CheckIcon } from "@/components/Icons";

const RushRostersDropdown = ({ items, loading }) => {
	const { selectedRoster, setSelectedRoster } = useContext(RushContext);
	const defaultName = "Select a roster";
	return (
		<div className='absolute top-0 z-20 w-72'>
			<Listbox value={selectedRoster?.name ? selectedRoster.name : defaultName} onChange={setSelectedRoster}>
				<div className='relative -top-2'>
					<Listbox.Label className='text-gray-custom'>Roster:</Listbox.Label>
					<Listbox.Button className='input-outline relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md sm:text-sm'>
						<span className='block truncate'>
							{selectedRoster?.name ? (
								<div className='flex'>
									<span className='w-2/4 truncate'>{selectedRoster.name}</span>
									<span className='w-1/4'>OVR: {selectedRoster.rating}</span>
									<span className='ml-2 w-1/4'>Level: {selectedRoster.level}</span>
								</div>
							) : (
								defaultName
							)}
						</span>
						<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
							<ChevronIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
						</span>
					</Listbox.Button>
					<Transition
						enter='transition duration-100 ease-out'
						enterFrom='transform scale-95 opacity-0'
						enterTo='transform scale-100 opacity-100'
						leave='transition duration-75 ease-out'
						leaveFrom='transform scale-100 opacity-100'
						leaveTo='transform scale-95 opacity-0'
					>
						<Listbox.Options className='absolute mt-1 max-h-72 w-full overflow-auto rounded-md bg-white p-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
							{!loading ? (
								items.map((item, personIdx) => (
									<Listbox.Option
										key={personIdx}
										className={({ active }) =>
											`relative cursor-pointer select-none rounded py-3 px-4 ${
												active ? "bg-primary-400" : "text-gray-800"
											}`
										}
										value={item}
									>
										{({ selected }) => (
											<>
												<span
													className={`flex w-full truncate ${
														selected === item ? "font-medium" : "font-normal"
													} ${item.unavailable ? "opacity-75" : ""}`}
												>
													<span className='w-2/4 truncate'>{item.name}</span>
													<span className='w-1/4'>OVR: {item.rating}</span>
													<span className='ml-2 w-1/4'>Level: {item.level}</span>
												</span>
												{selected === item ? (
													<span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800'>
														<CheckIcon className='h-5 w-5' aria-hidden='true' />
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))
							) : (
								<div className='flex w-full justify-center overflow-hidden'>
									<LoadingSpin />
								</div>
							)}
						</Listbox.Options>
					</Transition>
				</div>
			</Listbox>
		</div>
	);
};
export default RushRostersDropdown;
