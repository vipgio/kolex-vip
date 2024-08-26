import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import changelogData from "@/config/changelog.json";
import semver from "semver";

const Changelog = ({ showModal, setShowModal }) => {
	const router = useRouter();
	const { changelog } = changelogData;
	const [newChanges, setNewChanges] = useState(changelog);

	useEffect(() => {
		const localChange = localStorage.getItem("changelog");

		if (localChange) {
			if (typeof JSON.parse(localChange) === "object") {
				// Check if the local storage is an object (old format)
				if (newChanges.length && semver.compare(newChanges[0].version, JSON.parse(localChange).version) > 0) {
					// Compare the latest version from the changelog with the local storage (old format)
					setNewChanges(
						(prev) =>
							prev.filter((change) => semver.compare(change.version, JSON.parse(localChange).version) > 0) // Filter the changelog to only show the new changes
					);
					setShowModal(true);
					localStorage.setItem("changelog", JSON.stringify(newChanges[0].version)); // Set the local storage to the latest version from the changelog (new format)
				}
			} else {
				if (newChanges.length && semver.compare(newChanges[0].version, JSON.parse(localChange)) > 0) {
					// Compare the latest version from the changelog with the local storage (new format)
					setNewChanges((prev) =>
						prev.filter((change) => semver.compare(change.version, JSON.parse(localChange)) > 0)
					);
					setShowModal(true);
					localStorage.setItem("changelog", JSON.stringify(newChanges[0].version));
				}
			}
		} else {
			setNewChanges(changelog.sort((a, b) => semver.rcompare(a.version, b.version)).slice(0, 3)); // Show the last 3 changelogs
			setShowModal(true);
			localStorage.setItem(
				"changelog",
				JSON.stringify(changelog.sort((a, b) => semver.rcompare(a.version, b.version))[0].version)
			); // Set the local storage to the latest version from the changelog (new format)
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
									className='mb-4 text-lg font-medium leading-6 text-gray-800 dark:text-gray-200'
								>
									Changelog: {newChanges[0]?.date}
								</Dialog.Title>
								<Dialog.Panel>
									<div className='flex max-h-96 flex-col gap-4 divide-y divide-gray-500 overflow-auto rounded border border-gray-500 p-1 px-2'>
										{newChanges
											.sort((a, b) => semver.rcompare(a.version, b.version))
											.map((release) => (
												<div key={release.version} className=''>
													<span className='font-semibold text-gray-800 dark:text-gray-200'>
														{release.version}
													</span>

													<ul className='list-inside list-disc pl-3 marker:text-primary-500'>
														{release.changes.map((change) => (
															<li key={change} className='text-gray-800 dark:text-gray-200'>
																{change}
															</li>
														))}
													</ul>
												</div>
											))}
									</div>
									<div className='mt-6'>
										<button type='button' className='button' onClick={() => setShowModal(false)}>
											Close
										</button>
									</div>
								</Dialog.Panel>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};
export default Changelog;
