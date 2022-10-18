import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

export default async function handler(req, res) {
	if (req.method !== "PATCH" && req.method !== "DELETE")
		return res.status(405).json({ error: "Method not allowed" });

	const { jwt } = req.headers;
	const { marketId } = req.query;

	try {
		if (req.method === "PATCH") {
			const { price, minOffer } = req.body.data;
			const marketEdit = async (jwt, marketId, price, minOffer) => {
				return http(`${API}/market/listed/${marketId}`, {
					method: "PATCH",
					headers: {
						"x-user-jwt": jwt,
					},
					data: {
						price: price,
						minOffer: minOffer,
					},
				});
			};
			const { data } = await marketEdit(jwt, marketId, price, minOffer);
			res.status(200).json(data);
		}
		if (req.method === "DELETE") {
			const marketDelete = async (jwt, marketId) => {
				return http(`${API}/market/listed/${marketId}`, {
					method: "DELETE",
					headers: {
						"x-user-jwt": jwt,
					},
				});
			};
			const { data } = await marketDelete(jwt, marketId);
			res.status(200).json(data);
		}
	} catch (err) {
		console.log(err);
		res.status(err.response.status).json(err.response.data);
	}
}
