import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { price, page, type, templateIds, collectionIds, categoryId } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
	try {
		const getMarketInfo = async (jwt, price, page, type, templateIds, collectionIds, categoryId = 1) => {
			return http(
				`${API}/market/templates?page=${page}&price=${price}&templateIds=${templateIds}&type=${type}&categoryId=${categoryId}&collectionIds=${collectionIds}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-user-jwt": jwt,
					},
				}
			);
		};
		const { data } = await getMarketInfo(jwt, price, page, type, templateIds, collectionIds, categoryId);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
