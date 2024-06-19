import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { id } = req.query;
	const { price, minOffer, type, categoryId } = req.body;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		const listItem = async (jwt, id, price, minOffer, type, categoryId = 1) => {
			return http(`${API}/market/list`, {
				method: "POST",
				headers: {
					"x-user-jwt": jwt,
				},
				data: {
					id: id,
					price: price,
					minOffer: minOffer,
					type: type,
					categoryId: categoryId,
				},
			});
		};
		const { data } = await listItem(jwt, id, price, minOffer, type, categoryId);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
