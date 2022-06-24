import { UserContext } from "../context/UserContext";

const { useContext, useState } = require("react");

export const Login = () => {
	const { setUser, login, loading, setLoading } = useContext(UserContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const loginDataPromise = await login({ email, password });
			setLoading(false);
			const loginData = loginDataPromise.data;
			loginData.success ? setUser(loginData.data) : alert("Login failed");
		} catch (err) {
			alert(err);
			setLoading(false);
		}
	};

	return (
		<>
			<div className='w-full flex justify-center h-full items-center'>
				<form className='flex flex-col space-y-2 items-center' onSubmit={onSubmit}>
					<input
						type='email'
						name='email'
						placeholder='Email address'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete='email'
						disabled={loading}
						className={`input-field ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
					/>

					<input
						type='password'
						name='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete='current-password'
						disabled={loading}
						className={`input-field ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
					/>
					<button
						type='submit'
						disabled={loading}
						className={`big-button ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
					>
						Login
					</button>
				</form>
			</div>
		</>
	);
};
