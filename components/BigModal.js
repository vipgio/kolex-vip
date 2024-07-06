import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import LoadingSpin from "./LoadingSpin";

const BigModal = ({
	header,
	showModal,
	setShowModal,
	loading,
	stopButton,
	closingFunction,
	children,
	closeOnClick,
	extraStyle,
	hasToast,
	toastLimit,
	escapeClose = true,
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
			leave='transition-all duration-300'
			leaveFrom='opacity-100 z-40'
			leaveTo='opacity-0 z-0'
		>
			<div className='fixed inset-0 z-30 flex flex-col items-center justify-center overscroll-none bg-black/90'>
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
					<div className='relative flex h-12 w-full items-center border-b border-b-white/10 bg-gray-300 dark:bg-gray-800'>
						{stopButton ? (
							<div className='mr-auto w-12'>{stopButton}</div>
						) : (
							<div className='mr-auto w-12'></div>
						)}
						<h1 className='mx-auto py-2 text-lg font-semibold text-gray-800 dark:text-gray-200 xs:text-2xl sm:text-3xl'>
							{loading ? <LoadingSpin /> : header}
						</h1>
						<button
							className='ml-auto h-12 w-12 p-1 text-gray-900 transition-colors duration-300 hover:cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-300 active:bg-primary-300 active:text-orange-400 dark:text-gray-200 dark:hover:bg-gray-700'
							onClick={close}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								strokeWidth={2}
							>
								<path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
							</svg>
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
			</div>
		</Transition>
	);
};
export default BigModal;
