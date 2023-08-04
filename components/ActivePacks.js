import { useEffect, useState } from "react";
import uniqBy from "lodash/uniqBy";
import { CDN } from "@/config/config";
import { useAxios } from "hooks/useAxios";
import ImageWrapper from "HOC/ImageWrapper";
import LoadingSpin from "./LoadingSpin";
import RefreshButton from "./RefreshButton";

const ActivePacks = ({ user, categoryId }) => {
	const { fetchData } = useAxios();
	const [activePacks, setActivePacks] = useState([]);
	const [loading, setLoading] = useState(false);
	let isApiSubscribed = true;

	const getStorePacks = async (page) => {
		const now = new Date();
		try {
			const { result } = await fetchData(`/api/packs?page=${page}`);
			if (result.length > 0 && isApiSubscribed) {
				const active = result.filter(
					(pack) =>
						new Date(pack.purchaseEnd) - now > 0 && pack.categoryId === Number(categoryId)
				);
				setActivePacks((prev) => [...prev, ...active]);
				getStorePacks(++page);
			} else {
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const getAllStorePacks = async () => {
		setLoading(true);
		setActivePacks([]);
		await getStorePacks(1);
	};

	useEffect(() => {
		getAllStorePacks();
		return () => (isApiSubscribed = false);
	}, []);

	return (
		<div
			className={`mx-2 mb-5 flex flex-col text-gray-700 dark:text-gray-300 sm:mx-0 ${
				user.user.username === "Fynngin" ? "font-comic" : ""
			}`}
		>
			<div className='inline-flex'>
				<span className='p-1 text-lg font-semibold'>Available Packs: </span>
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
							<div
								key={pack.id}
								className='flex w-full rounded border border-gray-500 pr-1'
							>
								<div className='mr-1 flex h-24 w-1/4 items-center justify-center'>
									<ImageWrapper
										src={`${CDN}${
											pack.images.find((img) => img.name === "pack-store").url
										}`}
										width={50}
										height={75}
										alt={pack.name}
									/>
								</div>
								<div className='mt-2 flex w-3/4 flex-col'>
									<div>{pack.name}</div>
									<div>
										Packs left:{" "}
										<span className='text-primary-500'>{pack.inventoryCount}</span>
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
