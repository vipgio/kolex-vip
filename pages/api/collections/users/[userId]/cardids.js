import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { userId, collectionId } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
	try {
		const getCardIds = async (jwt, userId, collectionId) => {
			return http(
				`${API}/collections/users/${userId}/cardids?categoryId=1&collectionId=${collectionId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-user-jwt": jwt,
					},
				}
			);
		};
		const getStickerIds = async (jwt, userId, collectionId) => {
			return http(
				`${API}/collections/users/${userId}/stickerids?categoryId=1&collectionId=${collectionId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-user-jwt": jwt,
					},
				}
			);
		};
		const { data: cards } = await getCardIds(jwt, userId, collectionId);
		const { data: stickers } = await getStickerIds(jwt, userId, collectionId);
		const result = {
			success: cards.success && stickers.success,
			data: [...cards.data, ...stickers.data],
		};
		res.status(200).json(result);
	} catch (err) {
		console.log(err);
		res.status(err.response.status).json(err.response.data);
	}
}
