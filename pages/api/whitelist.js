import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
	const supabase = createClient(supabaseUrl, supabaseKey);
	const { username } = req.query;
	try {
		let { data } = await supabase.from("KolexDB").select("*").ilike("username", username);
		res.status(200).json(data[0]);
	} catch (err) {
		res.status(500).json(err);
	}
}
