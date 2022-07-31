import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const Login = () => {
	const { setUser, loading, setLoading } = useContext(UserContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const whitelist = ["nerfan", "vipgio", "TeaAndBiscuits", "PR1D3", "squid_cxm"];
	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			// const dataPromise = await login({ email, password });
			const { data } = await axios.post("/api/login", { email, password });
			setLoading(false);
			if (data.success) {
				whitelist.includes(data.data.user.username)
					? setUser({ ...data.data, premium: true })
					: setUser({ ...data.data, premium: false });
			} else {
				console.log(data);
				alert(data);
			}
		} catch (err) {
			console.log(err);
			alert(err.response.data.error);
			setLoading(false);
		}
	};

	return (
		<>
			<div className='flex h-full w-full items-center justify-center'>
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
