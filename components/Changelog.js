import React, { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import changelog from "@/config/changelog.json";

const Changelog = ({ showModal, setShowModal }) => {
	const router = useRouter();

	useEffect(() => {
		const localChange = localStorage.getItem("changelog");
		if (localChange) {
			if (JSON.parse(localChange).version !== changelog.version) {
				setShowModal(true);
				localStorage.setItem("changelog", JSON.stringify(changelog));
			}
		} else {
			setShowModal(true);
			localStorage.setItem("changelog", JSON.stringify(changelog));
		}
	}, [router.asPath]);

	return (
		<Transition appear show={showModal} as={Fragment}>
			<Dialog as='div' className='relative z-30' onClose={() => setShowModal(false)}>
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
									className='mb-6 text-lg font-medium leading-6 text-gray-800 dark:text-gray-200'
								>
									Changelog {changelog.date}
								</Dialog.Title>
								{changelog.changes.map((change, index) => (
									<div key={index} className='mt-2'>
										<ul className='list-inside list-disc marker:text-primary-500'>
											<li key={index} className='text-gray-800 dark:text-gray-200'>
												{change}
											</li>
										</ul>
									</div>
								))}

								<div className='mt-6'>
									<button type='button' className='button' onClick={() => setShowModal(false)}>
										Close
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};
export default Changelog;
