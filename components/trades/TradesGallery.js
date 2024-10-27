import TradeCard from "@/components/trades/TradeCard";

const TradesGallery = ({ trades, user }) => {
	return (
		<div className='grid w-5/6 grid-cols-1 gap-5'>
			{trades.map((trade) => (
				<TradeCard trade={trade} userId={user.user.id} key={trade.id} />
			))}
		</div>
	);
};
export default TradesGallery;
