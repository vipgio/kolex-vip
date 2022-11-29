import { useEffect, useState } from "react";
import uniqBy from "lodash/uniqBy";
import { CDN } from "@/config/config";
import { useAxios } from "hooks/useAxios";
import ImageWrapper from "HOC/ImageWrapper";
import LoadingSpin from "./LoadingSpin";

const ActivePacks = ({ user }) => {
	const { fetchData } = useAxios();
	const [activePacks, setActivePacks] = useState([]);
	const [loading, setLoading] = useState(false);
	let isApiSubscribed = true;

	const getStorePacks = async (page) => {
		const now = new Date();
		const { result } = await fetchData(`/api/packs?page=${page}`);
		if (result.length > 0 && isApiSubscribed) {
			const active = result.filter((pack) => new Date(pack.purchaseEnd) - now > 0);
			setActivePacks((prev) => [...prev, ...active]);
			getStorePacks(++page);
		} else {
			setLoading(false);
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
					<button
						title='Refresh packs'
						className='my-outline absolute bottom-2 right-0 mt-2 flex flex-col items-center rounded-md bg-red-400 p-1 font-semibold text-gray-200 hover:bg-red-500 focus-visible:ring-offset-2 active:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50'
						disabled={loading}
					>
						{/* Refresh packs */}
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className={`h-6 w-6 cursor-pointer ${loading && "animate-spin-ac"}`}
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							strokeWidth={2}
							onClick={getAllStorePacks}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
							/>
						</svg>
					</button>
				</div>
			</div>
			<div className='h-fit rounded border p-1'>
				{loading ? (
					<div className='flex justify-center'>
						<LoadingSpin />
					</div>
				) : (
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
										<span className='text-orange-500'>{pack.inventoryCount}</span>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
export default ActivePacks;
