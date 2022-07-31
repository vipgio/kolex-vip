import Head from "next/head";
const FullPageLoader = () => {
	return (
		<>
			<Head>
				<title>Loading... | Kolex VIP</title>
			</Head>
			<div className='flex min-h-screen flex-col items-center justify-center bg-gray-700'>
				<div className='flex flex-col items-center justify-center'>
					<div className='h-8 w-8 animate-spin rounded-full border-4 border-white border-t-gray-700 bg-gray-700'></div>
				</div>
			</div>
		</>
	);
};
export default FullPageLoader;
