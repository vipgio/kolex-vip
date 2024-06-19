import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { rosterId, enemyRosterId, bannedMapIds, stageId, id } = req.body;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		const playGame = async (jwt, rosterId, enemyRosterId, bannedMapIds) => {
			return http(`${API}/ultimate-team/pve/games`, {
				method: "POST",
				headers: {
					"x-user-jwt": jwt,
				},
				data: {
					categoryId: 1,
					rosterId: rosterId,
					enemyRosterId: enemyRosterId,
					bannedMapIds: bannedMapIds,
					circuit: { id: id, stageId: stageId },
				},
			});
		};

		const { data } = await playGame(jwt, rosterId, enemyRosterId, bannedMapIds);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
