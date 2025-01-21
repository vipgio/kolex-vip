// import http from "@/utils/httpClient";
// import { API } from "@/config/config";
// export const config = {
// 	api: {
// 		responseLimit: "8mb",
// 	},
// };
// export default async function handler(req, res) {
// 	const { jwt } = req.headers;
// 	const { userId, collectionId, categoryId } = req.query;
// 	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
// 	try {
// 		const searchUser = async (jwt, userId, collectionId, categoryId) => {
// 			return http(`${API}/collections/${collectionId}/users/${userId}/owned2?categoryId=${categoryId}`, {
// 				method: "GET",
// 				headers: {
// 					"Content-Type": "application/json",
// 					"x-user-jwt": jwt,
// 				},
// 			});
// 		};
// 		const { data } = await searchUser(jwt, userId, collectionId, categoryId);
// 		res.status(200).json(data);
// 	} catch (err) {
// 		res.status(err.response.status).json(err.response.data);
// 	}
// }
import { API } from "@/config/config";

import { rateLimitedFetch } from "@/utils/rateLimitedFetch";

export const config = {
	runtime: "experimental-edge",
};

export default async function handler(req) {
	// Parse the query parameters from the request
	const { searchParams } = new URL(req.url, "http://localhost");
	const query = {
		userId: searchParams.get("userId"),
		collectionId: searchParams.get("collectionId"),
		categoryId: searchParams.get("categoryId"),
	};

	// Get JWT from headers
	const jwt = req.headers.get("jwt");

	if (req.method !== "GET") {
		return new Response(JSON.stringify({ error: "Method not allowed" }), {
			status: 405,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const response = await rateLimitedFetch(
			`${API}/collections/${query.collectionId}/users/${query.userId}/owned2${query.categoryId ? `?categoryId=${query.categoryId}` : ""}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": jwt,
				},
			},
		);

		const data = await response.json();

		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: error.status || 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
