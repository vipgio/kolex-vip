import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { userId, templateId, type } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
	try {
		const getCardTemplates = async (jwt, userId, templateId) => {
			return http(
				`${API}/collections/users/${userId}/card-templates/${templateId}/cards?categoryId=1`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-user-jwt": jwt,
					},
				}
			);
		};
		const getStickerTemplates = async (jwt, userId, templateId) => {
			return http(
				`${API}/collections/users/${userId}/sticker-templates/${templateId}/stickers?categoryId=1`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-user-jwt": jwt,
					},
				}
			);
		};
		const { data: cards } = await getCardTemplates(jwt, userId, templateId);
		const { data: stickers } = await getStickerTemplates(jwt, userId, templateId);
		const result = type === "card" ? cards : stickers;
		res.status(200).json(result);
	} catch (err) {
		console.log(err);
		res.status(err.response.status).json(err.response.data);
	}
}
