import { useContext, forwardRef } from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { AiOutlineScan, AiOutlineMenu } from "react-icons/ai";
import { UserContext } from "context/UserContext";
import { FaHistory, FaSearch, FaLock } from "react-icons/fa";

const freePages = [
	{ link: "", title: "Home Page", icon: <AiOutlineScan /> },
	{ link: "packs", title: "Pack Search", icon: <AiOutlineScan /> },
	{ link: "spinner", title: "Spinner", icon: <AiOutlineScan /> },
];
const paidPages = [
	{ link: "masslist", title: "Masslist" },
	{ link: "mintsearch", title: "Mint Search" },
	{ link: "history", title: "History" },
];
const NewNavbar = () => {
	const { user } = useContext(UserContext);
	return (
		user && (
			<div className='h-12 rounded-b-md bg-indigo-300 text-right font-semibold text-gray-700'>
				<Menu as='div' className='relative z-50 inline-block h-full text-left'>
					<div>
						<Menu.Button className='inline-flex h-12 w-full items-center justify-center rounded-md border bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
							<AiOutlineMenu />
						</Menu.Button>
					</div>
					<Transition
						enter='transition ease-out duration-100'
						enterFrom='transform opacity-0 scale-95'
						enterTo='transform opacity-100 scale-100'
						leave='transition ease-in duration-75'
						leaveFrom='transform opacity-100 scale-100'
						leaveTo='transform opacity-0 scale-95'
					>
						<Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
							{freePages.map((page) => (
								<Menu.Items>
									<Menu.Item>
										{({ active }) => (
											<MyLink
												href={`/${page.link}`}
												className={`${
													active ? "bg-orange-500 text-white" : "text-gray-900"
												} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
											>
												{page.icon}
												{page.title}
											</MyLink>
										)}
									</Menu.Item>
								</Menu.Items>
							))}
							{paidPages.map((page) => (
								<Menu.Items>
									<Menu.Item>
										{({ active }) => (
											<MyLink
												href={
													user.info.allowed.includes(page.link) ? `/${page.link}` : ""
												}
												className={`${
													active ? "bg-orange-500 text-white" : "text-gray-900"
												} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
											>
												<FaLock />
												{page.title}
											</MyLink>
										)}
									</Menu.Item>
								</Menu.Items>
							))}
						</Menu.Items>
					</Transition>
				</Menu>
			</div>
		)
	);
};

export default NewNavbar;
const MyLink = forwardRef((props, ref) => {
	let { href, children, ...rest } = props;
	return (
		<Link href={href}>
			<a ref={ref} {...rest}>
				{children}
			</a>
		</Link>
	);
});
