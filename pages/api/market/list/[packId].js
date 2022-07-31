import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("../../../../config/config");

export default async function handler(req, res) {
	const { price, minOffer } = req.body.data;
	const { jwt } = req.headers;
	const { packId } = req.query;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		const listItem = async (jwt, packId, price, minOffer) => {
			return http(`${API}/market/list?categoryId=1`, {
				method: "POST",
				headers: {
					"x-user-jwt": jwt,
				},
				data: {
					id: packId,
					price: price,
					minOffer: minOffer,
					type: "pack",
				},
			});
		};
		const { data } = await listItem(jwt, packId, price, minOffer);
		res.status(200).json(data);
	} catch (err) {
		console.log(err.response);
		res.status(err.response.status).json(err.response.data);
	}
}
