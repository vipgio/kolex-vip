import React, { useState, useEffect } from "react";
import isEqual from "lodash/isEqual";
import uniqBy from "lodash/uniqBy";
import sortBy from "lodash/sortBy";
import Dialog from "@/HOC/Dialog";

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
				<Dialog
					title={
						<>
							{data.title} <span className='ml-2 text-xs'>x</span>
							<span className='ml-1 text-base'>{data.count}</span>
						</>
					}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					closeButton={false}
				>
					<div className='flex h-[23rem] grow border border-gray-400'>
						<div className='max-h-[23rem] w-1/3 divide-y divide-gray-400 overflow-auto border-r border-gray-400 p-1'>
							{sortBy(data.cards, ["mintBatch", "mintNumber"])
								.toReversed()
								.map((card) => (
									<div key={card.id} className='text-gray-custom flex w-full px-1'>
										<label
											htmlFor={card.id}
											className={`${card.signatureImage ? "text-yellow-400" : ""} hover:cursor-pointer`}
											title={card.signatureImage ? "Signed" : ""}
										>
											{card.mintBatch}
											{card.mintNumber}
										</label>
										<input
											type='checkbox'
											name='mint'
											className='ml-auto hover:cursor-pointer'
											id={card.id}
											checked={selectedCards.some((o) => o.id === card.id)}
											onChange={() => handleSelect(card)}
										/>
									</div>
								))}
						</div>
						<div className='text-gray-custom flex w-2/3 flex-col'>
							<div className='h-1/2 p-1'>
								A) Choose a mint range
								<div className='flex flex-col'>
									<div>
										<label htmlFor='batch'>Batch:</label>
										<select
											name='batch'
											id='batch'
											className='input-field mx-2 my-1 sm:mb-0'
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
											className='input-field my-1 ml-2 w-1/2'
											value={filters.max}
											onChange={(e) => setFilters((prev) => ({ ...prev, max: e.target.value }))}
										/>
									</div>
									<div>
										<label htmlFor='min'>Lowest mint:</label>
										<input
											type='number'
											name='min'
											id='min'
											className='input-field ml-2 w-1/2'
											value={filters.min}
											onChange={(e) => setFilters((prev) => ({ ...prev, min: e.target.value }))}
										/>
									</div>
								</div>
							</div>
							<div className='relative z-10 overflow-hidden text-center text-xl text-gray-900 before:absolute before:top-1/2 before:ml-[-44%] before:h-px before:w-5/12 before:bg-gray-400 before:text-right before:content-[""] after:absolute after:top-1/2 after:ml-[2%] after:h-px after:w-5/12 after:bg-gray-400 after:content-["\a0"] dark:text-gray-100'>
								OR
							</div>
							<div className='h-1/2 p-1'>
								B) Enter the Number of items; starting from the worst mint:
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
													.toReversed()
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
							<button type='button' className='button' onClick={closeModal}>
								Apply
							</button>
						</div>
					</div>
				</Dialog>
			</>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
MintSelectorModal.displayName = "MintSelectorModal";
export default MintSelectorModal;
