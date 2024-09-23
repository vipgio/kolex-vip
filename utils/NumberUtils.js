const fixDecimal = (input, decimal = 6) => {
	return Number(Number(input).toFixed(decimal).replace(/0+$/, "").replace(/\.$/, ""));
};
export default fixDecimal;
