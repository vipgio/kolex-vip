import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
import Bottleneck from "bottleneck";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const limiter = new Bottleneck({
	maxConcurrent: 1,
	minTime: 7000,
});

const { API } = require("@/config/config");

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { rosterId, enemyRosterId, bannedMapIds, stageId, id } = req.body.data;
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

		const { data } = await limiter.schedule(() =>
			playGame(jwt, rosterId, enemyRosterId, bannedMapIds)
		);
		res.status(200).json(data);
	} catch (err) {
		console.log(err);
		res.status(err.response.status).json(err.response.data);
	}
}
