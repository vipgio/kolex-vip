import Link from "next/link";
import Meta from "../components/Meta";

const NotFound = () => {
	return (
		<>
			<Meta title='Page not Found | Kolex VIP' robots='noindex' />
			<div className='mt-10 flex w-full justify-center text-gray-800 dark:text-gray-200'>
				<span className='mr-1'>This page cannot be found. Return to the</span>
				<Link href='/'>
					<a className='underline hover:text-orange-500'>Homepage</a>
				</Link>
			</div>
		</>
	);
};

export default NotFound;
