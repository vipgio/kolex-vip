import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Meta from "@/components/Meta";
import Toggle from "@/components/features/Toggle";
import Details from "@/components/features/Details";
import Pricing from "@/components/features/Pricing";

const Features = ({ features }) => {
	const [show, setShow] = useState("features");
	return (
		<>
			<Meta title='Features | Kolex VIP' />
			<div className='mt-5 flex justify-center'>
				<Toggle action={show} setAction={setShow} />
			</div>
			{show === "features" ? <Details features={features} /> : <Pricing features={features} />}
		</>
	);
};

Features.getInitialProps = async () => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
	const supabase = createClient(supabaseUrl, supabaseKey);
	try {
		const { data, error } = await supabase.from("kolexFeatures").select("*");
		error && console.error(error);
		if (data) {
			return { features: data.sort((a, b) => a.id - b.id) };
		}
	} catch (err) {
		console.error(err);
	}
};

export default Features;
