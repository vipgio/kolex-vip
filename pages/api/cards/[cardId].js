import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { cardId } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

	try {
		const getCardInfo = async (jwt, cardId) => {
			return http(`${API}/cards/${cardId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": jwt,
				},
			});
		};
		const { data } = await getCardInfo(jwt, cardId);
		res.status(200).json(data);
	} catch (err) {
		console.error(err);
		res.status(err.response.status).json(err.response.data);
	}
}
