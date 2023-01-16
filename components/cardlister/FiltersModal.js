import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const FiltersModal = ({ isOpen, setIsOpen, filters, setFilters, defaultFilters }) => {
	const closeModal = () => setIsOpen(false);

	return (
		<div className='fixed z-50'>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as='div' className='relative z-30' onClose={closeModal}>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-black/80' />
					</Transition.Child>

					<div className='fixed inset-0 overflow-y-auto'>
						<div className='flex min-h-full items-center justify-center p-4 text-center'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<Dialog.Panel className='w-full max-w-md transform overflow-auto rounded-xl bg-gray-200 p-4 text-left align-middle shadow-xl transition-all dark:bg-gray-700'>
									<Dialog.Title
										as='h3'
										className='mb-1 inline-flex w-full text-lg font-medium leading-6 text-gray-800 dark:text-gray-200'
									>
										<div>
											<span>Filters</span>
										</div>
									</Dialog.Title>
									<div className='border-y border-gray-500 p-2 text-gray-700 dark:text-gray-300'>
										<div className='mb-1'>
											<label htmlFor='minOwned'>Min Owned: </label>
											<input
												type='number'
												name='minOwned'
												id='minOwned'
												className='input-field'
												min={1}
												max={9999}
												value={filters.minOwned}
												onChange={(e) =>
													setFilters((prev) => ({
														...prev,
														minOwned: Number(e.target.value),
													}))
												}
											/>
										</div>
										<div className='my-2'>
											<label htmlFor='minFloor'>Min Floor: </label>
											<input
												type='number'
												name='minFloor'
												id='minFloor'
												className='input-field'
												min={0.1}
												max={20000}
												step={0.01}
												value={filters.minFloor}
												onChange={(e) =>
													setFilters((prev) => ({
														...prev,
														minFloor: Number(e.target.value),
													}))
												}
											/>
										</div>
										<div className='mb-1'>
											<label htmlFor='maxFloor'>Max Floor: </label>
											<input
												type='number'
												name='maxFloor'
												id='maxFloor'
												className='input-field'
												min={0.1}
												max={20000}
												step={0.01}
												value={filters.maxFloor}
												onChange={(e) =>
													setFilters((prev) => ({
														...prev,
														maxFloor: Number(e.target.value),
													}))
												}
											/>
										</div>
									</div>

									<div className='mt-4 inline-flex w-full'>
										<button
											type='button'
											className='button'
											onClick={() => setFilters(defaultFilters)}
										>
											Default
										</button>
										<button type='button' className='button ml-auto' onClick={closeModal}>
											Close
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
};
export default FiltersModal;
