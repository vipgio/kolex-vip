import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { spinnerId } = req.body.data;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		const spin = async (jwt, spinnerId) => {
			return http(`${API}/spinner/spin?categoryId=1`, {
				method: "POST",
				headers: {
					"x-user-jwt": jwt,
				},
				data: {
					spinnerId: spinnerId,
				},
			});
		};
		const { data } = await spin(jwt, spinnerId);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
