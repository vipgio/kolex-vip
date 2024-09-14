import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { pick } from "lodash";
import "react-toastify/dist/ReactToastify.css";
import { minPrice } from "@/config/config";
import { useAxios } from "@/hooks/useAxios";
import LoadingSpin from "@/components/LoadingSpin";
import Tooltip from "@/components/Tooltip";
import BigModal from "@/components/BigModal";
import DelisterTable from "./DelisterTable";
import Filters from "./Filters";
import fixDecimal from "@/utils/NumberUtils";

const Delister = ({ selectedTemplates, showModal, setShowModal, user }) => {
	const { fetchData, deleteData, patchData } = useAxios();
	const [loading, setLoading] = useState(false);
	const [cardDetails, setCardDetails] = useState([]);
	const [sortMethod, setSortMethod] = useState("mint");
	const [filter, setFilter] = useState({
		batch: "A",
		min: 1,
		max: 50000,
		undercut: false,
	});
	const finished = useRef(false);

	const controller = new AbortController();
	useEffect(() => {
		setLoading(true);
		let isApiSubscribed = true;
		setCardDetails([]);
		const initialFetch = async () => {
			await Promise.all(
				selectedTemplates.map(async (template) => {
					const data = isApiSubscribed && (await getListingDetails(template.id, 1, template.type, controller));
					if (data && data.length > 0) {
						setCardDetails((prev) => [
							...prev,
							...data.map((item) => ({
								...item,
								card: {
									...pick(item.card, [
										"mintBatch",
										"mintNumber",
										"cardTemplateId",
										"id",
										"marketId",
										"signatureImage",
										"status",
										"type",
										"uuid",
									]),
									title: selectedTemplates.find((template) => template.id === item.card.cardTemplateId)?.title,
									inCirculation: selectedTemplates.find((template) => template.id === item.card.cardTemplateId)
										?.inCirculation,
									floor: selectedTemplates.find((template) => template.id === item.card.cardTemplateId)?.floor,
								},
							})),
						]);
					}
				})
			);
			setLoading(false);
		};
		initialFetch();
		return () => {
			controller.abort();
			isApiSubscribed = false;
			finished.current = true;
		};
	}, []);

	const getListingDetails = async (templateId, page, type, controller) => {
		let allData = [];
		let count = 1;
		while (count > 0 && !finished.current) {
			const { result, error } = await fetchData({
				endpoint: `/api/market/listed/users/${user.user.id}`,
				params: {
					type,
					page,
					templateIds: templateId,
				},
				controller,
				forceCategoryId: true,
			});
			if (error) {
				console.error(error);
				return;
			}
			allData.push(...result.market);
			count = result.count;
			page++;
		}
		return allData;
	};

	const removeAllItems = async () => {
		setLoading(true);
		let counter = 0;
		const allMarketIds = cardDetails
			.filter(
				(item) =>
					(filter.batch === "any" || item.card.mintBatch === filter.batch) &&
					item.card.mintNumber <= filter.max &&
					item.card.mintNumber >= filter.min
			)
			.filter((item) => (filter.undercut ? item.price > item.floor : true))
			.map((item) => item.marketId);
		for await (const marketId of allMarketIds) {
			const { result, error } = await handleDelete(marketId);
			if (result && result.success) {
				counter++;
				toast.isActive("success")
					? toast.update("success", {
							render: `Removed ${counter}x ${counter === 1 ? "item" : "items"} from the market!`,
					  })
					: toast.success(`Removed ${counter}x ${counter === 1 ? "item" : "items"} from the market!`, {
							toastId: "success",
					  });
			}
			if (error) {
				console.error(error);
				toast.error(`${error.response.data.error}`, {
					toastId: item.marketId,
				});
			}
		}
		setLoading(false);
	};

	const updateToFloor = async () => {
		setLoading(true);
		let counter = 0;
		for await (const item of cardDetails
			.filter(
				(item) =>
					(filter.batch === "any" || item.card.mintBatch === filter.batch) &&
					item.card.mintNumber <= filter.max &&
					item.card.mintNumber >= filter.min
			)
			.filter((item) => (filter.undercut ? item.price > item.card.floor : true))) {
			const newPrice = Math.max(fixDecimal(item.card.floor - 0.01), minPrice).toString();
			if (newPrice === item.price) continue;
			const { result, error } = await handleUpdate(item.marketId, newPrice);
			if (result && result.success) {
				counter++;
				toast.isActive("success")
					? toast.update("success", {
							render: `Updated the price of ${counter}x ${counter === 1 ? "item" : "items"} to $${newPrice}!`,
					  })
					: toast.success(
							`Updated the price of ${counter}x ${counter === 1 ? "item" : "items"} to $${newPrice}!`,
							{
								toastId: "success",
							}
					  );
			}
			if (error) {
				console.error(error);
				toast.error(`${error.response.data.error}`, {
					toastId: item.marketId,
				});
			}
		}
		setLoading(false);
	};

	const handleDelete = async (marketId) => {
		const { result, error } = await deleteData(`/api/market/listed/${marketId}`);
		if (error) {
			console.error(error);
			toast.error(`${error.response.data.error}`, {
				toastId: marketId,
			});
		}
		return { result, error };
	};

	const handleUpdate = async (marketId, newPrice) => {
		const { result, error } = await patchData(`/api/market/listed/${marketId}`, {
			price: newPrice,
			minOffer: null,
		});
		if (error) {
			console.error(error);
			toast.error(`${error.response.data.error}`, {
				toastId: marketId,
			});
		}
		return { result, error };
	};

	return (
		<BigModal
			header='Listed Items'
			showModal={showModal}
			setShowModal={setShowModal}
			loading={loading}
			extraStyle='h-fit my-auto'
			hasToast={true}
			escapeClose={true}
		>
			{cardDetails.length > 0 ? (
				<>
					<div className='flex h-fit border border-gray-700 p-1 dark:border-gray-500'>
						<Filters filter={filter} setFilter={setFilter} setSortMethod={setSortMethod} />
					</div>
					<div className='overflow-auto'>
						<DelisterTable
							listed={cardDetails}
							setListed={setCardDetails}
							selectedTemplates={selectedTemplates}
							sortMethod={sortMethod}
							setSortMethod={setSortMethod}
							loading={loading}
							setLoading={setLoading}
							handleDelete={handleDelete}
							handleUpdate={handleUpdate}
							filter={filter}
						/>
					</div>

					<div className='flex border-t border-gray-400 p-3 dark:border-gray-200'>
						<div className='flex items-center'>
							<button onClick={updateToFloor} className='button font-semibold' disabled={loading}>
								{loading ? <LoadingSpin size={4} /> : "Update to floor"}
							</button>
							<Tooltip
								text='Sets [floor price - 0.01] as price for every item'
								direction='right'
								mode='light'
							/>
						</div>

						<div className='ml-auto flex items-center sm:mb-0'>
							<button onClick={removeAllItems} className='button' disabled={loading}>
								{loading ? <LoadingSpin size={4} /> : "Remove all"}
							</button>
						</div>
					</div>
				</>
			) : (
				!loading && (
					<div className='text-gray-custom flex justify-center p-1 text-lg font-semibold'>No items found</div>
				)
			)}
		</BigModal>
	);
};
export default Delister;
