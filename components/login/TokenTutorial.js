import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ImageWrapper from "@/HOC/ImageWrapper";
import { LinkIcon } from "@/components/Icons";
import { extensionChrome, extensionFirefox } from "@/config/config";

const TokenTutorial = ({ showModal, setShowModal, handleCopyClick }) => {
	const closeModal = () => setShowModal((prev) => ({ ...prev, show: false }));
	return (
		<Transition
			show={showModal.show}
			enter='transition-opacity duration-75'
			enterFrom='opacity-0'
			enterTo='opacity-100'
			leave='transition-opacity duration-150'
			leaveFrom='opacity-100'
			leaveTo='opacity-0'
			as={Fragment}
		>
			<Dialog open={showModal.show} onClose={closeModal}>
				<div className='fixed inset-0 bg-black/80' aria-hidden='true' />

				{/* Full-screen container to center the panel */}
				<div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
					{/* The actual dialog panel  */}
					<Dialog.Panel className='mx-3 overflow-auto rounded bg-gray-100 p-3'>
						{showModal.type === "web" ? (
							<WebTutorial handleCopyClick={handleCopyClick} />
						) : (
							<AndroidTutorial handleCopyClick={handleCopyClick} />
						)}
						<p className='mt-1 border-t-0 border-gray-300 sm:mt-4 sm:border-t'>
							<span className='font-bold text-red-400 underline'>NEVER</span> paste anything in
							the console if you don&apos;t know or trust the person sending you the code or what
							the code does.
						</p>
					</Dialog.Panel>
				</div>
			</Dialog>
		</Transition>
	);
};
export default TokenTutorial;

const WebTutorial = ({ handleCopyClick }) => {
	return (
		<>
			<div className='inline-flex w-full flex-col md:flex-row'>
				<ol className='list-inside list-decimal marker:text-blue-500 md:w-1/2'>
					<div className='font-semibold text-red-500'>
						Download the new extensions (
						<span>
							<a
								href={extensionChrome}
								target='_blank'
								rel='noopener noreferrer'
								className='inline-flex items-center hover:underline'
							>
								Chrome
								<LinkIcon />
							</a>
						</span>{" "}
						-{" "}
						<span>
							<a
								href={extensionFirefox}
								target='_blank'
								rel='noopener noreferrer'
								className='inline-flex items-center hover:underline'
							>
								Firefox
								<LinkIcon />
							</a>
						</span>
						) for a much easier method or follow the following steps:
					</div>
					<li className='m-2 border-gray-300'>
						Login to your Kolex account from the official website.
					</li>
					<li className='m-2 border-t border-gray-300 pt-2'>
						Open Developer Console (usually F12) and navigate to the Console tab.
					</li>
					<li className='m-2 border-t border-gray-300 pt-2'>
						Paste{" "}
						<span className='cursor-pointer underline' onClick={handleCopyClick}>
							this
						</span>{" "}
						code in the console and hit enter.{" "}
						<span>
							(If you see the warning about pasting codes into console, type &quot;allow
							pasting&quot; and try again)
						</span>
					</li>
					<div className='m-2 mb-0 border-t border-gray-300 pt-2'>
						In Chromium browsers, (Chrome, Opera, etc.), it automatically copies the token so you
						can skip this step.
					</div>
					<li className='m-2 mt-0 pt-2'>
						Right click on the output and hit &quot;Copy object&quot;.
					</li>
					<li className='m-2 border-t border-gray-300 pt-2'>
						Paste the text in the token field below.
					</li>
				</ol>
				<div className='relative md:w-1/2'>
					<ImageWrapper
						src={"https://i.imgur.com/6y8Mf4I.png"}
						alt={"Web Tutorial"}
						width={800}
						height={800}
					/>
				</div>
			</div>
		</>
	);
};

const AndroidTutorial = ({ handleCopyClick }) => {
	return (
		<>
			<div className='inline-flex h-[30rem] w-full flex-col overflow-auto md:flex-row'>
				<ol className='list-inside list-decimal md:h-full md:w-1/2'>
					<li>
						Download and install Kiwi browser from
						<a
							target='_blank'
							href='https://play.google.com/store/apps/details?id=com.kiwibrowser.browser&hl=en'
							rel='noopener noreferrer'
							className='mx-1 underline hover:underline-offset-2'
							title='Kiwi Browser'
						>
							Play Store.
						</a>
						(it&apos;s the only easy way to use the console on Android that I know of)
					</li>
					<li>
						Open the browser and navigate to the Kolex website. (You can use the &quot;Desktop
						site&quot; option in the menu to make it easier.)
					</li>
					<li>
						Open the menu by tapping on the three dots in the top right corner, then tap on
						&quot;Developer tools&quot; in the menu to open the console and navigate to the Console
						tab.
					</li>
					<li>
						Paste{" "}
						<span className='cursor-pointer underline' onClick={handleCopyClick}>
							this
						</span>{" "}
						code in the console and hit enter.
					</li>
					<li>
						Your Token should be copied to your clipboard by default, if not, long press on the
						output and hit &quot;Copy object&quot;.
					</li>
					<li>Paste the text in the field below.</li>
				</ol>
				<div className='relative -mt-20 min-h-full md:mt-0 md:h-full md:w-1/2'>
					<ImageWrapper
						src={"https://i.imgur.com/uA7X7bh.jpeg"}
						className='object-contain'
						fill={true}
						alt='Android Tutorial'
						unoptimized={false}
					/>
				</div>
			</div>
		</>
	);
};
