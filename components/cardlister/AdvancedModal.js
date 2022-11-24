import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import sortBy from "lodash/sortBy";
import LoadingSpin from "@/components/LoadingSpin";
import Tooltip from "@/components/Tooltip";
import ItemBox from "./ItemBox";
import "react-toastify/dist/ReactToastify.css";
import BigModal from "../BigModal";

const AdvancedModal = ({
	selectedTemplates,
	showModal,
	setShowModal,
	user,
	templates,
}) => {
	const [loading, setLoading] = useState(false);
	const [cardDetails, setCardDetails] = useState([]);
	const [insertFloor, setInsertFloor] = useState(0);
	const [listingDetails, setListingDetails] = useState({});

	useEffect(() => {
		let isApiSubscribed = true;
		const controller = new AbortController();
		setCardDetails([]);
		selectedTemplates.map(async (template) => {
			const fetchData = async () => {
				const data = await getCardTemplates(
					user.user.id,
					template.id,
					template.cardType ? "card" : "sticker",
					controller
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
			controller.abort();
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

	const getCardTemplates = async (userId, templateId, type, controller) => {
		const { data } = await axios.get(`/api/collections/users/${userId}/card-templates`, {
			signal: controller.signal,
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
		<BigModal
			header='Items'
			showModal={showModal}
			setShowModal={setShowModal}
			loading={cardDetails.length < selectedTemplates.length}
			extraStyle='h-fit my-auto'
			hasToast={true}
		>
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
						className='simple-button font-semibold'
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
		</BigModal>
	);
};
export default AdvancedModal;
