import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });

export default async function handler(req, res) {
	// make sure it's only post
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}
	try {
		const login = async (auth) => {
			return http("https://api.epics.gg/api/v1/auth/login", {
				method: "POST",
				data: auth,
			});
		};
		const { data } = await login(req.body);

		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
