import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Meta from "@/components/Meta";
import Toggle from "@/components/features/Toggle";
import Details from "@/components/features/Details";
import Pricing from "@/components/features/Pricing";

const Features = ({ features, bundles }) => {
	console.log(bundles);
	const [show, setShow] = useState("features");
	return (
		<>
			<Meta title='Features | Kolex VIP' />
			<div className='mt-5 flex justify-center'>
				<Toggle action={show} setAction={setShow} />
			</div>
			{show === "features" ? (
				<Details features={features} />
			) : (
				<Pricing features={features} bundles={bundles} />
			)}
		</>
	);
};

Features.getInitialProps = async () => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
	const supabase = createClient(supabaseUrl, supabaseKey);
	try {
		const { data: features, error: featureError } = await supabase.from("kolexFeatures").select("*");
		const { data: bundles, error: bundleError } = await supabase.from("kolexBundles").select("*");
		featureError && console.error(featureError);
		bundleError && console.error(bundleError);
		if (features && bundles) {
			return { features: features.sort((a, b) => a.id - b.id), bundles: bundles[0].info };
		}
	} catch (err) {
		console.error(err);
	}
};

export default Features;
