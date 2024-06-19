import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { uuid } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

	try {
		const getCardInfo = async (jwt, uuid) => {
			return http(`${API}/uuid/card/${uuid}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": jwt,
				},
			});
		};
		const { data } = await getCardInfo(jwt, uuid);
		res.status(200).json(data);
	} catch (err) {
		console.log(err);
		res.status(err.response.status).json(err.response.data);
	}
}
