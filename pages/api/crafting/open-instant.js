import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { slotId } = req.body;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		const openSlot = async (jwt, slotId) => {
			return http(`${API}/crafting/slots/${slotId}/open-instant?categoryId=1`, {
				method: "POST",
				headers: {
					"x-user-jwt": jwt,
				},
				data: { craftingcoins: null },
			});
		};
		const { data } = await openSlot(jwt, slotId);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
