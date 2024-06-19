import http from "@/utils/httpClient";
import { API } from "@/config/config";

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { slotId, categoryId } = req.body;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		const openSlot = async (jwt, slotId, categoryId = 1) => {
			return http(`${API}/crafting/slots/${slotId}/open-instant?categoryId=${categoryId}`, {
				method: "POST",
				headers: {
					"x-user-jwt": jwt,
				},
				data: { craftingcoins: null },
			});
		};
		const { data } = await openSlot(jwt, slotId, categoryId);
		res.status(200).json(data);
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
}
