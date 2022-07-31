const Tooltip = ({ direction, text }) => {
	const extra = "";
	// create a switch case for direction
	switch (direction) {
		case "left":
			extra = "right-5 mr-5 after:-right-5 after:border-l-orange-400";
			break;

		case "right":
			extra = "left-5 ml-5 after:-left-5 after:border-r-orange-400";
			break;
	}

	return <div className={`tooltip ${extra}`}>{text}</div>;
};
export default Tooltip;
