import { useState } from "react";

export const CoolButton = () => {
	const [left, setLeft] = useState(0);

	const toggle = () => {
		left ? setLeft(0) : setLeft(50);
	};
	return (
		<div
			className='relative mx-auto h-10 w-56 cursor-pointer rounded-full bg-purple-500'
			onClick={() => toggle()}
			onMouseDown={(e) => e.preventDefault()}
		>
			<div
				className='absolute mt-[2px] h-[calc(100%_-_4px)] w-1/2 rounded-full bg-blue-400 transition-all duration-500 ease-in-out'
				style={{ left: `${left ? `calc(${left}% - 3px)` : `calc(${left}% + 3px)`}` }}
			></div>
			<div className='relative z-20 flex justify-around'>
				<div
					style={{
						color: `${left ? "rgb(233, 168, 111)" : "white"}`,
						transitionDuration: "0.6s",
					}}
				>
					Balance
				</div>
				<div
					style={{
						color: `${!left ? "rgb(233, 168, 111)" : "white"}`,
						transitionDuration: "0.6s",
					}}
				>
					Income
				</div>
			</div>
		</div>
	);
};
