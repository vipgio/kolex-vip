import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

	try {
		const getFunds = async (jwt) => {
			return http(`${API}/user/funds?categoryId=1`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": jwt,
				},
			});
		};
		const { data } = await getFunds(jwt);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
