import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import countBy from "lodash/countBy";

const Recap = ({ spins, items, isOpen, setIsOpen }) => {
	const counted = Object.entries(countBy(spins, "id"));

	const closeModal = () => setIsOpen(false);

	const openModal = () => setIsOpen(true);

	return (
		<>
			<div className='absolute flex items-center justify-center'>
				<button
					type='button'
					onClick={openModal}
					className='flex h-5 w-5 items-center justify-center rounded-full text-sm font-medium text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:text-gray-100'
				>
					Recap
				</button>
			</div>

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
								<Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-xl bg-gray-200 p-4 text-left align-middle shadow-xl transition-all dark:bg-gray-700'>
									<Dialog.Title
										as='h3'
										className='text-lg font-medium leading-6 text-gray-800 dark:text-gray-200'
									>
										Spins Recap: {spins.length} spins
									</Dialog.Title>
									<div className='my-2 text-gray-700 dark:text-gray-300'>
										{counted
											.sort((a, b) => b[1] - a[1])
											.map(([id, count]) => {
												const chanceDiff =
													(count / spins.length) * 100 - //my %
													items.find((item) => item.id === Number(id)).chance; //spinner odds
												return (
													<Fragment key={id}>
														<div>
															{items.find((item) => item.id === Number(id)).name}:{" "}
															<span className='font-semibold'>{count}</span> (
															<span
																className={`${
																	chanceDiff >= 0 ? "text-green-400" : "text-red-400"
																}`}
															>
																{((count / spins.length) * 100).toFixed(2)}%
															</span>
															)
														</div>
													</Fragment>
												);
											})}
									</div>
									<div className='mt-4'>
										<button type='button' className='button' onClick={closeModal}>
											Close
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};
export default Recap;
