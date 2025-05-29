const dev = process.env.NODE_ENV !== "production";
export const server = dev ? "http://localhost:3001" : "https://kolex-vip.vercel.app";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const staging = false;
export const API = staging ? "https://api-staging1.epics.gg/api/v1" : "https://api.kolex.gg/api/v1";

export const CDN = "https://cdn.kolex.gg";

export const webApp = "https://kolex.gg";

export const githubLink = "https://github.com/vipgio/kolex-vip";

export const discordLink = "https://discordapp.com/users/473436055958192128";

export const extensionChrome =
	"https://chromewebstore.google.com/detail/kolex-vip/jegjeaelpabneacnegnmbgpidlinkhbh";

export const extensionFirefox = "https://addons.mozilla.org/en-US/firefox/addon/kolex-vip/";

export const templateLimit = 40;

export const minPrice = 0.1;
export const maxPrice = 20000;

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
			<span className='font-medium text-red-400'>{event.sender.username || "?"} </span>
			in a trade.
		</>
	),
	market: (event) => (
		<>
			purchased the item from{" "}
			<span className='font-medium text-red-400'>{event.sender.username || "?"}</span> for{" "}
			<span>{event.value}</span> {event.costType === "usd" ? "USD" : "coins"}.
		</>
	),
	transfer: () => "received the item from the migration.",
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

export const excludedFeatures = [
	{ id: 1, name: "cs", excluded: ["spinner", "crafting"] },
	{ id: 2, name: "streamers", excluded: ["spinner", "crafting", "rush"] },
	{ id: 4, name: "pubgm", excluded: ["spinner", "crafting", "rush"] },
	{ id: 73, name: "kingsleague", excluded: ["spinner", "crafting", "rush"] },
	{ id: 40, name: "skgaming", excluded: ["spinner", "crafting", "rush", "packmanager", "packs"] },
	{ id: 107, name: "csc", excluded: ["spinner", "crafting", "rush", "packmanager", "packs"] },
	{ id: 106, name: "hiroquest", excluded: ["spinner", "crafting", "rush", "packmanager", "packs"] },
	{ id: 172, name: "hro", excluded: ["spinner", "crafting", "rush"] },
];
