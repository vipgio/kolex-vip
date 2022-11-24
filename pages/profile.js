import { useContext } from "react";
import Image from "next/future/image";
import { UserContext } from "context/UserContext";
import Meta from "components/Meta";
import Link from "next/link";

const Profile = () => {
	const { user, setUser } = useContext(UserContext);
	return (
		<>
			<Meta title='Profile | Kolex VIP' />
			<div className='mx-2 mt-12 flex flex-col rounded-md border border-current py-2 text-gray-700 transition-colors dark:text-gray-300 sm:mx-0 sm:flex-row'>
				<div className='flex'>
					<div className='m-2 mx-3 h-36 w-36 overflow-hidden rounded-full border border-gray-700 dark:border-gray-300'>
						<Image
							src={`https://cdn.epics.gg${user?.user.avatar}` || ""}
							alt={user?.user.username || "loading"}
							className='h-full w-full object-cover'
							height={500}
							width={500}
							priority='true'
							unoptimized={true}
						/>
					</div>
					<div
						className='m-1 ml-auto mr-2 h-fit cursor-pointer sm:hidden'
						onClick={() => setUser(null)}
						title='Logout'
					>
						<div className='rounded bg-red-400 fill-current p-0.5 text-gray-100 hover:bg-red-500 active:bg-red-600'>
							<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>
								<path d='M12 21c4.411 0 8-3.589 8-8 0-3.35-2.072-6.221-5-7.411v2.223A6 6 0 0 1 18 13c0 3.309-2.691 6-6 6s-6-2.691-6-6a5.999 5.999 0 0 1 3-5.188V5.589C6.072 6.779 4 9.65 4 13c0 4.411 3.589 8 8 8z'></path>
								<path d='M11 2h2v10h-2z'></path>
							</svg>
						</div>
					</div>
				</div>
				<div className='ml-3 flex flex-col gap-y-1'>
					{user && (
						<>
							<div className='mb-2 text-2xl font-bold'>{user.user.username}</div>

							<div>
								VIP Features:{" "}
								{user.info.allowed.length > 0 ? (
									user.info.allowed.map((option, i) => [
										i > 0 && ", ",
										<Link href={features[option].link} key={option}>
											<a className='hover:text-orange-500'>{features[option].name}</a>
										</Link>,
									])
								) : (
									<span>None</span>
								)}
							</div>
							{user.info.allowed.length > 0 && user.info.ends >= 0 ? (
								<div>
									Features end in{" "}
									<span
										className={`${
											user.info.ends < 2
												? "text-red-500"
												: user.info.ends < 8
												? "text-amber-500"
												: "text-green-500"
										}`}
									>
										{user.info.ends}
									</span>{" "}
									{user.info.ends === 1 ? "day" : "days"}
								</div>
							) : null}
							<div>
								Account created:{" "}
								<span className='font-semibold text-indigo-500'>
									{user.user.created.split("T")[0]}
								</span>
							</div>

							<div>{user.user.banned ? "Banned lol" : "Not banned (yet)"}</div>

							<div>
								User ID:{" "}
								<span className='font-semibold text-indigo-500'>{user.user.id}</span>
							</div>

							{user.user.ethAddress && (
								<div>
									ETH Wallet:{" "}
									<span className='break-all font-semibold text-indigo-500'>
										{user.user.ethAddress}
									</span>
								</div>
							)}

							{user.user.kycCompleted ? (
								<div className='flex'>
									<span>KYC completed</span>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										style={{ fill: "#6366f1" }}
									>
										<path d='m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z'></path>
									</svg>
								</div>
							) : (
								<div className='flex'>
									<span>KYC not completed</span>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										style={{ fill: "#dc2626" }}
									>
										<path d='m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z'></path>
									</svg>
								</div>
							)}
						</>
					)}
				</div>
				<div
					className='m-1 ml-auto mr-2 hidden h-fit cursor-pointer sm:block'
					onClick={() => setUser(null)}
					title='Logout'
				>
					<div className='rounded bg-red-400 fill-current p-0.5 text-gray-100 hover:bg-red-500 active:bg-red-600'>
						<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>
							<path d='M12 21c4.411 0 8-3.589 8-8 0-3.35-2.072-6.221-5-7.411v2.223A6 6 0 0 1 18 13c0 3.309-2.691 6-6 6s-6-2.691-6-6a5.999 5.999 0 0 1 3-5.188V5.589C6.072 6.779 4 9.65 4 13c0 4.411 3.589 8 8 8z'></path>
							<path d='M11 2h2v10h-2z'></path>
						</svg>
					</div>
				</div>
			</div>
		</>
	);
};
export default Profile;
const features = {
	packmanager: { name: "Pack Manager", link: "/packmanager" },
	mintsearch: { name: "Mint Search", link: "/mintsearch" },
	cardlister: { name: "Card Lister", link: "/cardlister" },
	history: { name: "History", link: "/history" },
	trades: { name: "Trades", link: "" },
};
