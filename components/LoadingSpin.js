const LoadingSpin = ({ size }) => {
	return (
		<div className={`${size === 4 ? "h-4 w-4" : "h-7 w-7"} loader h-7 w-7 animate-spin rounded-full`}></div>
	);
};
export default LoadingSpin;
