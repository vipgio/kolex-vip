import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { amount, categoryId } = req.body;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		const buySpin = async (jwt, amount, categoryId = 1) => {
			return http(`${API}/spinner/buy-spin?categoryId=${categoryId}`, {
				method: "POST",
				headers: {
					"x-user-jwt": jwt,
				},
				data: {
					amount: amount,
				},
			});
		};
		const { data } = await buySpin(jwt, amount, categoryId);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
