import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import isEqual from "lodash/isEqual";
import LoadingSpin from "../LoadingSpin";

const CraftResultModal = React.memo(
	({ data, showResult, setShowResult, loading }) => {
		console.log(data);

		const closeModal = () => setShowResult(false);

		return (
			<>
				<Transition appear show={showResult} as={Fragment}>
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
											className='mb-1 text-lg font-medium leading-6 text-gray-800 dark:text-gray-200'
										>
											Craft result
										</Dialog.Title>
										{loading ? (
											<div className='mt-1 flex justify-center'>
												<LoadingSpin />
											</div>
										) : (
											data.map((card) => (
												<div
													className='flex text-gray-800 dark:text-gray-200'
													key={card.uuid}
												>
													<span className='w-8 text-orange-400'>
														{card.mintBatch}
														{card.mintNumber}
													</span>
													<span className='ml-5'>
														{card.title ? card.title : card.stickerTemplate.title}
													</span>
												</div>
											))
										)}

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
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
CraftResultModal.displayName = "CraftResultModal";
export default CraftResultModal;
