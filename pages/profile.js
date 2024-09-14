import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlinePoweroff } from "react-icons/ai";
import { RxCheck, RxCross2 } from "react-icons/rx";
import "react-toastify/dist/ReactToastify.css";
import { CDN } from "@/config/config";
import { useAxios } from "@/hooks/useAxios";
import { UserContext } from "@/context/UserContext";
import ImageWrapper from "@/HOC/ImageWrapper";
import Meta from "@/components/Meta";
import ActivePacks from "@/components/ActivePacks";
import TotalDeposit from "@/components/TotalDeposit";
import LoadingSpin from "@/components/LoadingSpin";
import Changelog from "@/components/Changelog";
import TokenExpiry from "@/components/TokenExpiry";

const Profile = () => {
	const { user, setUser, categoryId } = useContext(UserContext);
	const [achievements, setAchievements] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showChangelog, setShowChangelog] = useState(false);
	const { fetchData, postData } = useAxios();

	const getCategories = async () => {
		const { result } = await fetchData(`/api/categories`);
		return result;
	};

	const getQuest = async () => {
		setLoading(true);
		const categories = await getCategories();

		const fetchAchievements = categories.map(async (category) => {
			try {
				const { result, error } = await fetchData(`/api/achievements`, {
					userId: user.user.id,
					categoryId: category.id,
				});
				const general = result?.achievements.filter((quest) => quest.progress.claimAvailable === true) || [];
				const daily = result?.daily.filter((quest) => quest.progress.claimAvailable === true) || [];
				const weekly = result?.weekly.filter((quest) => quest.progress.claimAvailable === true) || [];
				setAchievements((prev) => [...prev, ...general, ...daily, ...weekly]);
			} catch (error) {
				console.error(error);
				toast.error(`${error.response.data.error}`, {
					position: "top-left",
				});
			}
		});
		await Promise.all(fetchAchievements);
		setLoading(false);
	};

	const claim = async () => {
		setLoading(true);
		let counter = 0;
		for (const questId of achievements.map((achieve) => achieve.id)) {
			const { result, error } = await postData(`/api/achievements/${questId}/claim`);
			if (result) {
				setAchievements((prev) => prev.filter((quest) => quest.id !== questId));
				counter++;
				toast.isActive(questId)
					? toast.update(questId, {
							render: `Claimed ${counter}x Achievements!`,
					  })
					: toast.success(`Claimed ${counter}x ${counter === 1 ? "Achievement" : "Achievements"}!`, {
							toastId: questId,
							position: "top-right",
					  });
			}
			if (error) {
				console.error(error);
				toast.error(`${error.response.data.error}`, {
					toastId: questId,
					position: "top-left",
				});
			}
		}
		setLoading(false);
	};

	useEffect(() => {
		getQuest();
	}, []);

	return (
		<>
			<Meta title='Profile | Kolex VIP' />
			<div
				className={`text-gray-custom mx-2 my-8 flex flex-col rounded-md border border-current py-2 transition-colors sm:mx-0 sm:flex-row ${
					user.user.username === "Fynngin" ? "font-comic" : ""
				}`}
			>
				<ToastContainer
					position='top-right'
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
				<div className='flex'>
					<div className='m-2 mx-3 h-36 w-36 overflow-hidden rounded-full border border-gray-700 dark:border-gray-300'>
						<ImageWrapper
							src={`${CDN}${user?.user.avatar}` || ""}
							alt={user?.user.username || "loading"}
							className='h-full w-full object-cover'
							height={500}
							width={500}
							priority='true'
						/>
					</div>
					<div
						className='m-1 ml-auto mr-2 h-fit cursor-pointer sm:hidden'
						onClick={() => setUser(null)}
						title='Logout'
					>
						<div className='rounded bg-red-400 fill-current p-0.5 text-gray-100 hover:bg-red-500 active:bg-red-600'>
							<AiOutlinePoweroff size={24} />
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
										i > 0 && (
											<span className='text-primary-500' key={i}>
												{" "}
												|{" "}
											</span>
										),
										<Link href={features[option]?.link || ""} key={option}>
											<a className='my-outline rounded hover:text-orange-500'>{features[option]?.name}</a>
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
							{user.user.totalDeposited >= 0 ? <TotalDeposit total={user.user.totalDeposited} /> : null}
							<div>
								Account created:{" "}
								<span className='font-semibold text-primary-500'>{user.user.created.split("T")[0]}</span>
							</div>

							<div>{user.user.banned ? "Banned lol" : "Not banned (yet)"}</div>

							<div>
								User ID: <span className='font-semibold text-primary-500'>{user.user.id}</span>
							</div>

							{user.user.ethAddress && (
								<div>
									ETH Wallet:{" "}
									<span className='break-all font-semibold text-primary-500'>{user.user.ethAddress}</span>
								</div>
							)}

							{user.user.kycCompleted ? (
								<div className='flex items-center'>
									<span>KYC completed</span>
									<RxCheck className='text-primary-500' size={20} />
								</div>
							) : (
								<div className='flex items-center'>
									<span>KYC not completed</span>
									<RxCross2 className='text-red-600' size={20} />
								</div>
							)}
							{<TokenExpiry expires={user.expires} />}
							<div className='inline-flex items-center'>
								Achievements available:{" "}
								{loading ? (
									<span className='ml-1'>
										<LoadingSpin size={4} />
									</span>
								) : (
									<span className='ml-1 font-semibold text-primary-500'>
										<span className='mr-1'>{achievements.length}</span>
										{achievements.length > 0 && (
											<span>
												(
												<button className='hover:text-orange-500' onClick={() => claim()}>
													Claim
												</button>
												)
											</span>
										)}
									</span>
								)}
							</div>
						</>
					)}
				</div>
				<button
					className='my-outline m-1 ml-auto mr-2 hidden h-fit cursor-pointer rounded focus-visible:ring-offset-2 sm:block'
					onClick={() => setUser(null)}
					title='Logout'
				>
					<div className='rounded bg-red-400 fill-current p-0.5 text-gray-100 hover:bg-red-500 active:bg-red-600'>
						<AiOutlinePoweroff size={24} />
					</div>
				</button>
				<Changelog showModal={showChangelog} setShowModal={setShowChangelog} />
			</div>
			<ActivePacks user={user} categoryId={categoryId} />
		</>
	);
};
export default Profile;

const features = {
	packmanager: { name: "Pack Manager", link: "/packmanager" },
	mintsearch: { name: "Mint Search", link: "/mintsearch" },
	cardlister: { name: "Card Lister", link: "/cardlister" },
	history: { name: "History", link: "/history" },
	feed: { name: "Custom Feed", link: "/feed" },
	transfer: { name: "Account Transfer", link: "/transfer" },
	vip: { name: "Stuff", link: "/vip" },
};
