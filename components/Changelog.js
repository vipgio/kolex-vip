import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import semver from "semver";
import changelogData from "@/config/changelog.json";
import Dialog from "@/HOC/Dialog";

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
			setNewChanges(changelog.sort((a, b) => semver.rcompare(a.version, b.version))); // Show the last 3 changelogs
			setShowModal(true);
			localStorage.setItem(
				"changelog",
				JSON.stringify(changelog.sort((a, b) => semver.rcompare(a.version, b.version))[0].version)
			); // Set the local storage to the latest version from the changelog (new format)
		}
	}, [router.asPath]);

	return (
		<Dialog
			isOpen={showModal}
			setIsOpen={setShowModal}
			title={`Changelog: ${newChanges[0]?.date}`}
			closeButton={true}
		>
			<div className='flex max-h-96 flex-col gap-4 divide-y divide-gray-500 overflow-auto rounded border border-gray-500 p-1 px-2'>
				{newChanges
					.sort((a, b) => semver.rcompare(a.version, b.version))
					.map((release) => (
						<div key={release.version} className=''>
							<span className='font-semibold text-gray-800 dark:text-gray-200'>{release.version}</span>

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
		</Dialog>
	);
};
export default Changelog;
