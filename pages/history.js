import { createClient } from "@supabase/supabase-js";
import _ from "lodash";
const History = () => {
	const supabaseUrl = "https://npdkorffphcxibroqdvh.supabase.co";
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
	const supabase = createClient(supabaseUrl, supabaseKey);

	const getData = async () => {
		let { data: whitelist, error } = await supabase.from("whitelist").select("*");
		console.log(whitelist.some((item) => item.username === "nerfan"));
	};

	return (
		<div className='relative h-full w-full border'>
			{/* <button onClick={() => console.log(supabaseKey)}>CLICK</button> */}
			<button onClick={() => getData()}>CLICK</button>
		</div>
	);
};
export default History;
