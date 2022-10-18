import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import sortBy from "lodash/sortBy";
import LoadingSpin from "@/components/LoadingSpin";
import Tooltip from "@/components/Tooltip";
import ItemBox from "./ItemBox";
import "react-toastify/dist/ReactToastify.css";

const AdvancedModal = ({ selectedTemplates, setShowAdvancedModal, user, templates }) => {
	const [loading, setLoading] = useState(false);
	const [cardDetails, setCardDetails] = useState([]);
	const [insertFloor, setInsertFloor] = useState(0);
	const [listingDetails, setListingDetails] = useState({});

	useEffect(() => {
		let isApiSubscribed = true;
		setCardDetails([]);
		selectedTemplates.map(async (template) => {
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
								cardTemplateId: item.cardTemplateId,
								id: item.id,
								signatureImage: item.signatureImage,
								type: item.type === "card" ? "card" : "sticker",
								mintNumber: item.mintNumber,
								mintBatch: item.mintBatch,
								status: item.status,
							};
						})
						.filter((item) => item.status === "available");
					setCardDetails((prev) => [
						...prev,
						{
							...template,
							cards: sortBy(strippedCards, ["mintBatch", "mintNumber"]),
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
		});
		return () => {
			isApiSubscribed = false;
		};
	}, []);

	const listAll = async () => {
		setLoading(true);
		for await (const template of Object.entries(listingDetails)) {
			let counter = 0;
			for await (const item of template[1]) {
				try {
					const { data } = await axios.post(
						`/api/market/list/${item.id}`,
						{
							data: {
								price: item.price,
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
						const title = templates.find((o) => o.id === Number(template[0])).title;
						counter++;
						counter === 1
							? toast.success(
									`Listed ${counter}x ${title} on the market for $${template[1][0].price}!`,
									{
										toastId: template[0],
									}
							  )
							: toast.update(template[0], {
									render: `Listed ${counter}x ${title} on the market for $${template[1][0].price}!`,
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
						className='absolute right-0 top-0 h-12 w-12 p-1 text-gray-800 transition-colors duration-300 hover:cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300 active:bg-indigo-300 active:text-orange-400 dark:text-gray-200 dark:hover:bg-gray-700'
						onClick={() => {
							setShowAdvancedModal(false);
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
				<div className='relative grid max-h-[30rem] overflow-auto p-2 sm:grid-cols-2'>
					{cardDetails.map((template) => (
						<ItemBox
							template={template}
							key={template.id}
							user={user}
							insertFloor={insertFloor}
							listingDetails={listingDetails}
							setListingDetails={setListingDetails}
						/>
					))}
				</div>
				<div className='flex border-t border-gray-400 p-3 dark:border-gray-200'>
					<div className='ml-1 flex items-center'>
						<button
							onClick={() => setInsertFloor((prev) => prev + 1)}
							className='cursor-pointer rounded-md border border-gray-800 px-3 py-2 text-center text-gray-700 shadow-lg transition-colors hover:bg-gray-300 hover:text-gray-800 active:bg-gray-400 dark:border-gray-200 dark:text-gray-300 dark:hover:text-gray-800'
						>
							Floor
						</button>
						<Tooltip
							text='Inserts [floor price - 0.01] as price for every item'
							direction='right'
							mode='light'
						/>
					</div>

					<div className='ml-auto sm:mb-0'>
						<button onClick={listAll} className='button mb-2 sm:mb-0'>
							{loading ? <LoadingSpin size={4} /> : "List items"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default AdvancedModal;
