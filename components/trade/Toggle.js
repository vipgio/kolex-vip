const Toggle = ({ action, setAction }) => {
	const toggle = () => {
		setAction((prev) => (prev === "send" ? "receive" : "send"));
	};
	return (
		<div
			className='no-highlight relative mx-auto flex h-10 w-48 cursor-pointer flex-col justify-center rounded-full border border-gray-700 bg-gray-100 dark:bg-gray-300'
			onClick={toggle}
			onMouseDown={(e) => e.preventDefault()}
		>
			<div
				className='absolute my-1 h-[calc(100%_-_4px)] w-[calc(50%_+_2px)] rounded-full bg-orange-400 transition-all duration-500 ease-in-out'
				style={{ left: `${action === "receive" ? `calc(50% - 5px)` : `calc(0% + 2px)`}` }}
			></div>
			<div className='relative z-20 flex justify-around'>
				<div
					className={`text-center duration-300 ease-in-out ${
						action === "receive" ? "text-orange-500" : "ml-2 font-bold text-white"
					}`}
				>
					Send
				</div>
				<div
					className={`text-center duration-300 ease-in-out ${
						action === "receive" ? "ml-3 font-bold text-white" : "text-orange-500"
					}`}
				>
					Receive
				</div>
			</div>
		</div>
	);
};
export default Toggle;
