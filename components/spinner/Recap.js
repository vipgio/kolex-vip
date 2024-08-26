import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import countBy from "lodash/countBy";
import fixDecimal from "utils/NumberUtils";
// import { spins } from "./spinsLocal";

const Recap = ({ spins, items, isOpen, setIsOpen }) => {
	const [showMints, setShowMints] = useState(false);
	const counted = Object.entries(countBy(spins, "id")).map(([id, count]) => {
		const mints = spins
			.filter((spinItems) => spinItems.id == id && spinItems.cards.length > 0)
			.map((item) => item.cards[0].mintNumber)
			.sort((a, b) => a - b);
		return (mints.length > 0 && [id, count, mints]) || [id, count];
	});
	const totalSpent =
		counted.reduce(
			(acc, cur) => acc + items.find((item) => item.id === Number(cur[0])).properties.silvercoins * cur[1],
			0
		) -
		spins.length * 1000;
	const shouldHaveSpent = fixDecimal(
		(
			(items.reduce((prev, curr) => prev + (Number(curr.chance) / 100) * curr.properties.silvercoins, 0) -
				1000) *
			spins.length
		).toFixed(0)
	);
	const diff = fixDecimal(-((totalSpent - shouldHaveSpent) / shouldHaveSpent) * 100).toFixed(2);

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
								<Dialog.Panel className='w-full max-w-lg transform overflow-hidden rounded-xl bg-gray-200 p-4 text-left align-middle shadow-xl transition-all dark:bg-gray-700'>
									<Dialog.Title
										as='h3'
										className='text-lg font-medium leading-6 text-gray-800 dark:text-gray-200'
									>
										Spins Recap: {spins.length} spins
									</Dialog.Title>

									<div className='my-1 max-h-[75vh] divide-y divide-gray-700/20 overflow-auto rounded border border-gray-700/20 p-1 text-gray-700 dark:divide-gray-300/20 dark:border-gray-300/20 dark:text-gray-300'>
										{counted
											.sort((a, b) => b[1] - a[1])
											.map(([id, count, mints]) => {
												const chanceDiff =
													(count / spins.length) * 100 - //my %
													items.find((item) => item.id === Number(id)).chance; //spinner odds
												return (
													<Fragment key={id}>
														<div>
															{items.find((item) => item.id === Number(id)).name}:{" "}
															<span className='font-semibold'>{count}</span> (
															<span className={`${chanceDiff >= 0 ? "text-green-400" : "text-red-400"}`}>
																{((count / spins.length) * 100).toFixed(2)}%
															</span>
															)
															{mints &&
																(showMints ? (
																	<div className='py-1 px-0.5 text-xs'>
																		{mints &&
																			mints.map((mint, i) => [
																				i > 0 && <span key={i}>, </span>,
																				<span key={mint + i}>{mint}</span>,
																			])}
																	</div>
																) : (
																	<span>{` (...)`}</span>
																))}
														</div>
													</Fragment>
												);
											})}
										<div>
											<div className='mt-2 font-semibold'>
												Silver: {totalSpent.toLocaleString()} Silvercoins
											</div>

											<div className='text-xs'>
												Silver you should have spent based on the odds:{" "}
												<span className='text-sm'>{shouldHaveSpent.toLocaleString()} </span>
												Silvercoins (
												<span className={`${diff >= 0 ? "text-green-400" : "text-red-400"}`}>
													{[diff > 0 && "+", diff.toLocaleString()]}%
												</span>
												)
											</div>
										</div>
									</div>
									<div className='mt-4 flex justify-between'>
										<button type='button' className='button' onClick={closeModal}>
											Close
										</button>
										<button type='button' className='button' onClick={() => setShowMints((prev) => !prev)}>
											{showMints ? "Hide" : "Show"} Mints
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
