import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { collectionId, page, categoryId } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
	try {
		const getCollectionInfo = async (jwt, collectionId, page, categoryId = 1) => {
			return http(`${API}/leaderboards/collections/${collectionId}?categoryId=${categoryId}&page=${page}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": jwt,
				},
			});
		};
		const { data } = await getCollectionInfo(jwt, collectionId, page, categoryId);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
