import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaHistory } from "react-icons/fa";
import { useAxios } from "hooks/useAxios";

const ReceiveModal = ({ isOpen, setIsOpen, selectedUser }) => {
	const { fetchData } = useAxios();

	const closeModal = () => setIsOpen(false);
	const openModal = () => setIsOpen(true);

	const getTrades = async () => {
		const { result } = await fetchData(`/api/trade?page=${1}`);
		console.log(result);
	};

	useEffect(() => {
		getTrades();
	}, []);

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
									>
										trades from x
									</Dialog.Title>

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
export default ReceiveModal;
