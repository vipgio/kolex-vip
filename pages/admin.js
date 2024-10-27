import { useEffect, useState } from "react";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import AdminPanel from "@/components/admin/AdminTable";
import { supabaseKey, supabaseUrl } from "@/config/config";
import Meta from "@/components/Meta";

const supabase = createClient(supabaseUrl, supabaseKey);

const Admin = ({ features, users }) => {
	const [enteredPasscode, setEnteredPasscode] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	console.log(
		"%c if you found this page, don't be a dick and leave. thanks ",
		"background: #222; color: #3b82f6; font-size: 20px "
	);

	const handleLogin = (e) => {
		e.preventDefault();
		const hashedInput = crypto.createHash("sha256").update(enteredPasscode).digest("hex");
		console.log(hashedInput);
		if (hashedInput === process.env.NEXT_PUBLIC_HASHED_PASSCODE) {
			setIsAuthenticated(true);
		} else {
			alert("FUCK OFF");
		}
	};

	return (
		<div>
			<Meta title='Admin | Kolex VIP' robots='noindex' />
			{!isAuthenticated ? (
				<div className='flex h-screen items-center justify-center'>
					<form onSubmit={handleLogin}>
						<input
							type='password'
							value={enteredPasscode}
							onChange={(e) => setEnteredPasscode(e.target.value)}
							className='cursor-default border-none bg-slate-700'
						/>
					</form>
				</div>
			) : (
				<div>
					<AdminPanel features={features} users={users} />
				</div>
			)}
		</div>
	);
};
Admin.getInitialProps = async () => {
	try {
		const [{ data: features, error: featureError }, { data: users, error: usersError }] =
			await Promise.all([
				supabase.from("kolexFeatures").select("*").order("id"),
				supabase.from("KolexDB").select("*").order("username"),
			]);

		if (featureError) throw featureError;
		if (usersError) throw usersError;

		return { features, users };
	} catch (err) {
		console.error("Failed to fetch data:", err);
		return { error: "Failed to load page data" };
	}
};

export default Admin;
