import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import { useAxios } from "hooks/useAxios";
import LoadingSpin from "../LoadingSpin";

const SendModal = ({ isOpen, setIsOpen, selectedUser, user, loading, setLoading }) => {
	const { fetchData } = useAxios();
	const [trades, setTrades] = useState([]);
	let isApiSubscribed = true;

	const closeModal = () => setIsOpen(false);

	const stuff = () => {
		toast.error("error");
	};
	const getUserSummary = async () => {
		const { result } = await fetchData(`/api/trade?page=1`);
	};
	// useEffect(() => {
	// 	getAllTrades();
	// 	return () => (isApiSubscribed = false);
	// }, []);

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
								<Dialog.Panel className='w-full max-w-sm transform overflow-hidden rounded-xl bg-gray-200 p-4 text-left align-middle shadow-xl transition-all dark:bg-gray-700'>
									<Dialog.Title
										as='h3'
										className='mb-2 text-lg font-medium leading-6 text-gray-800 dark:text-gray-200'
									>
										Trades to {selectedUser.username}
									</Dialog.Title>

									{loading ? (
										<LoadingSpin />
									) : (
										<span className='text-gray-700 dark:text-gray-300'>
											This will send
											<span className='text-orange-500'> {trades.length} </span>
											trades to
											{selectedUser.username}
										</span>
									)}
									<div className='mt-4 flex'>
										<button
											type='button'
											className='button'
											onClick={closeModal}
											disabled={loading}
										>
											Close
										</button>
										<button
											type='button'
											className='button ml-auto'
											onClick={stuff}
											disabled={loading}
										>
											Send All
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
export default SendModal;
