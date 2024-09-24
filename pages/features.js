import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabaseKey, supabaseUrl } from "@/config/config";
import Meta from "@/components/Meta";
import Toggle from "@/components/features/Toggle";
import Details from "@/components/features/Details";
import Pricing from "@/components/features/Pricing";

const supabase = createClient(supabaseUrl, supabaseKey);

const Features = ({ features, bundles, currencies, paymentMethods }) => {
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
				<Pricing
					features={features}
					bundles={bundles}
					currencies={currencies}
					paymentMethods={paymentMethods}
				/>
			)}
		</>
	);
};

Features.getInitialProps = async () => {
	try {
		const [
			{ data: features, error: featureError },
			{ data: bundles, error: bundleError },
			{ data: currencies, error: currencyError },
			{ data: paymentMethods, error: paymentMethodsError },
		] = await Promise.all([
			supabase.from("kolexFeatures").select("*").order("id"),
			supabase.from("kolexBundles").select("*").order("id"),
			supabase.from("currencies").select("*").order("id"),
			supabase.from("paymentMethods").select("*").order("id"),
		]);

		if (featureError) throw featureError;
		if (bundleError) throw bundleError;
		if (currencyError) throw currencyError;
		if (paymentMethodsError) throw paymentMethodsError;

		return {
			features: features,
			bundles: bundles,
			currencies: currencies.map((currency) => ({
				...currency,
				ratio: currency.conversion * currency.discount,
			})),
			paymentMethods: paymentMethods,
		};
	} catch (err) {
		console.error("Failed to fetch data:", err);
		return { error: "Failed to load page data" };
	}
};

export default Features;
