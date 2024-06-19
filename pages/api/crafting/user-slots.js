import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt, categoryId } = req.headers;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

	try {
		const getSlots = async (jwt, categoryId = 1) => {
			return http(`${API}/crafting/user-slots?categoryId=${categoryId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": jwt,
				},
			});
		};
		const { data } = await getSlots(jwt, categoryId);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
