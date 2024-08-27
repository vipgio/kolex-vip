import { TbRotate } from "react-icons/tb";
const RefreshButton = ({ loading, func, style, title, disabled }) => {
	return (
		<button
			title={title}
			className={`${style} my-outline flex flex-col items-center rounded-md bg-red-400 p-1 font-semibold text-gray-200 focus-visible:ring-offset-2 enabled:hover:bg-red-500 enabled:active:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50`}
			disabled={loading || disabled}
			onClick={func}
		>
			<TbRotate className={`h-6 w-6 rotate-90 enabled:cursor-pointer ${loading && "animate-spin-ac"}`} />
		</button>
	);
};
export default RefreshButton;
