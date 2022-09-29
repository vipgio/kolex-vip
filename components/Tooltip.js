import { BsQuestionCircle } from "react-icons/bs";
const Tooltip = ({ direction, text, mode }) => {
	let extra = "";
	// create a switch case for direction
	switch (direction) {
		case "left":
			extra = "right-5 mr-5 after:-right-5 after:border-l-orange-400";
			break;

		case "right":
			extra = "left-5 ml-5 after:-left-5 after:border-r-orange-400";
			break;
	}

	return (
		<div
			className={`group relative block opacity-30 transition-opacity duration-300 hover:opacity-100 ${
				direction === "right" ? "ml-2" : "mr-2"
			} ${mode === "light" ? "text-white" : ""}`}
		>
			<BsQuestionCircle />
			<div className={`tooltip ${extra}`}>{text}</div>
		</div>
	);
};
export default Tooltip;
