import { Navbar } from "./Navbar";

const Layout = ({ children }) => {
	return (
		<div className='container relative mx-auto h-full overflow-x-clip bg-gray-700'>
			<Navbar />
			{children}
		</div>
	);
};

export default Layout;
