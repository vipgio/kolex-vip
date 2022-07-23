import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const NavbarIcon = ({ index, name, link, svg }) => {
	const { active, setActive } = useContext(UserContext);
	return (
		<>
			{/* <button onClick={() => console.log(active, index)}>Info</button> */}
			<li onClick={() => setActive(index)} className='relative z-10'>
				<Link href={link}>
					<a
						className='group relative flex flex-col items-center justify-center transition-all duration-150'
						title={name}
					>
						<div
							className={`indicator translate-y-4 opacity-0 ${
								active === index && "-translate-y-1 opacity-100"
							}`}
						></div>
						<span
							className={`absolute w-max -translate-y-4 opacity-0 transition-all duration-500 ${
								active === index && "-translate-y-[10px] opacity-100"
							}`}
						>
							{name}
						</span>
						<div
							className={`h-4 w-4 transition-transform duration-300 hover:scale-125 hover:cursor-pointer ${
								active === index && "translate-y-8"
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
