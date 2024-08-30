import React, { Fragment } from "react";
import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
const Dialog = ({ title, children, isOpen, setIsOpen, closeFunction = null, closeButton = false }) => {
	const closeModal = () => setIsOpen(false);
	return (
		<Transition appear show={isOpen} as={Fragment}>
			<HeadlessDialog as='div' className='relative z-30' onClose={closeFunction ? closeFunction : closeModal}>
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
							<HeadlessDialog.Panel className='w-full max-w-lg transform overflow-hidden rounded-xl bg-gray-200 p-4 text-left align-middle shadow-xl transition-all dark:bg-gray-700'>
								<HeadlessDialog.Title
									as='h3'
									className='inline-flex w-full text-lg font-medium leading-6 text-gray-800 dark:text-gray-200'
								>
									{title}
								</HeadlessDialog.Title>
								<HeadlessDialog.Panel className='mt-2 text-gray-700 dark:text-gray-300'>
									{children}
									{closeButton && (
										<div className='mt-5 flex w-full'>
											<button type='button' className='button ml-auto' onClick={closeModal}>
												Close
											</button>
										</div>
									)}
								</HeadlessDialog.Panel>
							</HeadlessDialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</HeadlessDialog>
		</Transition>
	);
};
export default Dialog;
