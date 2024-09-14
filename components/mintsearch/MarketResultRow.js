import { useState } from "react";
import { toast } from "react-toastify";
import { FaSignature, FaLock, FaHistory } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { webApp } from "@/config/config";
import { useAxios } from "@/hooks/useAxios";
import HistoryModal from "../HistoryModal";
import LoadingSpin from "../LoadingSpin";

const MarketResultRow = ({ item, allowed }) => {
	const [showHistory, setShowHistory] = useState(false);
	const [loading, setLoading] = useState(false);
	const { postData } = useAxios();

	const buyItem = async () => {
		setLoading(true);
		const { error, info } = await postData("/api/market/buy", {
			id: item.marketId,
			price: item.price,
		});

		if (info?.success) {
			toast.success(
				`Purchased ${item[item.type].mintBatch}${item[item.type].mintNumber} ${item.title} for ${
					item.price
				}!\n`,
				{ toastId: item.marketId, autoClose: 3000, position: "top-left" }
			);
		} else {
			toast.error(
				error.response.data.errorCode === "market_price_changed"
					? "Market price changed!"
					: error.response.data.error,
				{
					toastId: item.marketId,
					autoClose: 3000,
					position: "top-left",
				}
			);
		}
		setLoading(false);
	};

	const openModal = () => {
		setShowHistory(true);
	};

	return (
		<tr className='text-gray-custom border-b border-gray-300 bg-gray-100 text-center hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'>
			{item.card ? (
				<td
					className={`table-cell ${item.card.signatureImage ? "text-yellow-500" : ""}`}
					title={item.card.signatureImage && "Signed"}
				>
					<div className='flex items-center justify-center'>
						{item.card.signatureImage && <FaSignature className='mr-2' />}
						{item.card.mintBatch}
						{item.card.mintNumber}
					</div>
				</td>
			) : (
				<td className='table-cell'>
					{item.sticker.mintBatch}
					{item.sticker.mintNumber}
				</td>
			)}
			<td className='table-cell min-w-[10rem]'>{item.title}</td>
			<td className='table-cell'>${item.price}</td>
			<td className='hidden h-full min-w-[10rem] items-end py-1 px-2 sm:table-cell sm:py-3 sm:px-6'>
				{item.minOffer ? `$${item.minOffer}` : "-"}
			</td>
			<td className='table-cell'>{item.delta > 0 ? `+${item.delta}` : 0}</td>
			<td className='table-cell'>
				<a
					target='_blank'
					href={`${webApp}/user/${item.user.username}`}
					rel='noopener noreferrer'
					className='underline hover:text-primary-500'
				>
					{item.user.username}
				</a>
			</td>
			<td className='table-cell'>
				<a
					href={`${webApp}/${item.type}/${item.templateUUID}/${item.uuid}`}
					target='_blank'
					rel='noopener noreferrer'
					className='text-primary-500 underline'
				>
					Click
				</a>
			</td>
			<td className='table-cell'>
				<div className='relative flex h-8 items-center justify-center'>
					{allowed ? (
						item.type === "card" ? (
							<HistoryModal
								data={item}
								isOpen={showHistory}
								setIsOpen={setShowHistory}
								type='card'
								method='uuid'
							/>
						) : item.type === "sticker" ? (
							<HistoryModal data={item} isOpen={showHistory} setIsOpen={setShowHistory} type='sticker' />
						) : (
							<button onClick={openModal}>
								<FaHistory />
							</button>
						)
					) : (
						<FaLock className='cursor-not-allowed' title='You need history access for this feature' />
					)}
				</div>
			</td>
			<td className='table-cell'>
				<button onClick={buyItem} title='Quick buy' className='simple-button p-0.5'>
					{loading ? <LoadingSpin size={4} /> : "Buy"}
				</button>
			</td>
		</tr>
	);
};
export default MarketResultRow;
