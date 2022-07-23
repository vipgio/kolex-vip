import { useRouter } from "next/router";
import { useEffect } from "react";
import { UserContext } from "../context/UserContext";
const { useContext, useState } = require("react");

const Login = () => {
	const { setUser, login, loading, setLoading } = useContext(UserContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const whitelist = ["nerfan", "vipgio"];
	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const loginDataPromise = await login({ email, password });
			setLoading(false);
			const loginData = loginDataPromise.data;
			if (loginData.success) {
				whitelist.includes(loginData.data.user.username)
					? setUser({ ...loginData.data, premium: true })
					: setUser({ ...loginData.data, premium: false });
			} else {
				alert(loginData.message);
			}
			// loginData.success && loginData.data.user.username === "nerfan"
			// 	? setUser({ ...loginData.data, premium: true })
			// 	: alert("Login failed");
		} catch (err) {
			alert(err);
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
