import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import LoadingSpin from "./LoadingSpin";
import { CloseIcon } from "@/components/Icons";

const BigModal = ({
	header,
	showModal,
	setShowModal,
	loading,
	stopButton,
	closingFunction,
	children,
	closeOnClick = true,
	extraStyle,
	hasToast,
	toastLimit,
	escapeClose = true,
	counter,
}) => {
	const [leave, setLeave] = useState(showModal);

	const close = () => {
		setLeave(false);
		closingFunction && closingFunction();
		setTimeout(() => {
			setShowModal(false);
		}, 300);
	};

	useEffect(() => {
		if (leave) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [leave]);

	useEffect(() => {
		const listener = (e) => {
			if (e.key === "Escape" && escapeClose) {
				close();
			}
		};
		window.addEventListener("keydown", listener);
		return () => window.removeEventListener("keydown", listener);
	}, []);

	return (
		<Transition
			appear={true}
			show={leave}
			enter='transition-all duration-150'
			enterFrom='opacity-0 z-0'
			enterTo='opacity-100 z-40'
			leave='transition-all duration-150'
			leaveFrom='opacity-100 z-40'
			leaveTo='opacity-0 z-0'
		>
			<Dialog as='div' className='relative z-30' onClose={close}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-150'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-150'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-black/90' />
				</Transition.Child>
				<div className='fixed inset-0 overflow-y-auto'>
					<Transition.Child
						as={"div"}
						enter='ease-out duration-150'
						enterFrom='opacity-0 scale-95'
						enterTo='opacity-100 scale-100'
						leave='ease-in duration-150'
						leaveFrom='opacity-100 scale-100'
						leaveTo='opacity-0 scale-95'
					>
						{hasToast && (
							<ToastContainer
								position='top-right'
								autoClose={5000}
								hideProgressBar={false}
								newestOnTop
								closeOnClick
								rtl={false}
								pauseOnFocusLoss
								draggable
								pauseOnHover
								limit={toastLimit}
							/>
						)}
						<div
							className={`absolute inset-0 z-20 mx-8 flex max-h-[85%] flex-col overflow-hidden overscroll-none rounded-md bg-gray-200 dark:bg-gray-900 sm:mx-16 ${
								extraStyle ? extraStyle : "my-8"
							}`}
						>
							<div className='relative flex h-14 w-full items-center border-b border-b-white/10 bg-gray-300 dark:bg-gray-800'>
								{stopButton ? (
									<div className='my-outline mr-auto w-12'>{stopButton}</div>
								) : (
									<div className='mr-auto w-12'></div>
								)}
								<h1 className='mx-auto py-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200 xs:text-2xl sm:text-3xl'>
									{loading ? (
										<div className='inline-flex flex-col items-center'>
											<LoadingSpin />
										</div>
									) : (
										header
									)}
									{counter && counter}
								</h1>
								<button
									className='relative ml-auto h-12 w-12 p-1 text-gray-900 transition-colors duration-300 hover:cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-300 active:bg-primary-300 dark:text-gray-200 dark:hover:bg-gray-700'
									onClick={close}
								>
									<CloseIcon size={48} className='mx-auto my-auto h-full w-full' />
								</button>
							</div>
							{children}
						</div>
						{closeOnClick && (
							<div //fullscreen close button
								className='fixed z-10 h-screen w-screen'
								onClick={close}
							></div>
						)}
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
};
export default BigModal;
