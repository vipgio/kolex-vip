import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { userId, page, type, categoryId, templateIds } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

	try {
		const getListed = async (jwt, userId, page, type, categoryId = 1, templateIds) => {
			const endpointRaw = `${API}/market/listed/users/${userId}?&page=${page}&categoryId=${categoryId}`;
			const endpoint = `${endpointRaw}${type ? `&type=${type}` : ""}${
				templateIds ? `&templateIds=${templateIds}` : ""
			}`;
			return http(endpoint, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": jwt,
				},
			});
		};
		const { data } = await getListed(jwt, userId, page, type, categoryId, templateIds);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
