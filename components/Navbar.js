import { Menu, Transition } from "@headlessui/react";

import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef, useContext } from "react";

import { discordLink, excludedFeatures, extensionChrome, extensionFirefox, githubLink } from "@/config/config";

import { ThemeContext } from "@/context/ThemeContext";
import { UserContext } from "@/context/UserContext";

import isMobile from "@/utils/isMobile";

import BurgerMenuIcon from "./BurgerMenuIcon";
import CategorySelector from "./CategorySelector";
import {
	CardlisterIcon,
	CirculationIcon,
	CraftingIcon,
	DiscordIcon,
	ExtensionIcon,
	GithubIcon,
	HistoryIcon,
	HomeIcon,
	LinkIcon,
	LockIcon,
	MintsearchIcon,
	MoonIcon,
	PackmanagerIcon,
	PacksIcon,
	RushIcon,
	ScannerIcon,
	SpinnerIcon,
	SunIcon,
	TransactionsIcon,
	TransferIcon,
} from "./Icons";

const NewNavbar = () => {
	const { user, categoryId } = useContext(UserContext);
	const { theme, setTheme } = useContext(ThemeContext);
	const router = useRouter();

	return (router.pathname === "/" && !user) || router.pathname === "/admin" ? null : (
		<nav className='text-gray-custom flex h-12 items-center justify-center rounded-b-md bg-primary-500 shadow-lg transition-colors dark:bg-slate-500'>
			{user && (
				<Menu as='div' className='relative z-30 inline-block h-full w-12 text-left'>
					{({ open }) => (
						<>
							<Menu.Button
								className='my-outline group inline-flex h-12 w-full items-center justify-center px-4 py-2 text-sm font-medium text-gray-100 focus-visible:ring-inset'
								onMouseEnter={({ target }) => !isMobile() && target.click()}
							>
								<BurgerMenuIcon open={open} />
							</Menu.Button>

							<Transition
								show={open}
								enter='transition ease-out duration-100'
								enterFrom='transform opacity-0 scale-95'
								enterTo='transform opacity-100 scale-100'
								leave='transition ease-in duration-75'
								leaveFrom='transform opacity-100 scale-100'
								leaveTo='transform opacity-0 scale-95'
							>
								<Menu.Items className='absolute left-0 mt-1 ml-1 grid w-56 origin-top-left grid-cols-1 gap-1 rounded-lg border border-gray-800/30 bg-gray-200 p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-gray-200/30 dark:bg-gray-800 sm:w-[21rem] sm:grid-cols-2'>
									{pages.map((page) => (
										<Menu.Items key={page.link}>
											<Menu.Item
												disabled={excludedFeatures
													.find((category) => category.id == categoryId)
													?.excluded?.includes(page.link)}
											>
												{({ active }) => (
													<MyLink
														href={
															page.paid
																? user.info.allowed.includes(page.link)
																	? `/${page.link}`
																	: "/features"
																: `/${page.link}`
														}
														className={`${
															active
																? "bg-primary-500 fill-gray-200 text-gray-200 dark:bg-gray-200 dark:fill-gray-700 dark:text-gray-700"
																: "text-gray-custom fill-gray-700 dark:fill-gray-200"
														} group flex w-full items-center rounded-md px-3 py-4 text-sm transition-colors active:bg-gray-800 active:shadow-md dark:active:bg-gray-300`}
														disabled={excludedFeatures
															.find((category) => category.id == categoryId)
															?.excluded?.includes(page.link)}
													>
														<span className='mr-1 scale-125'>
															{page.paid ? (
																user.info.allowed.includes(page.link) ? (
																	page.icon
																) : (
																	<LockIcon />
																)
															) : (
																page.icon
															)}
														</span>
														<span className='ml-1'>{page.title}</span>
														{page.new && (
															<span className='ml-auto rounded bg-red-500 p-1 text-xs text-gray-100'>
																New
															</span>
														)}
													</MyLink>
												)}
											</Menu.Item>
										</Menu.Items>
									))}
									{/* <Menu.Item>
										{({ active }) => (
											<a
												href={linkExtensionStore()}
												target='_blank'
												rel='noopener noreferrer'
												className={`${
													active
														? "bg-primary-500 fill-gray-200 text-gray-200 dark:bg-gray-200 dark:fill-gray-700 dark:text-gray-700"
														: "text-gray-custom fill-gray-700 dark:fill-gray-200"
												} flex w-full items-center justify-center rounded-md px-3 py-4 pt-3 text-sm transition-colors active:bg-gray-800 active:shadow-md dark:active:bg-gray-300`}
											>
												<span className='mr-1 scale-125'>
													<ExtensionIcon />
												</span>
												<span className='ml-1 inline-flex items-center'>
													Extension <LinkIcon className='ml-1' />
												</span>
												<span className='ml-auto rounded bg-red-500 p-1 text-xs text-gray-100'>
													New
												</span>
											</a>
										)}
									</Menu.Item> */}
								</Menu.Items>
							</Transition>
						</>
					)}
				</Menu>
			)}
			{user && (
				<div className='ml-2'>
					<CategorySelector />
				</div>
			)}
			<button className='ml-auto mr-2' tabIndex={-1}>
				<a
					href={githubLink}
					target='_blank'
					rel='noopener noreferrer'
					title='Source Code'
					className='block rounded-full p-1'
				>
					<GithubIcon className='h-5 w-5 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-300 dark:active:text-gray-400' />
				</a>
			</button>
			<button className='mr-1' tabIndex={-1}>
				<a
					href={discordLink}
					target='_blank'
					rel='noreferrer'
					title='Contact me on Discord'
					className='block rounded-full p-1'
				>
					<DiscordIcon className='h-5 w-5 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-300 dark:active:text-gray-400' />
				</a>
			</button>
			<button
				className='my-outline mr-2 h-8 w-8 rounded-full focus-visible:ring-inset'
				onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
			>
				<div className='relative h-10 w-10 rounded-full' title='Change theme'>
					<SunIcon
						className={`absolute top-1 left-1 h-6 w-6 animate-fadeIn cursor-pointer p-1 text-gray-300 transition-transform ${
							theme === "dark" ? "" : "animate-fadeOut opacity-0"
						}`}
					/>
					<MoonIcon
						className={`absolute top-1 left-1 h-6 w-6 animate-fadeIn cursor-pointer p-1 text-gray-700 transition-transform  ${
							theme === "dark" ? "animate-fadeOut opacity-0" : ""
						}`}
					/>
				</div>
			</button>
			{router.pathname === "/features" ? (
				<Link href='/'>
					<a className='submit-button mr-2 rounded border border-gray-100 bg-primary-500 !p-1.5 text-gray-100 transition-colors hover:bg-primary-600 active:bg-primary-700 dark:border-none'>
						Home
					</a>
				</Link>
			) : (
				<Link href='/features'>
					<a className='submit-button mr-2 rounded border border-gray-100 bg-primary-500 !p-1.5 text-gray-100 transition-colors hover:bg-primary-600 active:bg-primary-700 dark:border-none'>
						Features
					</a>
				</Link>
			)}
		</nav>
	);
};

export default NewNavbar;

const MyLink = forwardRef((props, ref) => {
	const { href, children, disabled, ...rest } = props;
	if (disabled) {
		return (
			<div className=' group flex w-full items-center rounded-md px-3 py-4 text-sm transition-colors active:bg-gray-800 active:shadow-md dark:active:bg-gray-300 text-gray-custom fill-gray-700 dark:fill-gray-200 opacity-50 cursor-not-allowed'>
				{children}
			</div>
		);
	}
	return (
		<Link href={href}>
			<a ref={ref} {...rest}>
				{children}
			</a>
		</Link>
	);
});
MyLink.displayName = "MyLink";

const pages = [
	{ link: "", title: "Home Page", icon: <HomeIcon />, paid: false },
	{ link: "circulation", title: "Circulation", icon: <CirculationIcon />, paid: false },
	{ link: "packs", title: "Pack Search", icon: <PacksIcon />, paid: false },
	{ link: "spinner", title: "Spinner", icon: <SpinnerIcon />, paid: false },
	{ link: "scanner", title: "Scanner", icon: <ScannerIcon className='scale-105' />, paid: false },
	{ link: "crafting", title: "Crafting", icon: <CraftingIcon className='scale-125' />, paid: false },
	{ link: "rush", title: "RUSH", icon: <RushIcon />, paid: false },
	{ link: "transactions", title: "Transactions", icon: <TransactionsIcon />, paid: false },
	{ link: "packmanager", title: "Pack Manager", icon: <PackmanagerIcon />, paid: true },
	{ link: "mintsearch", title: "Mint Search", icon: <MintsearchIcon />, paid: true },
	{ link: "history", title: "History", icon: <HistoryIcon />, paid: true },
	{ link: "cardlister", title: "Card Lister", icon: <CardlisterIcon />, paid: true },
	{ link: "transfer", title: "Account Transfer", icon: <TransferIcon size={16} />, paid: true },
	// {
	// 	link: "burn",
	// 	title: "Burner",
	// 	icon: <FaBurn />,
	// 	paid: true,
	// 	new: true,
	// },
];

const linkExtensionStore = () => {
	const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
	const isFirefox = /Firefox/.test(navigator.userAgent);
	return isFirefox ? extensionFirefox : isChrome ? extensionChrome : extensionChrome;
};
