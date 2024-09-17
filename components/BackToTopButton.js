import { useState, useEffect } from "react";
import { LuArrowUp } from "react-icons/lu";
import isMobile from "@/utils/isMobile";

function BackToTopButton() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const mobileCheck = isMobile();
		const handleScroll = () => {
			setIsVisible(window.scrollY > 300 && mobileCheck);
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<button
			className={`${
				isVisible ? "opacity-50" : "pointer-events-none opacity-0"
			} fixed bottom-4 right-4 z-30 cursor-pointer rounded-full border border-gray-300 bg-white p-2 text-center transition duration-300 ease-in-out hover:opacity-100`}
			onClick={scrollToTop}
			title='Back to top'
		>
			<LuArrowUp className='h-5 w-5' />
		</button>
	);
}

export default BackToTopButton;
