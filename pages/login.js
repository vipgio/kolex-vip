import { useContext, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/UserContext";

const Login = () => {
	const { setUser, loading, setLoading } = useContext(UserContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const supabaseUrl = "https://npdkorffphcxibroqdvh.supabase.co";
		const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
		const supabase = createClient(supabaseUrl, supabaseKey);
		try {
			const { data } = await axios.post("/api/login", { email, password });
			setLoading(false);
			if (data.success) {
				let { data: whitelist, error } = await supabase.from("whitelist").select("*");
				console.log(error);
				whitelist.some((item) => item.username === data.data.user.username)
					? setUser({ ...data.data, premium: true })
					: setUser({ ...data.data, premium: false });
			} else {
				console.log(data);
				alert(data);
			}
		} catch (err) {
			console.log(err);
			toast.error(err.response.data.error, {
				position: "top-right",
				autoClose: 3500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				toastId: err.response.data.errorCode,
			});
			setLoading(false);
		}
	};

	return (
		<>
			<div className='flex h-full w-full items-center justify-center'>
				<ToastContainer
					position='top-right'
					autoClose={3500}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
				<form className='flex flex-col items-center space-y-2' onSubmit={onSubmit}>
					<input
						type='email'
						name='email'
						placeholder='Email address'
						value={email}
						required={true}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete='email'
						disabled={loading}
						className={`input-field ${loading ? "cursor-not-allowed opacity-50" : ""}`}
					/>

					<input
						type='password'
						name='password'
						placeholder='Password'
						value={password}
						required={true}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete='current-password'
						disabled={loading}
						className={`input-field ${loading ? "cursor-not-allowed opacity-50" : ""}`}
					/>
					<button
						type='submit'
						disabled={loading}
						className={`big-button ${loading ? "cursor-not-allowed opacity-50" : ""}`}
					>
						Login
					</button>
				</form>
			</div>
		</>
	);
};
export default Login;
