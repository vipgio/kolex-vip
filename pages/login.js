import { useContext, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaGithub, FaMoon, FaSun, FaDiscord } from "react-icons/fa";
import { GoLinkExternal } from "react-icons/go";
import "react-toastify/dist/ReactToastify.css";
import { webApp } from "@/config/config";
import { ThemeContext } from "@/context/ThemeContext";
import { UserContext } from "@/context/UserContext";
import JWTLogin from "@/components/login/JWTLogin";
import TokenTutorial from "@/components/TokenTutorial";
import Meta from "@/components/Meta";

const Login = () => {
	const { setUser } = useContext(UserContext);
	const [loading, setLoading] = useState(false);
	const { theme, setTheme } = useContext(ThemeContext);
	// const [email, setEmail] = useState("");
	// const [password, setPassword] = useState("");
	// const [code, setCode] = useState("");
	const [jwt, setJwt] = useState("");
	const [codeEnabled, setCodeEnabled] = useState(false);
	const [showTutorial, setShowTutorial] = useState(false);

	const handleCopyClick = async () => {
		try {
			await navigator.clipboard.writeText(
				"(() => { const copyToClipboard = t => { const e = document.createElement('textarea'); e.value = t; document.body.appendChild(e); e.select(); const s = document.execCommand('copy'); document.body.removeChild(e); if (!s) { console.log('Failed to copy token to clipboard. Please copy manually using \"Copy Object\"');console.log(JSON.parse(t)); alert(`Failed to copy token to clipboard. Please copy manually:${t}`);} else { console.log('JWT Token copied to clipboard successfully! (Thanks vot)'); } }; copyToClipboard(JSON.stringify((() => { const { braze: _, ...rest } = JSON.parse(localStorage.getItem(\"session\")); return rest; })())); })();"
			);
			toast.success(`Code copied!`, {
				toastId: "copy",
				autoClose: 2000,
				hideProgressBar: false,
			});
		} catch (err) {
			console.error(err);
			toast.error(`Failed to copy the code :(`, { toastId: "failed" });
			toast.error(err.response.data.error, {
				toastId: err.response.data.errorCode,
			});
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const { data } = await axios.get("/api/users/info", {
				headers: {
					jwt: JSON.parse(jwt).jwt,
				},
			});

			if (data.success) {
				data = {
					data: {
						jwt: JSON.parse(jwt).jwt,
						expires: JSON.parse(jwt).expires,
						user: {
							...data.data,
						},
					},
				};
				const whitelist = await axios.get(`/api/whitelist?username=${data.data.user.username}`);

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
			console.error(err);
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
			<Meta title='Login | Kolex VIP' description='Toolkit for Kolex.gg' />
			<ToastContainer
				position='top-right'
				hideProgressBar
				newestOnTop
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<div className='text-gray-custom absolute right-0 top-4 flex h-12 items-center justify-center rounded-b-md font-semibold transition-colors'>
				<a
					href='https://github.com/vipgio/kolex-vip'
					target='_blank'
					rel='noopener noreferrer'
					title='Source Code'
				>
					<FaGithub className='text-gray-custom h-6 w-6 hover:text-gray-600 dark:hover:text-gray-300 dark:active:text-gray-400' />
				</a>
				<a
					href='https://discordapp.com/users/473436055958192128'
					target='_blank'
					rel='noreferrer'
					title='Contact me on Discord'
					// className='rounded-full focus:outline-primary-500 focus-visible:outline-offset-4 focus-visible:outline-primary-500'
					className='my-outline mx-3 h-8 w-8 rounded-full focus-visible:ring-inset'
				>
					<FaDiscord className='h-full w-full hover:text-gray-600 dark:hover:text-gray-300 dark:active:text-gray-400' />
				</a>
				<button
					className='my-outline mr-2 h-8 w-8 rounded-full focus-visible:ring-inset'
					onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
				>
					<div className='relative h-10 w-10 rounded-full' title='Change theme'>
						<FaSun
							className={`absolute top-0.5 h-7 w-7 animate-fadeIn cursor-pointer p-1 text-gray-300 transition-transform ${
								theme === "dark" ? "" : "animate-fadeOut opacity-0"
							}`}
						/>
						<FaMoon
							className={`absolute top-0.5 h-7 w-7 animate-fadeIn cursor-pointer p-1 text-gray-700 transition-transform  ${
								theme === "dark" ? "animate-fadeOut opacity-0" : ""
							}`}
						/>
					</div>
				</button>
				<Link href='/features'>
					<a
						title='Site Features'
						className='my-outline mr-2 rounded bg-primary-500 p-2.5 text-gray-200 transition-colors hover:bg-primary-400 focus-visible:ring-offset-1  active:bg-orange-300 dark:bg-primary-500 dark:text-gray-100 dark:hover:bg-primary-600 dark:active:bg-primary-700'
					>
						Features
					</a>
				</Link>
			</div>

			<div className='mt-16 flex h-1/4 w-full flex-col items-center justify-center text-primary-500 lg:mt-11'>
				<p className='text-center'>
					Kolex added a security feature (CAPTCHA) which prevents logging in through third-party tools. <br />
					I tried working with Kolex to get this fixed, but I&apos;ve been waiting for a few months.
					<br />
					So until they fix it, you can use your JWT to use the site.
					<span className='flex justify-center'>
						<button className='mr-2 block cursor-pointer underline' onClick={handleCopyClick}>
							Click to copy the code if you already know how it works.{" "}
						</button>
						{" | "}
						<span className='ml-2'>
							<a
								href={webApp}
								target='_blank'
								rel='noopener noreferrer'
								className='flex items-center hover:underline'
							>
								Kolex
								<GoLinkExternal />
							</a>
						</span>
					</span>
				</p>
				<div className='flex gap-3'>
					<button
						className='simple-button mt-1'
						onClick={() => setShowTutorial({ type: "web", show: true })}
						title='Web Tutorial'
					>
						HOW (Web)
					</button>
					<button
						className='simple-button mt-1'
						onClick={() => setShowTutorial({ type: "android", show: true })}
						title='Android Tutorial'
					>
						HOW (Android)
					</button>
					{/* <button
						className='simple-button mt-1'
						onClick={() => setShowTutorial({ type: "ios", show: true })}
					>
						HOW (iOS)
					</button> */}
				</div>
			</div>

			<div>
				{showTutorial.show && (
					<TokenTutorial
						showModal={showTutorial}
						setShowModal={setShowTutorial}
						handleCopyClick={handleCopyClick}
					/>
				)}
			</div>

			<JWTLogin
				jwt={jwt}
				loading={loading}
				setJwt={setJwt}
				toast={toast}
				setLoading={setLoading}
				setUser={setUser}
				onSubmit={onSubmit}
			/>
			<div className='absolute bottom-0 h-8 w-full border-t border-gray-600 p-1 dark:border-gray-400'>
				<span className='text-gray-custom text-sm'>
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
			{/* 
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
			</div> */}
		</>
	);
};
export default Login;
