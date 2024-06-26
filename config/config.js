const dev = process.env.NODE_ENV !== "production";
export const server = dev ? "http://localhost:3001" : "https://kolex-vip.vercel.app";

const staging = false;
export const API = staging ? "https://api-staging1.epics.gg/api/v1" : "https://api.kolex.gg/api/v1";

export const CDN = "https://cdn.kolex.gg";

export const templateLimit = 40;

export const minPrice = 0.1;
export const maxPrice = 20000;

export const links = {
	1: "csgo",
	2: "streamers",
	4: "pubgm",
	40: "skgaming",
};
