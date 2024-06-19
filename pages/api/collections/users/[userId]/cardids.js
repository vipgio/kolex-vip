import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { userId, collectionId, categoryId } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
	try {
		const getCardIds = async (jwt, userId, collectionId, categoryId = 1) => {
			return http(
				`${API}/collections/users/${userId}/cardids?categoryId=${categoryId}&collectionId=${collectionId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-user-jwt": jwt,
					},
				}
			);
		};
		const getStickerIds = async (jwt, userId, collectionId, categoryId = 1) => {
			return http(
				`${API}/collections/users/${userId}/stickerids?categoryId=${categoryId}&collectionId=${collectionId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-user-jwt": jwt,
					},
				}
			);
		};
		const { data: cards } = await getCardIds(jwt, userId, collectionId, categoryId);
		const { data: stickers } = await getStickerIds(jwt, userId, collectionId, categoryId);
		const result = {
			success: cards.success && stickers.success,
			data: [...cards.data, ...stickers.data],
		};
		res.status(200).json(result);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
