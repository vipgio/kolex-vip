const dev = process.env.NODE_ENV !== "production";
export const server = dev ? "http://localhost:3001" : "https://kolex-vip.vercel.app";

const staging = false;
export const API = staging ? "https://api-staging1.epics.gg/api/v1" : "https://api.kolex.gg/api/v1";

export const CDN = "https://cdn.kolex.gg";

export const templateLimit = 40;

export const minPrice = 0.1;
export const maxPrice = 20000;

export const categories = [
	{ id: "1", name: "csgo", title: "CSGO", color: "rose" },
	{ id: "2", name: "streamers", title: "Streamers", color: "purple" },
	{ id: "4", name: "pubgm", title: "PUBG", color: "orange" },
	{ id: "40", name: "skgaming", title: "SK", color: "violet" },
	{ id: "73", name: "kingsleague", title: "Kings", color: "cyan" },
	{ id: "106", name: "hiroquest", title: "HiROQUEST", color: "emerald" },
];
