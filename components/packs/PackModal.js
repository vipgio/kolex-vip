import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import isEqual from "lodash/isEqual";
import ImageWrapper from "HOC/ImageWrapper";
import PackOdds from "./PackOdds";

const PackModal = React.memo(
	({ pack, isOpen, setIsOpen }) => {
		const [showOdds, setShowOdds] = useState(false);
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
										<div className='relative flex'>
											<div className='w-4/12 pt-1 sm:w-1/5'>
												<ImageWrapper
													src={`https://cdn.epics.gg${
														pack.images.filter((images) => images.name === "image")[0].url
													}`}
													width={200}
													height={200}
													alt={pack.name}
												/>
											</div>
											<div className='mx-2 w-8/12 space-y-1 text-gray-800 dark:text-gray-200 sm:w-4/5'>
												<div
													className='mb-2 text-lg font-bold'
													onClick={() => console.log(pack)}
												>
													{pack.name}
												</div>
												<div>{pack.description}</div>
												<div>
													Number of items in pack:{" "}
													<span className='font-semibold text-indigo-500'>
														{pack.entityCount}
													</span>
												</div>
												{pack.purchaseStart && (
													<div>
														Release date:{" "}
														<span className='font-semibold text-indigo-500'>
															{pack.purchaseStart.split("T")[0]}
														</span>
													</div>
												)}
												{pack.marketStart && (
													<div>
														Market start:{" "}
														<span className='font-semibold text-indigo-500'>
															{pack.marketStart}
														</span>
													</div>
												)}
												<div>
													Total Minted:{" "}
													<span className='font-semibold text-indigo-500'>
														{pack.mintCount}
													</span>
												</div>
												<div>
													Inventory Count:{" "}
													<span className='font-semibold text-indigo-500'>
														{pack.inventoryCount}
													</span>
												</div>
												<div>
													Total Opened:{" "}
													<span className='font-semibold text-indigo-500'>
														{pack.openedCount}
													</span>
												</div>
												<div>
													Packs Unopened:{" "}
													<span className='font-semibold text-orange-500'>
														{pack.mintCount - pack.openedCount}
													</span>
												</div>
												<div>
													Season:{" "}
													<span className='font-semibold text-indigo-500'>
														{pack.properties.seasons[0]}
													</span>
												</div>
												{pack.cost && (
													<div>
														Price:{" "}
														<span className='font-semibold text-indigo-500'>
															{Number(pack.cost).toLocaleString()}{" "}
															{pack.costType[0].toUpperCase() + pack.costType.slice(1)}
														</span>
													</div>
												)}
												<div>
													Pack ID:{" "}
													<span className='font-semibold text-indigo-500'>{pack.id}</span>
												</div>
												<div className='flex'>
													Link to marketplace:
													<a
														href={`https://kolex.gg/loadout/marketplace/pack/${pack.id}`}
														className='ml-1 flex items-center text-indigo-500 hover:underline'
														target='_blank'
														rel='noreferrer'
													>
														Here
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='h-4 w-4'
															fill='none'
															viewBox='0 0 24 24'
															stroke='currentColor'
															strokeWidth={1}
														>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
															/>
														</svg>
													</a>
												</div>
												<div className='flex'>
													Link to drop page:
													<a
														href={`https://kolex.gg/loadout/drop/${pack.id}`}
														className='ml-1 flex items-center text-indigo-500 hover:underline'
														target='_blank'
														rel='noreferrer'
													>
														Here
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='h-4 w-4'
															fill='none'
															viewBox='0 0 24 24'
															stroke='currentColor'
															strokeWidth={1}
														>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
															/>
														</svg>
													</a>
												</div>
												<button
													onClick={() => setShowOdds((prev) => !prev)}
													className='simple-button'
												>
													{showOdds ? "Hide odds" : "Show odds"}
												</button>
												{showOdds && <PackOdds odds={pack.treatmentsChance} />}
											</div>
										</div>
										<div className='mt-4 flex'>
											<button
												type='button'
												className='button ml-auto'
												onClick={closeModal}
											>
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
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
PackModal.displayName = "PackModal";
export default PackModal;
