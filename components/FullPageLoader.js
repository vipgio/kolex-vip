import Head from "next/head";
import LoadingSpin from "./LoadingSpin";
const FullPageLoader = () => {
	return (
		<>
			<Head>
				<title>Loading... | Kolex VIP</title>
			</Head>
			<div className='flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-700'>
				<div className='flex flex-col items-center justify-center'>
					<LoadingSpin />
				</div>
			</div>
		</>
	);
};
export default FullPageLoader;
