import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import Footer from "./Footer";
import Navbar from "./Navbar";
import BackToTopButton from "./BackToTopButton";

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
			<BackToTopButton />
			{/* <div className='py-10'>{children}</div>
			<Footer /> */}
		</div>
	);
};

export default Layout;
