import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { userId } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

	try {
		const getUserInfo = async (jwt, userId) => {
			return http(`${API}/users/user/${userId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": jwt,
				},
			});
		};
		const { data } = await getUserInfo(jwt, userId);
		res.status(200).json(data);
	} catch (err) {
		console.error(err);
		res.status(err.response.status).json(err.response.data);
	}
}
