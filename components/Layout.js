import { ThemeContext } from "context/ThemeContext";
import { useContext } from "react";
import Footer from "./Footer";
import NewNavbar from "./NewNavbar";

const Layout = ({ children }) => {
	const { theme } = useContext(ThemeContext);
	return (
		<div
			className={`${
				theme === "dark" ? "dark" : ""
			} container relative mx-auto h-full overflow-x-clip bg-gray-100 transition-colors dark:bg-gray-700`}
		>
			<NewNavbar />
			{children}
			{/* <div className='py-10'>{children}</div>
			<Footer /> */}
		</div>
	);
};

export default Layout;
