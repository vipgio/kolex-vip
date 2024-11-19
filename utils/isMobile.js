const isMobile = () => {
	// if (navigator.maxTouchPoints > 0 && navigator.maxTouchPoints !== 256) {
	// 	return true;
	// }
	// If `navigator.maxTouchPoints` is not available or returns 0, use `userAgent` as a fallback
	const userAgent = navigator.userAgent.toLowerCase();
	const mobileRegex = /android|iphone|ipad|ipod|blackberry|windows phone|opera mini/i;

	return mobileRegex.test(userAgent);
};
export default isMobile;
