import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import sortBy from "lodash/sortBy";
import isEqual from "lodash/isEqual";
import uniqBy from "lodash/uniqBy";
import min from "lodash/min";
import max from "lodash/max";
import LoadingSpin from "@/components/LoadingSpin";
import Tooltip from "@/components/Tooltip";
import "react-toastify/dist/ReactToastify.css";

const SimpleModal = ({ selectedTemplates, setShowSimpleModal, user, templates }) => {
	const [loading, setLoading] = useState(false);
	const [selectedCards, setSelectedCards] = useState([]);
	const [cardDetails, setCardDetails] = useState([]);
	const [price, setPrice] = useState(0);
	const defaultFilters = {
		batch: "",
		max: 1,
		min: 1,
	};
	const [filters, setFilters] = useState(defaultFilters);

	const availableBatches = //get mint batches
		cardDetails.length > 0 &&
		uniqBy(cardDetails.map((item) => item.cards).flat(), "mintBatch")
			.map((o) => o.mintBatch)
			.sort()
			.reverse();

	useEffect(() => {
		//filter based on mint range
		if (!isEqual(defaultFilters, filters)) {
			setSelectedCards(
				cardDetails
					.map((item) =>
						item.cards.filter(
							(card) =>
								card.mintBatch === filters.batch &&
								card.mintNumber >= filters.min &&
								card.mintNumber <= filters.max
						)
					)
					.flat()
			);
		}
	}, [filters]);

	useEffect(() => {
		//fetch owned cards
		let isApiSubscribed = true;
		setCardDetails([]);
		setLoading(true);
		for (const template of selectedTemplates) {
			const fetchData = async () => {
				const data = await getCardTemplates(
					user.user.id,
					template.id,
					template.cardType ? "card" : "sticker"
				);
				if (data.success) {
					const strippedCards = data.data
						.map((item) => {
							return {
								entityTemplateId: template.id,
								id: item.id,
								signatureImage: item.signatureImage,
								type: item.type === "card" ? "card" : "sticker",
								mintNumber: item.mintNumber,
								mintBatch: item.mintBatch,
								status: item.status,
								title: template.title,
							};
						})
						.filter((item) => item.status === "available");
					setCardDetails((prev) => [
						...prev,
						{
							...template,
							cards: sortBy(strippedCards, ["mintBatch", "mintNumber"]).reverse(),
						},
					]);
				}
			};
			if (isApiSubscribed) {
				try {
					fetchData();
				} catch (err) {
					console.log(err);
				}
			}
		}
		setLoading(false);

		return () => {
			isApiSubscribed = false;
		};
	}, []);

	const listAll = async () => {
		setLoading(true);
		let counter = 0;
		for await (const item of selectedCards) {
			try {
				const { data } = await axios.post(
					`/api/market/list/${item.id}`,
					{
						data: {
							price: price,
							type: item.type,
						},
					},
					{
						headers: {
							jwt: user.jwt,
						},
					}
				);
				if (data.success) {
					counter++;
					counter === 1
						? toast.success(`Listed ${counter}x item on the market for $${price}!`, {
								toastId: "success",
						  })
						: toast.update("success", {
								render: `Listed ${counter}x items on the market for $${price}!`,
						  });
				}
			} catch (err) {
				console.log(err);
				toast.error(`Failed to list item with id: ${item.id}`, { toastId: item.id });
				toast.error(err.response.data.error, {
					toastId: err.response.data.errorCode,
				});
			}
		}

		setLoading(false);
	};

	const getCardTemplates = async (userId, templateId, type) => {
		const { data } = await axios.get(`/api/collections/users/${userId}/card-templates`, {
			params: {
				templateId: templateId,
				type: type,
			},
			headers: {
				jwt: user.jwt,
			},
		});
		return data;
	};

	return (
		<div className='fixed inset-0 z-30 flex flex-col items-center justify-center overscroll-none bg-black/90'>
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
			<div className='absolute inset-0 z-20 my-auto mx-8 flex h-fit max-h-[90vh] flex-col overflow-hidden overscroll-none rounded-md bg-gray-100 dark:bg-gray-900 sm:mx-16'>
				<div
					className='relative flex h-12 w-full items-center border-b border-b-white/10 bg-gray-300 dark:bg-gray-800' /*modal header*/
				>
					<h1 className='mx-auto py-2 text-3xl text-gray-800 dark:text-gray-200'>
						{cardDetails.length < selectedTemplates.length ? <LoadingSpin /> : "Items"}
					</h1>
					<button
						className='absolute right-0 top-0 h-12 w-12 p-1 text-gray-900 transition-colors duration-300 hover:cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300 active:bg-indigo-300 active:text-orange-400 dark:text-gray-200 dark:hover:bg-gray-700'
						onClick={() => {
							setShowSimpleModal(false);
						}}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							strokeWidth={2}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>
				<div className='flex w-full border border-gray-400'>
					<div className='max-h-96 w-1/2 divide-y divide-gray-500 overflow-auto p-1 text-gray-900 dark:text-gray-200'>
						{cardDetails &&
							cardDetails.map((item) => (
								<div key={item.id} className='flex'>
									<span className='ml-1'>{item.title}</span>
									<span className='ml-auto mr-1 self-center text-orange-500'>
										x{item.cards?.length}
									</span>
								</div>
							))}
					</div>
					<div className='w-1/2 border-l border-gray-400'>
						{" "}
						{/* right half, inputs */}
						<div className='flex flex-col p-1 text-gray-900 dark:text-gray-200'>
							<div>
								<span className='text-orange-500'>A) </span>
								Choose a mint range:
							</div>
							<div>
								<label htmlFor='batch'>Batch:</label>
								<select
									name='batch'
									id='batch'
									value={filters.batch}
									disabled={cardDetails.length !== selectedTemplates.length}
									className='diasbled:opacity-50 mx-2 my-1 rounded-md border border-gray-800 p-1 text-gray-900 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:cursor-not-allowed sm:mb-0'
									onChange={(e) =>
										setFilters((prev) => ({
											...prev,
											batch: e.target.value,
										}))
									}
								>
									<option value=''> </option>
									{availableBatches &&
										availableBatches.map((batch) => (
											<option value={batch} key={batch}>
												{batch}
											</option>
										))}
								</select>
							</div>
							<div>
								<label htmlFor='max'>Highest mint:</label>
								<input
									type='number'
									name='max'
									id='max'
									min={1}
									max={30000}
									value={filters.max}
									disabled={cardDetails.length !== selectedTemplates.length}
									className='diasbled:opacity-50 input-field my-1 ml-1 w-24 disabled:hover:cursor-not-allowed'
									onChange={(e) =>
										setFilters((prev) => ({ ...prev, max: e.target.value }))
									}
								/>
							</div>
							<div>
								<label htmlFor='min'>Lowest mint:</label>
								<input
									type='number'
									name='min'
									id='min'
									min={1}
									max={30000}
									value={filters.min}
									disabled={cardDetails.length !== selectedTemplates.length}
									className='diasbled:opacity-50 input-field my-1 ml-1 w-24 disabled:hover:cursor-not-allowed'
									onChange={(e) =>
										setFilters((prev) => ({ ...prev, min: e.target.value }))
									}
								/>
							</div>
						</div>
						<div className='relative z-10 overflow-hidden text-center text-xl text-gray-900 before:absolute before:top-1/2 before:ml-[-44%] before:h-px before:w-5/12 before:bg-gray-400 before:text-right before:content-[""] after:absolute after:top-1/2 after:ml-[2%] after:h-px after:w-5/12 after:bg-gray-400 after:content-["\a0"] dark:text-gray-100'>
							OR
						</div>
						<div className='flex flex-col p-1 text-gray-900 dark:text-gray-200'>
							<div>
								<span className='text-orange-500'>B) </span>
								{selectedTemplates.length === 1
									? "Enter the number of cards:"
									: "Enter the number of sets:"}
							</div>
							<div className='flex flex-col'>
								<div className='flex items-center'>
									<label htmlFor='count' className='mr-1'>
										{selectedTemplates.length === 1 ? "Cards:" : "Sets:"}
									</label>
									<input
										type='number'
										name='count'
										id='count'
										min={0}
										max={min(cardDetails.map((item) => item.cards.length))}
										disabled={cardDetails.length !== selectedTemplates.length}
										className='diasbled:opacity-50 input-field my-1 w-24 disabled:hover:cursor-not-allowed'
										onChange={(e) => {
											setFilters(defaultFilters);
											setSelectedCards([
												...cardDetails
													.map((template) => template.cards.slice(0, e.target.value))
													.flat(),
											]);
										}}
									/>
									<span>
										<Tooltip
											text='Picks the worst mints for each item'
											direction='right'
											mode='light'
										/>
									</span>
								</div>
								<div>Max: {min(cardDetails.map((item) => item.cards.length))}</div>
							</div>
						</div>
					</div>
				</div>

				<div className='ml-1 p-1 text-gray-900 dark:text-gray-200'>
					<div>
						Floor range:{" "}
						<span>
							${min(selectedTemplates.map((item) => Number(item.floor)).filter((o) => o))}
						</span>
						{" - "}
						<span>
							${max(selectedTemplates.map((item) => Number(item.floor)).filter((o) => o))}
						</span>
					</div>
				</div>

				<div className='flex border-t border-gray-400 p-2 dark:border-gray-200'>
					<div className='mt-2 flex flex-col sm:mt-0'>
						<div className='mb-1 flex items-center'>
							<label htmlFor='price' className='text-gray-800 dark:text-gray-200'>
								Price:
							</label>
							<input
								type='number'
								name='price'
								id='price'
								min={0.1}
								max={20000}
								step={0.01}
								className='input-field ml-1'
								onChange={(e) => setPrice(e.target.value)}
							/>
						</div>
						<div className='text-orange-500'>Count: {selectedCards.length}</div>
					</div>
					<div className='ml-auto mr-2 mt-2 self-center sm:mt-0 sm:mb-0'>
						<button
							disabled={
								cardDetails.length !== selectedTemplates.length ||
								!price ||
								!selectedCards.length
							}
							onClick={listAll}
							className='button sm:mb-0'
						>
							{loading ? <LoadingSpin size={4} /> : "List items"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default SimpleModal;
