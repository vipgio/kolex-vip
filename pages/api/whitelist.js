import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
	const supabase = createClient(supabaseUrl, supabaseKey);
	const { username } = req.query;
	try {
		let { data, error } = await supabase
			.from("whitelist")
			.select("username")
			.eq("username", username);
		error && console.log(error);
		const isWhitelited = data[0] ? true : false;
		res.status(200).json(isWhitelited);
	} catch (err) {
		res.status(500).json(err);
	}
}
