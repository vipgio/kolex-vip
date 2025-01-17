import { API } from "@/config/config";

import http from "@/utils/httpClient";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { categoryId } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

	try {
		const getInfo = async (jwt, categoryId = 1) => {
			return http(`${API}/spinner/?categoryId=${categoryId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": jwt,
				},
			});
		};
		const { data } = await getInfo(jwt, categoryId);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
