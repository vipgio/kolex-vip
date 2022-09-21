import Footer from "./Footer";
import { Navbar } from "./Navbar";
import NewNavbar from "./NewNavbar";

const Layout = ({ children }) => {
	return (
		<div className='container relative mx-auto h-full overflow-x-clip bg-gray-700'>
			{/* <NewNavbar /> */}
			<Navbar />
			{children}
			{/* <div className='py-10'>{children}</div>
			<Footer /> */}
		</div>
	);
};

export default Layout;
