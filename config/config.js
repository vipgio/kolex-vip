const dev = process.env.NODE_ENV !== "production";
export const server = dev ? "http://localhost:3000" : "https://kolex-vip.vercel.app";

export const API = "https://api.epics.gg/api/v1";

export const CDN = "https://cdn.epics.gg";
