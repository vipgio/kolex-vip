import { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import uniq from "lodash/uniq";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "context/UserContext";
import Meta from "components/Meta";
import Tooltip from "components/Tooltip";
import CardHistory from "components/CardHistory";
import { useEffect } from "react";

const History = () => {
	const { user, loading, setLoading } = useContext(UserContext);
	const [cardId, setCardId] = useState("");
	const [history, setHistory] = useState([]);
	const [templates, setTemplates] = useState([]);
	const [isDone, setIsDone] = useState(false);

	useEffect(() => {
		if (templates[0]?.length > 0) {
			templates[0].forEach((template) => {
				setHistory((items) =>
					items.map((history) => {
						return history.cardTemplateId === template.id
							? { ...history, template: template }
							: { ...history };
					})
				);
			});
			setIsDone(true);
		}
	}, [templates]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setHistory([]);
		setTemplates([]);
		setIsDone(false);

		const inputList = uniq(
			cardId
				.replace(/\s/g, "") // remove spaces
				.split(",") // split into array
				.filter((item) => item !== "") // remove empty items
				.filter((id) => !isNaN(id)) // remove non-numbers
		);

		if (inputList.length > 0) {
			const templateIds = [];
			await Promise.all(
				inputList.map(async (cardId) => {
					try {
						const { data } = await axios.get(`/api/cards/${cardId}`, {
							headers: {
								jwt: user.jwt,
							},
						});
						templateIds.push(data.data.cardTemplateId);
						setHistory((prev) => [...prev, data.data]);
						setLoading(false);
					} catch (err) {
						console.log(err);
						setLoading(false);
						toast.error(`${err.response.data.error} ${cardId}`, {
							toastId: cardId,
						});
					}
				})
			);
			const { data } = await axios.get(`/api/cards/templates`, {
				params: {
					cardIds: uniq(templateIds).toString(),
				},
				headers: {
					jwt: user.jwt,
				},
			});
			setTemplates((prev) => [...prev, data.data]);
		} else {
			toast.error("Please enter a valid input", {
				toastId: "valid input",
			});
			setLoading(false);
		}
	};

	return (
		<>
			<Meta title='History | Kolex VIP' />
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
			<div className='mt-10 mb-10 flex flex-col items-center'>
				<div className='flex h-full w-full items-start justify-center pt-10'>
					<form className='flex flex-col items-center space-y-2' onSubmit={handleSubmit}>
						<label htmlFor='card-id' className='flex items-center text-gray-300'>
							Enter card IDs
							<Tooltip
								text='Enter a list of card IDs, separated with commas, to see their history. You can use any tool to find the card Id or use the scanner in the app.'
								direction='right'
							/>
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
							className={`input-field w-80 ${
								loading ? "cursor-not-allowed opacity-50" : ""
							}`}
						/>
						<button
							type='submit'
							disabled={loading}
							className={`big-button ${loading ? "cursor-not-allowed opacity-50" : ""}`}
						>
							{loading ? (
								<div className='h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-gray-700'></div>
							) : (
								"Get history"
							)}
						</button>
					</form>
				</div>
				{history.length > 0 && isDone && (
					<div className='mt-10 flex w-full flex-col items-center space-y-2 px-5'>
						{/* <div className='grid grid-cols-2 gap-5 lg:grid-cols-4'> */}
						<div className='flex w-full flex-wrap justify-center'>
							{history
								.sort((a, b) => b.id - a.id)
								.map((item) => (
									<CardHistory key={item.id} item={item} />
								))}
						</div>
					</div>
				)}
			</div>
		</>
	);
};
export default History;
