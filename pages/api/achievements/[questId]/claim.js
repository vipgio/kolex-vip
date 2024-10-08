import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { questId } = req.query;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		const claimAchievement = async (jwt, questId) => {
			return http(`${API}/achievements/${questId}/claim`, {
				method: "POST",
				headers: {
					"x-user-jwt": jwt,
				},
				data: {
					id: questId,
				},
			});
		};
		const { data } = await claimAchievement(jwt, questId);
		res.status(200).json(data);
	} catch (err) {
		console.error(err);
		res.status(err.response.status).json(err.response.data);
	}
}
