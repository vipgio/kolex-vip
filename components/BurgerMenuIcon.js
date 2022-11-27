const BurgerMenuIcon = ({ open }) => {
	return (
		<div className='absolute left-0 z-30 flex h-10 w-12 cursor-pointer items-center justify-center border-r-2 group-focus-visible:border-transparent'>
			<div className='relative h-7 w-7 border border-transparent lg:h-10 lg:w-10'>
				<span
					className={`navbar-icon-bar top-1 h-0.5 transform lg:top-1 lg:h-1 ${
						open
							? "w-4 translate-y-0.5 -translate-x-1.5 rotate-45 lg:w-6 lg:translate-y-1"
							: "w-5 lg:w-6"
					}`}
				></span>
				<span
					className={`navbar-icon-bar top-3 h-0.5 transform lg:top-4 lg:h-1 ${
						open ? "w-9 -translate-x-2.5 -rotate-45 lg:w-12" : "w-5 lg:w-7"
					}`}
				></span>
				<span
					className={`navbar-icon-bar top-5 h-0.5 transform lg:top-7 lg:h-1 ${
						open
							? "w-4 translate-x-2 -translate-y-0.5 rotate-45 lg:w-6 lg:translate-x-2.5 lg:-translate-y-1"
							: "w-5 lg:w-8"
					}`}
				></span>
			</div>
		</div>
	);
};
export default BurgerMenuIcon;
