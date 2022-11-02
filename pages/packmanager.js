import { useState, useContext, useEffect } from "react";
import findIndex from "lodash/findIndex";
import uniq from "lodash/uniq";
import { UserContext } from "context/UserContext";
import Meta from "components/Meta";
import MassPackGrid from "@/components/packmanager/MassPackGrid";

const Packmanager = () => {
	const { userPacks, setLoading, loading, user } = useContext(UserContext);
	const [packs, setPacks] = useState([]);

	let templates = [];
	const getAllPacks = async (page) => {
		userPacks(page).then((res) => {
			if (res.data.success)
				if (res.data.data.packs.length > 0) {
					res.data.data.packs.forEach((pack) => {
						const index = findIndex(templates, { name: pack.packTemplate.name });

						index !== -1 // if the pack template is already in the array
							? templates[index].packs.push({
									id: pack.id,
									created: pack.created.split("T")[0],
							  }) // add the pack to the array
							: templates.push({
									name: pack.packTemplate.name,
									id: pack.packTemplate.id,
									description: pack.packTemplate.description,
									releaseTime: pack.packTemplate.releaseTime?.split("T")[0],
									image: pack.packTemplate.images.filter(
										(image) => image.name === "image"
									)[0].url,
									packs: [{ id: pack.id, created: pack.created.split("T")[0] }],
							  }); // add the pack template to the array
					});
					getAllPacks(++page);
				} else {
					setPacks(uniq(templates));
					setLoading(false);
				}
		});
	};

	const refreshPacks = () => {
		setLoading(true);
		setPacks([]);
		localStorage.removeItem("userPacks");
		getAllPacks(1);
	};

	useEffect(() => {
		const localPacks = JSON.parse(localStorage.getItem("userPacks"));
		if (localPacks) {
			setPacks(localPacks);
		} else {
			setLoading(true);
			user && getAllPacks(1);
		}
	}, [user, setLoading]);

	useEffect(() => {
		packs.length > 0 && localStorage.setItem("userPacks", JSON.stringify(packs));
	}, [packs]);

	return (
		<>
			<Meta title='Mass List | Kolex VIP' />
			<div className='max-h-screen border-gray-200'>
				<button
					title='Refresh packs'
					className='absolute top-14 right-2 mt-2 flex flex-col items-center rounded-md bg-red-500 p-1 font-semibold disabled:cursor-not-allowed disabled:opacity-50'
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
						onClick={refreshPacks}
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
						/>
					</svg>
				</button>
				<div className='mx-2 mt-16 grid grid-cols-2 gap-16 pb-8 sm:grid-cols-3'>
					{packs
						.sort((a, b) => b.id - a.id)
						.map((packTemplate) => (
							<MassPackGrid key={packTemplate.id} packTemplate={packTemplate} />
						))}
				</div>
			</div>
		</>
	);
};
export default Packmanager;
