import { toast } from "react-toastify";
import { webApp } from "@/config/config";
import { useAxios } from "hooks/useAxios";
import LoadingSpin from "../LoadingSpin";

const PurchaseRow = ({ item, loading, setLoading }) => {
	const { postData } = useAxios();

	const buyItem = async () => {
		setLoading(true);
		const { error, info } = await postData("/api/market/buy", {
			id: item.marketId,
			price: item.price,
		});

		if (info?.success) {
			toast.success(`Purchased ${item.pack.packTemplate.name} for ${item.price}!\n`, {
				toastId: item.marketId,
				autoClose: 3000,
				position: "top-left",
			});
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

	return (
		<>
			<tr className='border-b border-gray-300 bg-gray-100 text-center text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600'>
				<td className='py-1 px-2 sm:py-3 sm:px-6'>
					<a
						target='_blank'
						href={`${webApp}/user/${item.user.username}`}
						rel='noopener noreferrer'
						className='underline hover:text-primary-500'
					>
						{item.user.username}
					</a>
				</td>
				<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.pack.packTemplate.name}</td>
				<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.price}</td>
				<td className='hidden h-full min-w-[10rem] items-end py-1 px-2 sm:table-cell sm:py-3 sm:px-6'>
					{item.minOffer ? `$${item.minOffer}` : "-"}
				</td>
				<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.pack.created.split("T")[0]}</td>
				<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.created.split("T")[0]}</td>
				<td>
					<button onClick={buyItem} title='Quick buy' className='simple-button p-0.5'>
						{loading ? <LoadingSpin size={4} /> : "Buy"}
					</button>
				</td>
			</tr>
		</>
	);
};
export default PurchaseRow;
