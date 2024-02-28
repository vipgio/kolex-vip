import { useContext, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { UserContext } from "context/UserContext";
import KolexLogin from "@/components/login/KolexLogin";
import ESLLogin from "@/components/login/ESLLogin";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
	const { setUser, loading, setLoading } = useContext(UserContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [codeEnabled, setCodeEnabled] = useState(false);
	const [code, setCode] = useState("");

	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const { data } = await axios.post("/api/login", { email, password, code });
			if (data.success) {
				const whitelist = await axios.get(
					`/api/whitelist?username=${data.data.user.username}`
				);

				if (whitelist.data.info?.banned) {
					toast.error("I don't like you, fuck off", {
						position: "top-center",
						toastId: "banned",
						progress: 1,
						closeOnClick: false,
					});
				} else {
					const now = new Date().getTime();
					const ends = Date.parse(whitelist.data.ends);
					whitelist.data.info
						? setUser((_) => {
								const expired = now > ends;
								return {
									...data.data,
									info: {
										transfers: whitelist.data.info.transfers || 0,
										allowed: expired ? [] : whitelist.data.info.allowed || [],
										...(!expired && {
											ends: Math.floor((ends - now) / (1000 * 3600 * 24)),
										}), //if not expired, add "ends"
									},
								};
						  })
						: setUser({ ...data.data, info: { allowed: [] } });
				}
				setLoading(false);
			}
		} catch (err) {
			if (!codeEnabled && err.response.data.errorCode === "2fa_invalid") {
				setCodeEnabled(true);
				toast.warning("Enter your 2FA code", {
					toastId: err.response.data.errorCode,
				});
			} else {
				toast.error(err.response.data.error, {
					toastId: err.response.data.errorCode,
				});
			}
			setLoading(false);
		}
	};

	return (
		<>
			<div className='flex h-full w-full flex-col items-center justify-center text-primary-500'>
				<p className='text-center'>
					Kolex recently added a security feature (captcha) which prevents third party
					tools from accessing the site. <br />
					If you paid for anything, please contact me on Discord and I&apos;ll refund you.{" "}
					<br />
					I&apos;m trying to work with Kolex to get this fixed.
					<br />
					So until they fix it, the site is <span className='text-red-500'>down</span>.
				</p>
			</div>
			{/* <ToastContainer
				position='top-right'
				hideProgressBar
				newestOnTop
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<div className='absolute right-8 top-4'>
				<button className='mx-2 h-5 w-5'>
					<a
						href='https://discordapp.com/users/473436055958192128'
						target='_blank'
						rel='noreferrer'
						title='Contact me on Discord'
						className='rounded-full focus:outline-purple-500 focus-visible:outline-offset-4 focus-visible:outline-orange-500'
						// className='my-outline mr-2 h-8 w-8 rounded-full focus-visible:ring-inset'
					>
						<FaDiscord className='h-6 w-6 text-gray-700 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-300 dark:active:text-gray-400' />
					</a>
				</button>
			</div>
			<div className='absolute right-0 top-4' title='Source Code'>
				<a
					href='https://github.com/vipgio/kolex-vip'
					target='_blank'
					rel='noopener noreferrer'
				>
					<FaGithub className='h-6 w-6 text-gray-700 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-300 dark:active:text-gray-400' />
				</a>
			</div>
			<div className='flex h-full w-full flex-col items-center justify-center'>
				<KolexLogin
					code={code}
					email={email}
					password={password}
					setPassword={setPassword}
					setEmail={setEmail}
					setCode={setCode}
					loading={loading}
					onSubmit={onSubmit}
					codeEnabled={codeEnabled}
				/>
				<div className='absolute bottom-0 h-8 w-full border-t border-gray-600 p-1 dark:border-gray-400'>
					<span className='text-sm text-gray-700 dark:text-gray-300'>
						Cool site logo by{" "}
						<a
							href='https://discordapp.com/users/341825527104929792'
							target='_blank'
							rel='noreferrer'
							className='text-primary-500 hover:underline'
						>
							Nexus
						</a>
					</span>
				</div>
			</div> */}
		</>
	);
};
export default Login;
