import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { userId, page, type } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

	try {
		const getListed = async (jwt, userId, page, type) => {
			const endpoint = type
				? `${API}/market/listed/users/${userId}?page=${page}&type=${type}&categoryId=1`
				: `${API}/market/listed/users/${userId}?page=${page}&categoryId=1`;
			return http(endpoint, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": jwt,
				},
			});
		};
		const { data } = await getListed(jwt, userId, page, type);
		res.status(200).json(data);
	} catch (err) {
		console.log(err);
		res.status(err.response.status).json(err.response.data);
	}
}
