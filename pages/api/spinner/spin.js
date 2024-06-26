import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { spinnerId, categoryId } = req.body;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		const spin = async (jwt, spinnerId, categoryId = 1) => {
			return http(`${API}/spinner/spin?categoryId=${categoryId}`, {
				method: "POST",
				headers: {
					"x-user-jwt": jwt,
				},
				data: {
					spinnerId: spinnerId,
				},
			});
		};
		const { data } = await spin(jwt, spinnerId, categoryId);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
