import { useState } from "react";
import { useAxios } from "hooks/useAxios";
import { ToastContainer, toast } from "react-toastify";
import uniq from "lodash/uniq";
import Meta from "@/components/Meta";
import LoadingSpin from "@/components/LoadingSpin";
import "react-toastify/dist/ReactToastify.css";

const Delist = () => {
	const { deleteData } = useAxios();
	const [cardId, setCardId] = useState([]);
	const [loading, setLoading] = useState(false);

	let counter = 0;
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const inputList = uniq(
			cardId
				.replace(/\s/g, "") // remove spaces
				.split(",") // split into array
				.filter((item) => item !== "") // remove empty items
				.filter((id) => !isNaN(id)) // remove non-numbers
		);
		for (const id of inputList) {
			try {
				const { result, error } = await deleteData(`/api/market/listed/${id}`);
				if (error) {
					toast.error(`${error.response.data.error} ${id}`, {
						toastId: id,
					});
					setLoading(false);
				}
				if (result && result.success) {
					counter++;
					toast.isActive("success")
						? toast.update("success", {
								render: `Removed ${counter}x ${counter === 1 ? "item" : "items"} from market.`,
						  })
						: toast.success(`Removed ${counter}x ${counter === 1 ? "item" : "items"} from market.`, {
								toastId: "success",
						  });
				}
			} catch (err) {
				console.error(err);
				toast.error(`${err.response.data.error} ${id}`, {
					toastId: id,
				});
			}
		}
		setLoading(false);
	};
	return (
		<>
			<Meta title='Delist | Kolex VIP' />
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<div className='mt-5 border p-2'>
				<form className='flex flex-col items-center space-y-2' onSubmit={handleSubmit}>
					<label htmlFor='card-id' className='flex items-center text-gray-700 dark:text-gray-300'>
						Enter card IDs
					</label>
					<input
						type='text'
						name='card-id'
						id='card-id'
						placeholder='Card IDs: e.g. 1, 2, 3, 4'
						value={cardId}
						onChange={(e) => setCardId(e.target.value)}
						disabled={loading}
						autoComplete='off'
						required={true}
						className={`input-field w-80 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
					/>
					<button
						type='submit'
						disabled={loading}
						className={`submit-button ${loading ? "cursor-not-allowed opacity-50" : ""}`}
					>
						{loading ? <LoadingSpin /> : "Remove from market"}
					</button>
				</form>
			</div>
		</>
	);
};
export default Delist;
