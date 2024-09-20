import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TbRotate } from "react-icons/tb";
import { useAxios } from "@/hooks/useAxios";
import LoadingSpin from "@/components/LoadingSpin";

const Quests = ({ user }) => {
	const [loading, setLoading] = useState(false);
	const [achievements, setAchievements] = useState([]);
	const { fetchData, postData } = useAxios();

	const getCategories = async () => {
		const { result } = await fetchData(`/api/categories`);
		return result;
	};

	const getQuest = async () => {
		setLoading(true);
		const cachedData = sessionStorage.getItem("achievements");
		if (cachedData) {
			const parsedAchievements = JSON.parse(cachedData);
			setAchievements(parsedAchievements);
			setLoading(false);
			return;
		}

		// If no cache, fetch fresh data
		const categories = await getCategories();
		let allAchievements = [];

		const fetchAchievements = categories.map(async (category) => {
			try {
				const { result, error } = await fetchData(`/api/achievements`, {
					userId: user.user.id,
					categoryId: category.id,
				});

				if (error) throw new Error(error);

				const general = result?.achievements.filter((quest) => quest.progress.claimAvailable === true) || [];
				const daily = result?.daily.filter((quest) => quest.progress.claimAvailable === true) || [];
				const weekly = result?.weekly.filter((quest) => quest.progress.claimAvailable === true) || [];

				allAchievements = [...allAchievements, ...general, ...daily, ...weekly];
			} catch (error) {
				console.error(error);
				toast.error(`${error.response?.data?.error || error.message}`, {
					position: "top-left",
				});
			}
		});

		await Promise.all(fetchAchievements);

		setAchievements(allAchievements);

		sessionStorage.setItem("achievements", JSON.stringify(allAchievements));

		setLoading(false);
	};

	const claimAllQuests = async () => {
		setLoading(true);
		let counter = 0;
		for (const questId of achievements.map((achieve) => achieve.id)) {
			const { result, error } = await postData(`/api/achievements/${questId}/claim`);
			if (result) {
				setAchievements((prev) => prev.filter((quest) => quest.id !== questId));
				sessionStorage.setItem(
					"achievements",
					JSON.stringify(achievements.filter((quest) => quest.id !== questId))
				);
				counter++;
				toast.isActive(questId)
					? toast.update(questId, {
							render: `claimAllQuestsed ${counter}x Achievements!`,
					  })
					: toast.success(`claimAllQuestsed ${counter}x ${counter === 1 ? "Achievement" : "Achievements"}!`, {
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
		refreshQuests();
		setLoading(false);
	};

	const refreshQuests = async () => {
		sessionStorage.removeItem("achievements");
		setAchievements([]);
		await getQuest();
	};

	useEffect(() => {
		if (achievements.length > 0 && user.user.username === "vipgio") claimAllQuests();
	}, [achievements]);

	useEffect(() => {
		getQuest();
		return () => setAchievements([]);
	}, []);

	return (
		<>
			{loading ? (
				<span className='ml-1'>
					<LoadingSpin size={4} />
				</span>
			) : (
				<span className='ml-1 flex items-center font-semibold text-primary-500'>
					<span className='mr-1'>{achievements.length}</span>
					{achievements.length > 0 && (
						<span>
							(
							<button className='hover:text-orange-500' onClick={claimAllQuests}>
								claimAllQuests
							</button>
							)
						</span>
					)}
					<TbRotate
						title='Refresh Achievements'
						className='text-gray-custom cursor-pointer'
						onClick={refreshQuests}
					/>
				</span>
			)}
		</>
	);
};
export default Quests;
