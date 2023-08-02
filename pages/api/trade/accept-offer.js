import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { tradeId, categoryId } = req.body.data;
	if (req.method !== "PATCH")
		return res.status(405).json({ error: "Method not allowed" });

	try {
		const acceptTrade = async (jwt, categoryId = 1) => {
			return http(`${API}/trade/accept-offer?categoryId=${categoryId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": jwt,
				},
				data: {
					tradeId: tradeId,
				},
			});
		};
		const { data } = await acceptTrade(jwt, categoryId);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
