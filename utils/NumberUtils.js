const fixDecimal = (input) => {
	return Number(input.toFixed(6).replace(/0+$/, "").replace(/\.$/, ""));
};
export default fixDecimal;
