import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { packId, categoryId, page } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
	try {
		const getMarketInfo = async (jwt, packId, categoryId = 1, page = 1) => {
			return http(
				`${API}/market/buy?page=${page}&sort=price&templateId=${packId}&type=pack&categoryId=${categoryId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-user-jwt": jwt,
					},
				}
			);
		};
		const { data } = await getMarketInfo(jwt, packId, categoryId, page);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
