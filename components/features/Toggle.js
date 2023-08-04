const Toggle = ({ action, setAction }) => {
	const toggle = () => {
		setAction((prev) => (prev === "features" ? "pricing" : "features"));
	};
	return (
		<div
			className='no-highlight relative mx-auto flex h-10 w-48 cursor-pointer flex-col justify-center rounded-full border border-gray-700 bg-gray-100 dark:bg-gray-300'
			onClick={toggle}
			onMouseDown={(e) => e.preventDefault()}
		>
			<div
				className='absolute my-1 h-[calc(100%_-_4px)] w-[calc(50%_+_2px)] rounded-full bg-primary-400 transition-all duration-500 ease-in-out'
				style={{ left: `${action === "pricing" ? `calc(50% - 5px)` : `calc(0% + 2px)`}` }}
			></div>
			<div className='relative z-20 flex justify-around'>
				<div
					className={`text-center duration-300 ease-in-out ${
						action === "pricing" ? "text-primary-500" : "font-bold text-white"
					}`}
				>
					Features
				</div>
				<div
					className={`mr-1 text-center duration-300 ease-in-out ${
						action === "pricing" ? "font-bold text-white" : "text-primary-500"
					}`}
				>
					Pricing
				</div>
			</div>
		</div>
	);
};
export default Toggle;
