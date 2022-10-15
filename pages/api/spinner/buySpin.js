import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { amount } = req.body.data;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		const buySpin = async (jwt, amount) => {
			return http(`${API}/spinner/buy-spin?categoryId=1`, {
				method: "POST",
				headers: {
					"x-user-jwt": jwt,
				},
				data: {
					amount: amount,
				},
			});
		};
		const { data } = await buySpin(jwt, amount);
		res.status(200).json(data);
	} catch (err) {
		// console.log(err);
		res.status(err.response.status).json(err.response.data);
	}
}
