import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const History = () => {
	const notify = () =>
		toast("🦄 Wow so easy!", {
			className: "absolute",
			position: "top-right",
			autoClose: false,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});

	return (
		<div className='relative h-full w-full border'>
			<button onClick={notify}>Notify!</button>
			<div className='mt-40 h-80 w-80 border bg-gray-900'>
				<ToastContainer
					className='absolute'
					position='top-right'
					autoClose={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
				/>
			</div>
		</div>
	);
};
export default History;
