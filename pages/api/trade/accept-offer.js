import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { tradeId } = req.body.data;
	if (req.method !== "PATCH")
		return res.status(405).json({ error: "Method not allowed" });

	try {
		const acceptTrade = async (jwt) => {
			return http(`${API}/trade/accept-offer?categoryId=1`, {
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
		const { data } = await acceptTrade(jwt);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
