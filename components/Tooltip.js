import { BsQuestionCircle } from "react-icons/bs";
import { Tooltip as NewTooltip } from "react-tooltip";
const Tooltip = ({ direction, text, color }) => {
	const id = Buffer.from(text, "utf8").toString("base64");
	let extra = "";
	let customColor = "";
	// create a switch case for direction
	switch (direction) {
		case "left":
			extra = "right-5 mr-5 after:-right-5 after:border-l-primary-400";
			break;

		case "right":
			extra = "left-5 ml-5 after:-left-5 after:border-r-primary-400";
			break;

		case "top":
			extra = "bottom-5 mb-5 after:-bottom-5 after:border-t-primary-400";
			break;
	}

	switch (color) {
		case "black":
			customColor = "text-black";
			break;

		case "white":
			customColor = "text-white";
			break;

		case "gray":
			customColor = "text-gray-500";
			break;

		case "red":
			customColor = "text-red-400";
			break;

		default:
			customColor = "dark:text-white text-black";
	}

	return (
		<>
			<a data-tooltip-id={id} data-tooltip-place={direction}>
				<BsQuestionCircle
					className={`relative block text-white opacity-50 transition-opacity duration-300 hover:opacity-100 ${
						direction === "right" ? "ml-2" : direction === "top" ? "mb-2" : "mr-2"
					} ${customColor}`}
				/>
			</a>
			<NewTooltip
				id={id}
				style={{
					backgroundColor:
						"hsl(var(--twc-primary-500) / var(--twc-primary-400-opacity, var(--tw-bg-opacity)))",
					width: "12rem",
					zIndex: 9999,
				}}
			>
				{text}
			</NewTooltip>
		</>
		// <div
		// 	className={`group relative block opacity-50 transition-opacity duration-300 hover:opacity-100 ${
		// 		direction === "right" ? "ml-2" : direction === "top" ? "mb-2" : "mr-2"
		// 	} ${customColor}`}
		// >
		// 	<BsQuestionCircle />
		// 	<div className={`tooltip ${extra}`}>{text}</div>
		// </div>
	);
};
export default Tooltip;
