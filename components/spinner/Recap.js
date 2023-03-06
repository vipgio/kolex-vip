import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import countBy from "lodash/countBy";

const Recap = ({ spins, items, isOpen, setIsOpen }) => {
	const counted = Object.entries(countBy(spins, "id"));
	const totalSpent =
		counted.reduce(
			(acc, cur) =>
				acc +
				items.find((item) => item.id === Number(cur[0])).properties.silvercoins * cur[1],
			0
		) -
		spins.length * 1000;

	const closeModal = () => setIsOpen(false);

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
										onClick={() => console.log(spins, items)}
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
										<div className='mt-3 font-semibold'>
											Silver: {totalSpent} Silvercoins
										</div>
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
