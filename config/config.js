const dev = process.env.NODE_ENV !== "production";
export const server = dev ? "http://localhost:3001" : "https://kolex-vip.vercel.app";

const staging = false;
export const API = staging ? "https://api-staging1.epics.gg/api/v1" : "https://api.kolex.gg/api/v1";

export const CDN = "https://cdn.kolex.gg";

export const webApp = "https://kolex.gg";

export const templateLimit = 40;

export const minPrice = 0.1;
export const maxPrice = 20000;

export const categories = [
	{ id: "1", name: "csgo", title: "CSGO", color: "rose" },
	{ id: "2", name: "streamers", title: "Streamers", color: "purple" },
	{ id: "4", name: "pubgm", title: "PUBG", color: "orange" },
	// { id: "40", name: "skgaming", title: "SK", color: "violet" },
	{ id: "73", name: "kingsleague", title: "Kings", color: "cyan" },
	{ id: "106", name: "hiroquest", title: "HiROQUEST", color: "emerald" },
	{ id: "107", name: "csc", title: "CS China", color: "red" },
];

export const historyEvents = {
	pack: () => "opened from a pack.",
	spinner: () => "received the item from the spinner.",
	craft: () => "received the item from a craft.",
	achievement: () => "received the item from an achievement.",
	"qr-claim": () => "acquired from a QR code redemption.",
	"imx-locked": () => "transferred the item to Immutable.",
	"imx-unlocked": () => "transferred the item to Kolex.",
	"eth-owner-update": () => "Ethereum item ownership updated.",
	"eth-locked": () => "Ethereum token trading disabled.",
	gift: () => "received the item from an airdrop.",
	trade: (event) => (
		<>
			received the item from{" "}
			<span className='font-medium text-red-400'>{event.sender.username || "null"} </span>
			in a trade.
		</>
	),
	market: (event) => (
		<>
			purchased the item from{" "}
			<span className='font-medium text-red-400'>{event.sender.username || "null"}</span> for{" "}
			<span>{event.value}</span> {event.costType === "usd" ? "USD" : "coins"}.
		</>
	),
	"imx-market": (event) => (
		<>
			{event.receiver ? (
				<>
					purchased the item from Immutable for
					{event.value > 0 && (
						<>
							<span className='ml-1 font-semibold text-red-500'>{event.value}</span>
							ETH.
						</>
					)}
				</>
			) : (
				<>
					sold the item on Immutable for
					{event.value > 0 && (
						<>
							<span className='ml-1 font-semibold text-red-500'>{event.value}</span>
							ETH.
						</>
					)}
				</>
			)}
		</>
	),
	"level-upgrade": (event) => (
		<>
			upgraded the card to level <span className='font-medium text-red-400'>{event.value}</span>.
		</>
	),
};
