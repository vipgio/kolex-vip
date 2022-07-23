import Link from "next/link";
import Meta from "../components/Meta";

const NotFound = () => {
	return (
		<>
			<Meta title='Page not Found | Kolex VIP' robots='noindex' />
			<div className='text-gray-200'>
				This page cannot be found. Return to the{" "}
				<Link href='/'>
					<a className='underline hover:text-sky-400'>Homepage</a>
				</Link>
			</div>
		</>
	);
};

export default NotFound;
