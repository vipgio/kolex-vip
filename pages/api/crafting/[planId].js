import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { planId, categoryId } = req.query;
	const payload = req.body;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		const doCraft = async (jwt, planId, payload, categoryId = 1) => {
			return http(`${API}/crafting/plans/${planId}?categoryId=${categoryId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": jwt,
				},
				data: payload,
			});
		};
		const { data } = await doCraft(jwt, planId, payload, categoryId);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
