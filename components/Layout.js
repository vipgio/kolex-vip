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
			} bg-main container relative mx-auto h-full overflow-x-clip transition-colors`}
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
