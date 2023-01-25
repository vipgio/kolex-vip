import { ThemeContext } from "context/ThemeContext";
import { useContext } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
	const { theme } = useContext(ThemeContext);
	return (
		<div
			className={`${
				theme === "dark" ? "dark" : ""
			} container relative mx-auto h-full overflow-x-clip bg-gray-100 transition-colors dark:bg-gray-700`}
		>
			<Navbar />
			{children}
			{/* <div className='py-10'>{children}</div>
			<Footer /> */}
		</div>
	);
};

export default Layout;
