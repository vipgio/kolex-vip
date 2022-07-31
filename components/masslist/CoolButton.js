const CoolButton = ({ action, setAction }) => {
	const toggle = () => {
		// setAction((prev) => !prev);
		setAction((prev) => (prev === "list" ? "open" : "list"));
	};
	return (
		<div
			className='no-highlight relative mx-auto flex h-10 w-48 cursor-pointer flex-col justify-center rounded-full bg-gray-300'
			onClick={() => toggle()}
			onMouseDown={(e) => e.preventDefault()}
		>
			<div
				className='absolute my-[2px] h-[calc(100%_-_4px)] w-1/2 rounded-full bg-orange-400 transition-all duration-500 ease-in-out'
				style={{ left: `${action === "open" ? `calc(50% - 2px)` : `calc(0% + 2px)`}` }}
			></div>
			<div className='relative z-20 flex justify-around'>
				<div
					className={`text-center duration-500 ease-in-out ${
						action === "open" ? "text-orange-500" : "text-xl font-bold text-white"
					}`}
				>
					List
				</div>
				<div
					className={`text-center duration-500 ease-in-out ${
						action === "open" ? "ml-3 text-xl font-bold text-white" : "text-orange-500"
					}`}
				>
					Open
				</div>
			</div>
		</div>
	);
};
export default CoolButton;
