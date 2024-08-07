import http from "@/utils/httpClient";
import { API } from "@/config/config";

export const config = {
	api: {
		responseLimit: "8mb",
	},
};

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { userId, collectionId, categoryId } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
	try {
		const searchUser = async (jwt, userId, collectionId, categoryId) => {
			return http(`${API}/collections/${collectionId}/users/${userId}/owned2?categoryId=${categoryId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": jwt,
				},
			});
		};
		const { data } = await searchUser(jwt, userId, collectionId, categoryId);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
