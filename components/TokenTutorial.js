import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";

const TokenTutorial = ({ showModal, setShowModal }) => {
	const handleCopyClick = async () => {
		try {
			await navigator.clipboard.writeText(
				`const sessionData = localStorage.getItem("session");const parsedData = JSON.parse(sessionData);const { ["braze"]: _, ...rest } = parsedData;console.log(rest);`
			);
			toast.success(`Code copied!`, {
				toastId: "copy",
				autoClose: 2000,
				hideProgressBar: false,
			});
		} catch (err) {
			console.log(err);
			toast.error(`Failed to copy the code :(`, { toastId: "failed" });
			toast.error(err.response.data.error, {
				toastId: err.response.data.errorCode,
			});
		}
	};
	return (
		<Transition
			show={showModal}
			enter='transition-opacity duration-75'
			enterFrom='opacity-0'
			enterTo='opacity-100'
			leave='transition-opacity duration-150'
			leaveFrom='opacity-100'
			leaveTo='opacity-0'
			as={Fragment}
		>
			<Dialog open={showModal} onClose={() => setShowModal(false)}>
				<div className='fixed inset-0 bg-black/80' aria-hidden='true' />

				{/* Full-screen container to center the panel */}
				<div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
					{/* The actual dialog panel  */}
					<Dialog.Panel className='mx-auto rounded bg-white p-3'>
						<ol className='list-inside list-decimal'>
							<li>Login to your Kolex account from the official website</li>
							<li>
								Open Developer Console (usually F12 key) and navigate to the Console tab.
							</li>
							<li>
								Paste{" "}
								<span className='cursor-pointer underline' onClick={handleCopyClick}>
									this
								</span>{" "}
								code in the console and hit enter.
							</li>
							<li>Right click on the output and hit &quot;Copy object&quot;.</li>
							<li>Paste the text in the field below.</li>
						</ol>
						<p className='mt-4'>
							<span className='font-bold text-red-400 underline'>NEVER</span> paste
							anything in the console if you don&apos;t know or trust the person sending
							you the code or what the code does.
						</p>
						<p className='mt-2 text-sm'>
							It&apos;s not possible to use a phone to use the site until Kolex fixes it.
						</p>
					</Dialog.Panel>
				</div>
			</Dialog>
		</Transition>
	);
};
export default TokenTutorial;
