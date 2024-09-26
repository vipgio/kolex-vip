import { useEffect, useState } from "react";
import uniqBy from "lodash/uniqBy";
import pick from "lodash/pick";
import omit from "lodash/omit";
import { CDN } from "@/config/config";
import { useAxios } from "@/hooks/useAxios";
import ImageWrapper from "@/HOC/ImageWrapper";
import LoadingSpin from "@/components/LoadingSpin";
import RefreshButton from "@/components/RefreshButton";
import stripPack from "@/utils/stripPack";

const ActivePacks = ({ user, categoryId }) => {
	const { fetchData } = useAxios();
	const [activePacks, setActivePacks] = useState([]);
	const [loading, setLoading] = useState(false);
	let isApiSubscribed = true;

	const getAllPacks = async () => {
		setLoading(true);
		const storedData = sessionStorage.getItem("packs");
		let allPacks = storedData ? JSON.parse(storedData) : [];
		if (storedData && allPacks[0].categoryId === Number(categoryId)) {
			setActivePacks(
				allPacks.filter(
					(pack) => new Date(pack.purchaseEnd) - new Date() > 0 && pack.categoryId === Number(categoryId)
				)
			);
			setLoading(false);
		} else {
			sessionStorage.removeItem("packs");
			getStorePacks(1);
		}
	};

	const getStorePacks = async (page) => {
		try {
			const { result } = await fetchData({ endpoint: `/api/packs?page=${page}`, forceCategoryId: true });
			if (result.length > 0 && isApiSubscribed) {
				const strippedPacks = result.map((pack) => stripPack(pack));
				sessionStorage.setItem(
					"packs",
					JSON.stringify([...JSON.parse(sessionStorage.getItem("packs") ?? "[]"), ...strippedPacks])
				);
				const active = strippedPacks.filter(
					(pack) => new Date(pack.purchaseEnd) - new Date() > 0 && pack.categoryId === Number(categoryId)
				);
				setActivePacks((prev) => [...prev, ...active]);
				getStorePacks(++page);
			} else {
				setLoading(false);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const getAllStorePacks = async () => {
		setLoading(true);
		setActivePacks([]);
		sessionStorage.removeItem("packs");
		await getAllPacks();
	};

	useEffect(() => {
		getAllPacks();
		return () => (isApiSubscribed = false);
	}, []);

	return (
		<div
			className={`text-gray-custom mx-2 mb-5 flex flex-col sm:mx-0 ${
				user.user.username === "Fynngin" ? "font-comic" : ""
			}`}
		>
			<div className='inline-flex'>
				<span className='p-1 text-lg font-semibold'>Available Packs </span>
				<div className='relative ml-auto mr-2'>
					<RefreshButton
						title='Refresh Packs'
						style='absolute bottom-2 right-0 mt-2'
						func={getAllStorePacks}
						loading={loading}
					/>
				</div>
			</div>
			<div className='h-fit rounded border border-gray-700 p-1 dark:border-gray-300'>
				{loading ? (
					<div className='flex justify-center'>
						<LoadingSpin />
					</div>
				) : activePacks.length > 0 ? (
					<div className='grid grid-cols-1 gap-2 p-1.5 xs:grid-cols-2 sm:grid-cols-4'>
						{uniqBy(activePacks, "id").map((pack) => (
							<div key={pack.id} className='flex w-full rounded border border-gray-500 p-1'>
								<div className='mr-1 flex h-24 w-1/4 items-center justify-center'>
									<ImageWrapper
										src={`${CDN}${pack.images.url}` || ""}
										width={50}
										height={75}
										alt={pack.name}
										className='h-full w-auto object-contain'
									/>
								</div>
								<div className='flex w-3/4 flex-col justify-center sm:mt-2 sm:justify-start'>
									<div>{pack.name}</div>
									<div>
										<span className='text-primary-500'>{pack.inventoryCount.toLocaleString()}</span> Packs left
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className='text-center'>No packs available</div>
				)}
			</div>
		</div>
	);
};
export default ActivePacks;
