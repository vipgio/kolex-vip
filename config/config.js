const dev = process.env.NODE_ENV !== "production";
export const server = dev ? "http://localhost:3001" : "https://kolex-vip.vercel.app";

const staging = false;
export const API = staging
	? "https://api-staging1.epics.gg/api/v1"
	: "https://api.kolex.gg/api/v1";

export const CDN = "https://cdn.epics.gg";

export const minPrice = 0.1;
export const maxPrice = 20000;
