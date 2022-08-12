import Link from "next/link";
import { useRouter } from "next/router";

const NavbarIcon = ({ name, link, svg }) => {
	const router = useRouter();
	return (
		<>
			<li className='no-highlight relative z-10'>
				<Link href={link}>
					<a
						className='group relative flex flex-col items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-0'
						title={name}
					>
						<div
							className={`indicator translate-y-4 opacity-0 ${
								router.pathname == link && "-translate-y-1 opacity-100"
							}`}
						></div>
						<span
							className={`absolute w-max -translate-y-4 text-sm opacity-0 transition-all duration-500 sm:text-base ${
								router.pathname == link && "-translate-y-[10px] opacity-100"
							}`}
						>
							{name}
						</span>
						<div
							className={`h-4 w-4 transition-transform duration-300 hover:scale-125 hover:cursor-pointer ${
								router.pathname == link && "translate-y-8"
							}`}
						>
							{svg}
						</div>
					</a>
				</Link>
			</li>
		</>
	);
};
export default NavbarIcon;
