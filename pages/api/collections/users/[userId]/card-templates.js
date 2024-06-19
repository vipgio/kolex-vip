import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { userId, templateId, type, categoryId } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
	try {
		const getCardTemplates = async (jwt, userId, templateId, categoryId = 1) => {
			return http(
				`${API}/collections/users/${userId}/card-templates/${templateId}/cards?categoryId=${categoryId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-user-jwt": jwt,
					},
				}
			);
		};
		const getStickerTemplates = async (jwt, userId, templateId, categoryId = 1) => {
			return http(
				`${API}/collections/users/${userId}/sticker-templates/${templateId}/stickers?categoryId=${categoryId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-user-jwt": jwt,
					},
				}
			);
		};
		const { data: cards } = await getCardTemplates(jwt, userId, templateId, categoryId);
		const { data: stickers } = await getStickerTemplates(jwt, userId, templateId, categoryId);
		const result = type === "card" ? cards : stickers;
		res.status(200).json(result);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
