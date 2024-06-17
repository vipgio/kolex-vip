import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { circuitId, stageId } = req.body.data;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		const claim = async (jwt, circuitId, stageId) => {
			return http(`${API}/ultimate-team/circuits/${circuitId}/stages/${stageId}/claim`, {
				method: "POST",
				headers: {
					"x-user-jwt": jwt,
				},
				data: {
					id: stageId,
				},
			});
		};
		const { data } = await claim(jwt, circuitId, stageId);
		res.status(200).json(data);
	} catch (err) {
		console.log(err);
		res.status(err.response.status).json(err.response.data);
	}
}
