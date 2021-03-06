import { useContext, useEffect } from "react";
import Image from "next/future/image";
import { UserContext } from "../context/UserContext";
import Meta from "../components/Meta";

const Profile = () => {
	const { user, setUser, setActive } = useContext(UserContext);

	useEffect(() => {
		setActive(1);
	}, [setActive]);

	return (
		<>
			<Meta title='Profile | Kolex VIP' description='stuff' />
			<div className='container mt-10 flex flex-col border py-2 text-gray-300 sm:flex-row'>
				<div className='flex'>
					<div className='m-2 mx-3 h-36 w-36 overflow-hidden rounded-full border'>
						{/* <img
							src={`https://cdn.epics.gg${user?.user.avatar}` || ""}
							alt={user?.user.username || "loading"}
							className='h-full w-full object-cover'
						/> */}
						<Image
							src={`https://cdn.epics.gg${user?.user.avatar}` || ""}
							alt={user?.user.username || "loading"}
							className='h-full w-full object-cover'
							height={500}
							width={500}
						/>
					</div>
					<div
						className='m-1 ml-auto mr-2 h-fit cursor-pointer sm:hidden'
						onClick={() => setUser(null)}
						title='Logout'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='24'
							height='24'
							className='fill-current text-red-400 hover:text-red-600'
						>
							<path d='M12 21c4.411 0 8-3.589 8-8 0-3.35-2.072-6.221-5-7.411v2.223A6 6 0 0 1 18 13c0 3.309-2.691 6-6 6s-6-2.691-6-6a5.999 5.999 0 0 1 3-5.188V5.589C6.072 6.779 4 9.65 4 13c0 4.411 3.589 8 8 8z'></path>
							<path d='M11 2h2v10h-2z'></path>
						</svg>
					</div>
				</div>
				<div className='ml-3 flex flex-col'>
					{user && (
						<>
							<div className='text-2xl font-semibold'>{user.user.username}</div>
							<div>
								Balance:{" "}
								<span className='font-semibold text-indigo-500'>{user.user.balance}</span>
							</div>

							<div>
								Created:{" "}
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

							{user.user.verifiedPhone ? (
								<div className='flex'>
									<span>Phone number verified</span>
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
									<span>Phone number not verified</span>
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
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						className='fill-current text-red-400 hover:text-red-600'
					>
						<path d='M12 21c4.411 0 8-3.589 8-8 0-3.35-2.072-6.221-5-7.411v2.223A6 6 0 0 1 18 13c0 3.309-2.691 6-6 6s-6-2.691-6-6a5.999 5.999 0 0 1 3-5.188V5.589C6.072 6.779 4 9.65 4 13c0 4.411 3.589 8 8 8z'></path>
						<path d='M11 2h2v10h-2z'></path>
					</svg>
				</div>
			</div>
		</>
		// </Layout>
	);
};
export default Profile;
