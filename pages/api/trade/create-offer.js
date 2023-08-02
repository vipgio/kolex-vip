import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { entities, userId, categoryId } = req.body.data;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		const createOffer = async (jwt, userId, entities, categoryId = 1) => {
			return http(`${API}/trade/create-offer?categoryId=${categoryId}`, {
				method: "POST",
				headers: {
					"x-user-jwt": jwt,
				},
				data: {
					user2Id: userId,
					user1Balance: 0,
					user2Balance: 0,
					entities: entities,
				},
			});
		};
		const { data } = await createOffer(jwt, userId, entities, categoryId);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
