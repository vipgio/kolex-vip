import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
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
				<div
					className={`absolute inset-0 z-20 mx-8 flex flex-col overflow-hidden overscroll-none rounded-md bg-gray-200 dark:bg-gray-900 sm:mx-16 ${
						extraStyle ? extraStyle : "my-8"
					}`}
				>
					{/* <div className='absolute inset-0 z-20 my-8 mx-8 box-content flex flex-col overflow-hidden rounded-md bg-gray-100 dark:bg-gray-900 sm:mx-24'> */}
					<div className='relative flex h-12 w-full items-center border-b border-b-white/10 bg-gray-300 dark:bg-gray-800'>
						{stopButton}
						<h1 className='mx-auto py-2 text-3xl text-gray-800 dark:text-gray-200'>
							{loading ? <LoadingSpin /> : header}
						</h1>
						<button
							className='absolute right-0 top-0 h-12 w-12 p-1 text-gray-900 transition-colors duration-300 hover:cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300 active:bg-indigo-300 active:text-orange-400 dark:text-gray-200 dark:hover:bg-gray-700'
							onClick={close}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								strokeWidth={2}
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M6 18L18 6M6 6l12 12'
								/>
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

// 	<div className='fixed inset-0 z-30 flex flex-col items-center justify-center overscroll-none bg-black/90'>
// 	<div className='absolute inset-0 z-20 my-auto mx-8 flex h-fit max-h-[90vh] flex-col overflow-hidden overscroll-none rounded-md bg-gray-200 dark:bg-gray-900 sm:mx-16'>
// 		<div
// 			className='relative flex h-12 w-full items-center border-b border-b-white/10 bg-gray-300 dark:bg-gray-800'
// 		>
// 			<h1 className='mx-auto py-2 text-3xl text-gray-800 dark:text-gray-200'>
// 				{loading ? <LoadingSpin /> : header}
// 			</h1>
// 			<button
// 				className='absolute right-0 top-0 h-12 w-12 p-1 text-gray-900 transition-colors duration-300 hover:cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300 active:bg-indigo-300 active:text-orange-400 dark:text-gray-200 dark:hover:bg-gray-700'
// 				onClick={closingFunction ? closingFunction : () => setShowModal(false)}
// 			>
// 				<svg
// 					xmlns='http://www.w3.org/2000/svg'
// 					fill='none'
// 					viewBox='0 0 24 24'
// 					stroke='currentColor'
// 					strokeWidth={2}
// 				>
// 					<path
// 						strokeLinecap='round'
// 						strokeLinejoin='round'
// 						d='M6 18L18 6M6 6l12 12'
// 					/>
// 				</svg>
// 			</button>
// 		</div>
// 		{children}
// 	</div>
// 	{closeOnClick && (
// 		<div //fullscreen close button
// 			className='fixed z-10 h-screen w-screen'
// 			onClick={() => setShowModal(false)}
// 		></div>
// 	)}
// </div>
