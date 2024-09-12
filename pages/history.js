import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import uniq from "lodash/uniq";
import pick from "lodash/pick";
import chunk from "lodash/chunk";
import { useAxios } from "@/hooks/useAxios";
import "react-toastify/dist/ReactToastify.css";
import { templateLimit } from "@/config/config";
import Meta from "@/components/Meta";
import Tooltip from "@/components/Tooltip";
import CardHistory from "@/components/CardHistory";
import LoadingSpin from "@/components/LoadingSpin";
import Toggle from "@/components/history/Toggle";
import ExportButton from "@/components/history/ExportButton";
import { useRouter } from "next/router";

const History = () => {
	const router = useRouter();
	const { fetchData } = useAxios();
	const [loading, setLoading] = useState(false);
	const [cardId, setCardId] = useState("");
	const [history, setHistory] = useState([]);
	const [templates, setTemplates] = useState([]);
	const [isDone, setIsDone] = useState(false);
	const [compactMode, setCompactMode] = useState(true);
	const { href } = router.query;
	const dataToShow = history.sort((a, b) => a.id - b.id);

	useEffect(() => {
		const refQuery = href ? JSON.parse(href) : [];
		setCardId(refQuery.join(", "));
	}, []);

	useEffect(() => {
		if (templates?.length > 0) {
			templates.flat().forEach((template) => {
				setHistory((items) =>
					items.map((history) => {
						return history.cardTemplateId === template.id
							? { ...history, ...pick(template, ["title", "images"]) }
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
					const { result, error } = await fetchData(`/api/cards/${cardId}`);
					if (result) {
						templateIds.push(result.cardTemplateId);
						setHistory((prev) => [
							...prev,
							pick(result, ["id", "mintBatch", "mintNumber", "history", "images", "cardTemplateId"]),
						]);
					}
					if (error) {
						setLoading(false);
						toast.error(`${error.response.data.error} ${cardId}`, {
							toastId: cardId,
						});
					}
				})
			);

			if (templateIds.length > 0) {
				const templatesChunk = chunk(uniq(templateIds), templateLimit);
				for (const [index, templateId] of templatesChunk.entries()) {
					const { result, error } = await fetchData(`/api/cards/templates`, {
						cardIds: uniq(templateId).toString(),
					});
					if (result) {
						setTemplates((prev) => [...prev, result]);
						index === Math.floor(uniq(templateIds).length / templateLimit) && setLoading(false);
					}
					if (error) {
						setLoading(false);
						toast.error(`${error.response.data.error}`, {
							toastId: "template error",
						});
					}
				}
			}
			setIsDone(true);
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
			<div className='mt-7 mb-10 flex flex-col items-center'>
				<Toggle compactMode={compactMode} setCompactMode={setCompactMode} />
				<div className='h-full w-full flex-col items-start justify-center pt-3'>
					<form className='flex flex-col items-center space-y-2' onSubmit={handleSubmit}>
						<label htmlFor='card-id' className='text-gray-custom flex items-center'>
							Enter card IDs
							<Tooltip
								text='Enter a list of card IDs, separated by commas. You can use any tool (e.g., scanner, mintsearch, etc.) to find the card ID.'
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
							className={`input-field w-80 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
						/>
						<button
							type='submit'
							disabled={loading}
							className={`submit-button ${loading ? "cursor-not-allowed opacity-50" : ""}`}
						>
							{loading ? <LoadingSpin /> : "Get history"}
						</button>
					</form>
					{history.length > 0 && (
						<div className='text-gray-custom mt-1 text-center'>
							{history.length}/{cardId.split(/\s|,/).filter((id) => !isNaN(id) && id !== "").length}
						</div>
					)}
				</div>
				{history.length > 0 && isDone && (
					<div className='mt-5 flex w-full flex-col items-center space-y-2 px-5'>
						<div className='flex w-full justify-end pr-6'>
							<ExportButton data={dataToShow} />
						</div>
						<div className='flex w-full flex-wrap justify-center'>
							{dataToShow.map((item) => (
								<CardHistory key={item.id} item={item} compactMode={compactMode} />
							))}
						</div>
					</div>
				)}
			</div>
		</>
	);
};
export default History;
