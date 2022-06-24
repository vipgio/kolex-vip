import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<div className='bg-indigo-300'>
			<nav>
				<ul className='flex w-full justify-around overflow-hidden rounded-full rounded-b-md border-b py-2'>
					<li>
						<Link to='/'>Home</Link>
					</li>
					<li>
						<Link to='/circulation'>Circulation</Link>
					</li>
					<li>
						<Link to='/packs'>Pack search</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
};
