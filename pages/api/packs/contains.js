import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { templateIds, categoryId, page } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

	try {
		const contains = async (jwt, templateIds, categoryId = 1, page = 1) => {
			return http(
				`${API}/packs/contains?cardTemplateIds=${templateIds}&page=${page}&categoryId=${categoryId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-user-jwt": jwt,
					},
				}
			);
		};
		const { data } = await contains(jwt, templateIds, categoryId, page);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
