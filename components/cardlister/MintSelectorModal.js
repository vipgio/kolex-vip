import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import isEqual from "lodash/isEqual";
import uniqBy from "lodash/uniqBy";
import sortBy from "lodash/sortBy";

const MintSelectorModal = React.memo(
	({ data, isOpen, setIsOpen, selectedCards, setSelectedCards }) => {
		const defaultFilters = {
			batch: "",
			max: 1,
			min: 1,
		};
		const [filters, setFilters] = useState(defaultFilters);

		const availableBatches = uniqBy(data.cards, "mintBatch")
			.map((o) => o.mintBatch)
			.reverse();

		const closeModal = () => setIsOpen(false);

		const handleSelect = (card) => {
			if (selectedCards.some((o) => o.id === card.id)) {
				setSelectedCards(selectedCards.filter((item) => item.id !== card.id));
			} else {
				setSelectedCards([...selectedCards, { id: card.id, type: card.type }]);
			}
		};
		useEffect(() => {
			if (!isEqual(defaultFilters, filters)) {
				setSelectedCards(
					data.cards
						.filter(
							(card) =>
								card.mintBatch === filters.batch &&
								card.mintNumber >= filters.min &&
								card.mintNumber <= filters.max
						)
						.map((item) => ({ id: item.id, type: item.type }))
				);
			}
		}, [filters]);

		return (
			<>
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
							<div className='flex min-h-full w-full items-center justify-center p-4 text-center'>
								<Transition.Child
									as={Fragment}
									enter='ease-out duration-300'
									enterFrom='opacity-0 scale-95'
									enterTo='opacity-100 scale-100'
									leave='ease-in duration-200'
									leaveFrom='opacity-100 scale-100'
									leaveTo='opacity-0 scale-95'
								>
									<Dialog.Panel className='flex h-[30rem] w-full max-w-md transform flex-col overflow-hidden rounded-2xl bg-gray-700 p-4 text-left align-middle shadow-xl transition-all'>
										<Dialog.Title
											as='h3'
											className='mb-1 text-lg font-medium leading-6 text-orange-500'
											onClick={() => console.log(selectedCards)}
										>
											{data.title} <span className='text-xs'>x</span>
											<span className='text-base'>{data.count}</span>
										</Dialog.Title>
										<div className='flex grow border border-gray-400'>
											<div className='max-h-[23rem] w-1/3 divide-y overflow-auto border-r border-gray-400 p-1'>
												{sortBy(data.cards, ["mintBatch", "mintNumber"])
													.slice(0)
													.reverse()
													.map((card) => (
														<div key={card.id} className='flex w-24 text-gray-300'>
															<label
																htmlFor={card.id}
																className={`${
																	card.signatureImage ? "text-yellow-400" : ""
																}`}
																title={card.signatureImage ? "Signed" : ""}
															>
																{card.mintBatch}
																{card.mintNumber}
															</label>
															<input
																type='checkbox'
																name='mint'
																className='ml-auto'
																id={card.id}
																checked={selectedCards.some((o) => o.id === card.id)}
																onChange={() => handleSelect(card)}
															/>
														</div>
													))}
											</div>
											<div className='flex w-2/3 flex-col text-gray-300'>
												<div className='h-1/2 border-b border-gray-500 p-1'>
													A) Choose a mint range
													<div className='flex flex-col'>
														<div>
															<label htmlFor='batch'>Batch:</label>
															<select
																name='batch'
																id='batch'
																className='mx-2 my-1 rounded-md p-1 text-gray-900 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:mb-0'
																value={filters.batch}
																onChange={(e) =>
																	setFilters((prev) => ({
																		...prev,
																		batch: e.target.value,
																	}))
																}
															>
																<option value=''> </option>
																{availableBatches.map((batch) => (
																	<option value={batch} key={batch}>
																		{batch}
																	</option>
																))}
															</select>
														</div>
														<div>
															<label htmlFor='max'>Highest mint:</label>
															<input
																type='number'
																name='max'
																id='max'
																className='my-1 ml-2 w-1/2 rounded-md p-1 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500'
																value={filters.max}
																onChange={(e) =>
																	setFilters((prev) => ({ ...prev, max: e.target.value }))
																}
															/>
														</div>
														<div>
															<label htmlFor='min'>Lowest mint:</label>
															<input
																type='number'
																name='min'
																id='min'
																className='ml-2 w-1/2 rounded-md p-1 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500'
																value={filters.min}
																onChange={(e) =>
																	setFilters((prev) => ({ ...prev, min: e.target.value }))
																}
															/>
														</div>
													</div>
												</div>
												<div className='h-1/2 p-1'>
													B) Or enter the number of cards; starting from the worst mint:
													<div>
														<input
															type='number'
															name='count'
															id='count'
															className='input-field mt-1 w-24'
															min={0}
															max={data.count}
															value={selectedCards.length}
															onChange={(e) => {
																setFilters(defaultFilters);
																setSelectedCards(
																	data.cards
																		.slice()
																		.reverse()
																		.slice(0, e.target.value)
																		.map((card) => ({ id: card.id, type: card.type }))
																);
															}}
														/>
													</div>
												</div>
											</div>
										</div>
										<div className='mt-4 flex'>
											<div className='ml-1 rounded-md p-1 font-semibold text-orange-500'>
												Count: {selectedCards.length}
											</div>
											<div className='ml-auto'>
												<button
													type='button'
													className='inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-orange-500 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 active:bg-gray-300 active:shadow-lg'
													onClick={closeModal}
												>
													Apply
												</button>
											</div>
										</div>
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</Dialog>
				</Transition>
			</>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
MintSelectorModal.displayName = "MintSelectorModal";
export default MintSelectorModal;
