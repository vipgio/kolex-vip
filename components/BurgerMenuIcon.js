import { useState } from "react";

const BurgerMenuIcon = () => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div
			className='bg-accent-color absolute z-30 flex h-14 w-14 cursor-pointer items-center justify-center rounded-br-xl lg:h-24 lg:w-24'
			onClick={() => setIsOpen((prev) => !prev)}
		>
			<div className='relative h-7 w-7 lg:h-10 lg:w-10'>
				<span
					className={`navbar-icon-bar top-1 h-0.5 transform lg:top-1 lg:h-1 ${
						isOpen
							? "w-4 translate-y-0.5 rotate-45 lg:w-6 lg:translate-y-1"
							: "w-5 lg:w-7"
					}`}
				></span>
				<span
					className={`navbar-icon-bar top-3 h-0.5 transform lg:top-4 lg:h-1 ${
						isOpen ? "w-9 -translate-x-1 -rotate-45 lg:w-12" : "w-5 lg:w-8"
					}`}
				></span>
				<span
					className={`navbar-icon-bar top-5 h-0.5 transform lg:top-7 lg:h-1 ${
						isOpen
							? "w-4 translate-x-3 -translate-y-0.5 rotate-45 lg:w-6 lg:translate-x-4 lg:-translate-y-1"
							: "w-5 lg:w-10"
					}`}
				></span>
			</div>
		</div>
	);
};
export default BurgerMenuIcon;

// <button className='but' onClick={() => setIsOpen((prev) => !prev)}>
// 	<div className='burger-middle'></div>
// 	<div className={`burger ${isOpen ? "expanded" : ""}`}></div>
// </button>
