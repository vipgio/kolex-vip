import { API } from "@/config/config";

import http from "@/utils/httpClient";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { cardIds } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
	try {
		const getCardInfo = async (jwt) => {
			return http(`${API}/card-template/?ids=${cardIds.toString()}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": jwt,
				},
			});
		};
		const { data } = await getCardInfo(jwt, cardIds);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
