import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

export default async function handler(req, res) {
	const { jwt } = req.headers;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		console.log(jwt);
		const refreshToken = async (jwt) => {
			return http(`${API}/auth/refresh-jwt`, {
				method: "POST",
				data: {
					"x-user-jwt": jwt,
				},
			});
		};
		const { data } = await refreshToken(jwt);
		res.status(200).json(data);
	} catch (err) {
		console.log(err.response.data.error);
		res.status(err.response.status).json(err.response.data);
	}
}
