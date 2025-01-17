import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import uniq from "lodash/uniq";
import { useAxios } from "@/hooks/useAxios";
import Meta from "@/components/Meta";
import UserSearch from "@/components/UserSearch";
import "react-toastify/dist/ReactToastify.css";

const Trade = () => {
	const { postData } = useAxios();
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [cardsToSend, setCardsToSend] = useState("");
	const [cardsToGet, setCardsToGet] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const sendItems = uniq(
			cardsToSend
				.replace(/\s/g, "") // remove spaces
				.split(",") // split into array
				.filter((item) => item !== "") // remove empty items
				.filter((id) => !isNaN(id)) // remove non-numbers
		);
		const receiveItems = uniq(
			cardsToGet
				.replace(/\s/g, "") // remove spaces
				.split(",") // split into array
				.filter((item) => item !== "") // remove empty items
				.filter((id) => !isNaN(id)) // remove non-numbers
		);
		const entities = [...sendItems, ...receiveItems].map((item) => ({
			id: item,
			type: "card",
		}));
		const { result, error } = await postData("/api/trade/create-offer", {
			userId: selectedUsers[0].id,
			entities: entities,
		});
		if (error) {
			setLoading(false);
			toast.error(`${error.response.data.error}`, {
				toastId: "error",
			});
		}
		if (result) {
			setLoading(false);
			toast.success("Trade sent", {
				toastId: "sent",
			});
		}
	};
	return (
		<>
			<Meta title='Trade | Kolex VIP' />
			<ToastContainer
				position='top-right'
				autoClose={3500}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<div className='flex w-48 flex-col gap-5 p-5'>
				<div className='text-gray-custom'>
					<div className='-ml-4'>
						<UserSearch setSelectedUsers={setSelectedUsers} selectedUsers={selectedUsers} />
					</div>
					<span>
						Selected User:{" "}
						{selectedUsers?.length > 0 &&
							selectedUsers.map((user, index) => (
								<span key={user.id}>
									{!!index && <span className='mx-2 text-primary-500'>|</span>}
									<span>{user.username}</span>
									<span
										className='ml-1 mr-1 cursor-pointer text-red-500'
										title='Clear selection'
										onClick={() => {
											setSelectedUsers((prev) =>
												prev.filter((oldUser) => oldUser.id !== user.id)
											);
										}}
									>
										x
									</span>
								</span>
							))}
					</span>
				</div>
				<div>
					<label htmlFor='cardsToSend' className='text-gray-custom flex items-center'>
						Enter cards to send
					</label>
					<input
						type='text'
						name='cardsToSend'
						id='cardsToSend'
						placeholder='Card IDs: e.g. 1, 2, 3, 4'
						value={cardsToSend}
						onChange={(e) => setCardsToSend(e.target.value)}
						disabled={loading}
						autoComplete='off'
						className='input-field w-80'
					/>
				</div>
				<div>
					<label htmlFor='cardsToGet' className='text-gray-custom flex items-center'>
						Enter cards to get
					</label>
					<input
						type='text'
						name='cardsToGet'
						id='cardsToGet'
						placeholder='Card IDs: e.g. 1, 2, 3, 4'
						value={cardsToGet}
						onChange={(e) => setCardsToGet(e.target.value)}
						disabled={loading}
						autoComplete='off'
						className='input-field w-80'
					/>
				</div>
				<button onClick={handleSubmit} className='submit-button' disabled={loading}>
					send
				</button>
			</div>
		</>
	);
};
export default Trade;
