import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { packId, categoryId } = req.query;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		const listItem = async (jwt, packId, categoryId = 1) => {
			return http(`${API}/packs/open2?categoryId=${categoryId}`, {
				method: "POST",
				headers: {
					"x-user-jwt": jwt,
				},
				data: {
					packId: packId,
				},
			});
		};
		const { data } = await listItem(jwt, packId, categoryId);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
