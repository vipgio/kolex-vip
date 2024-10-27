import { useEffect, useState } from "react";
import { useAxios } from "@/hooks/useAxios";
import LoadingSpin from "@/components/LoadingSpin";

const TradeCard = ({ trade, userId }) => {
	const { fetchData } = useAxios();
	const [templates, setTemplates] = useState([]);
	const [loading, setLoading] = useState(false);
	const [tradeDetails, setTradeDetails] = useState(trade);

	const me = Object.keys(tradeDetails).find(
		(key) => key.startsWith("user") && tradeDetails[key].id === userId
	);
	const them = Object.keys(tradeDetails).find(
		(key) => key.startsWith("user") && tradeDetails[key].id !== userId
	);

	const getTradeDetails = async () => {
		const { result, error } = await fetchData({
			endpoint: `/api/trade/${trade.id}`,
		});
		if (error) {
			console.error(error);
			return;
		}
		return result;
	};

	const getMarketInfo = async (items, page, type) => {
		const { result, error } = await fetchData({
			endpoint: `/api/market/templates`,
			params: {
				templateIds: items.join(","),
				type: type,
				page: page,
				price: "asc",
			},
			forceCategoryId: true,
		});
		if (error) {
			console.error(error);
			return;
		}
		if (result.templates.length > 0) getMarketInfo(items, page + 1, type);
		setTemplates((prev) => [...prev, ...result.templates]);
	};

	const getData = async () => {
		setLoading(true);
		const details = await getTradeDetails();
		const cards = [...details.user1.cards, ...details.user2.cards] ?? [];
		const stickers = [...details.user1.stickers, ...details.user2.stickers] ?? [];
		setTradeDetails(details);
		cards.length > 0 &&
			(await getMarketInfo(
				cards.map((card) => card.cardTemplateId),
				1,
				"card"
			));
		stickers.length > 0 &&
			(await getMarketInfo(
				stickers.map((sticker) => sticker.stickerTemplateId),
				1,
				"sticker"
			));
		setLoading(false);
	};

	return (
		<div>
			<div className='text-gray-custom mt-4 flex divide-x rounded border shadow-lg'>
				<TradeItems
					items={[...(tradeDetails[them].cards || []), ...(tradeDetails[them].stickers || [])]}
					templates={templates}
					title='You get'
					count={tradeDetails[them].count}
				/>
				<TradeItems
					items={[...(tradeDetails[me].cards || []), ...(tradeDetails[me].stickers || [])]}
					templates={templates}
					title='You give'
					count={tradeDetails[me].count}
				/>
			</div>
			<button className='text-gray-custom' onClick={getData}>
				{loading ? <LoadingSpin size={4} /> : "Fetch Data"}
			</button>
		</div>
	);
};
export default TradeCard;

const TradeItems = ({ items, templates, title, count }) => {
	const calculateTotal = () => {
		return items
			.reduce((sum, item) => {
				const priceStr =
					templates.find((template) => template.cardTemplate?.id === item.cardTemplateId)
						?.lowestPrice || "0";
				const price = parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
				return sum + price;
			}, 0)
			.toFixed(2);
	};

	return (
		<div className='flex w-1/2 flex-col items-center justify-between divide-y p-1'>
			<div className='h-12 w-full font-semibold'>
				{title} x{count}
			</div>
			<div className='h-full max-h-52 w-full overflow-auto p-2'>
				{items.map((item) => (
					<div key={item.id} className='flex'>
						<span className='mr-1 inline text-primary-500'>
							{item.mintBatch}
							{item.mintNumber}
						</span>
						{templates.find((template) => template.cardTemplate?.id === item.cardTemplateId)
							?.cardTemplate?.title || item.stickerTemplate?.title}
						{templates.find((template) => template.cardTemplate?.id === item.cardTemplateId)
							?.lowestPrice ? (
							<span className='ml-auto'>
								$
								{
									templates.find(
										(template) => template.cardTemplate?.id === item.cardTemplateId
									)?.lowestPrice
								}
							</span>
						) : (
							<></>
						)}
					</div>
				))}
			</div>
			<div className='flex w-full p-2'>
				{" "}
				Total:
				<span className='ml-auto'>${calculateTotal()}</span>
			</div>
		</div>
	);
};
