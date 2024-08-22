import { useState, useContext, useEffect } from "react";
import findIndex from "lodash/findIndex";
import uniq from "lodash/uniq";
import chunk from "lodash/chunk";
import { UserContext } from "context/UserContext";
import { useAxios } from "hooks/useAxios";
import { templateLimit } from "@/config/config";
import Meta from "components/Meta";
import PackGallery from "@/components/packmanager/PackGallery";
import RefreshButton from "@/components/RefreshButton";
import Tooltip from "@/components/Tooltip";
import ListedModal from "@/components/packmanager/ListedModal";
import PurchaseToggle from "@/components/packmanager/PurchaseToggle";
import PurchasePage from "@/components/packmanager/PurchasePage";
import { IoSearchOutline } from "react-icons/io5";

const Packmanager = () => {
	const { user } = useContext(UserContext);
	const { fetchData } = useAxios();
	const [loading, setLoading] = useState(false);
	const [showListedModal, setShowListedModal] = useState(false);
	const [packs, setPacks] = useState([]);
	const [manageMode, setManageMode] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");

	let templates = [];

	const getUserPacks = async (page) => {
		const { result, error } = await fetchData({
			endpoint: `/api/packs/user?page=${page}`,
			forceCategoryId: true,
		});
		if (error) console.error(error);
		if (result) return result;
	};

	const getAllPacks = async (page) => {
		const myPacks = await getUserPacks(page);
		if (myPacks) {
			if (myPacks.packs.length > 0) {
				myPacks.packs.forEach((pack) => {
					const index = findIndex(templates, { id: pack.packTemplate.id });
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
								image: pack.packTemplate.images.filter((image) => image.name === "image")[0].url,
								userLimit: pack.packTemplate.userLimit,
								packs: [{ id: pack.id, created: pack.created.split("T")[0] }],
						  }); // add the pack template to the array
				});
				getAllPacks(++page);
			} else {
				setPacks(uniq(templates));
				await getMarketInfo();
				setLoading(false);
			}
		}
	};

	const refreshPacks = async () => {
		setLoading(true);
		setSearchQuery("");
		setPacks([]);
		localStorage.removeItem("userPacks");
		await getAllPacks(1);
	};

	const getMarketInfo = async () => {
		const templateChunks = chunk(
			packs.map((pack) => pack.id),
			templateLimit
		);

		try {
			const promises = templateChunks.map(async (chunk) => {
				const { result, error } = await fetchData({
					endpoint: `/api/market/templates`,
					params: {
						templateIds: uniq(chunk).toString(),
						type: "pack",
						page: 1,
						price: "asc",
					},
					forceCategoryId: true,
				});

				if (error) {
					console.error("API Error:", error);
					return []; // Return an empty array or handle it as needed
				}

				return result.templates;
			});

			const results = await Promise.all(promises);
			setPacks((prev) => {
				return prev.map((pack) => {
					const marketInfo = results.flat().find((template) => template.entityTemplateId === pack.id);
					const floorPrice = marketInfo?.lowestPrice || 0;
					return {
						...pack,
						floor: floorPrice,
					};
				});
			});
		} catch (err) {
			console.error(err);
		}
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
			<Meta title='Pack Manager | Kolex VIP' />

			<div className='max-h-screen border-gray-200'>
				<RefreshButton
					title={"Refresh Packs"}
					func={refreshPacks}
					loading={loading}
					style='absolute top-14 right-4 mt-2'
				/>
				<div className='top-14 mt-4'>
					<PurchaseToggle manageMode={manageMode} setManageMode={setManageMode} />
				</div>

				<div className='flex'>
					<div className='w-full'>
						{manageMode ? (
							<>
								<div className='flex justify-between'>
									<div className='mt-5 ml-4 inline-flex'>
										<div className='relative'>
											<input
												type='text'
												placeholder='Search pack name'
												className='input-field'
												onChange={(e) => setSearchQuery(e.target.value.trimStart())}
												value={searchQuery}
											/>
											<IoSearchOutline className='absolute top-2.5 right-1.5 text-gray-400' />
										</div>
										<div className='-mt-2 ml-4 flex flex-col font-semibold text-gray-700 dark:text-gray-300'>
											<span>
												Total packs:{" "}
												{packs
													.filter((pack) => pack.name.toLowerCase().includes(searchQuery.toLowerCase()))
													.reduce((acc, pack) => acc + pack.packs.length, 0)}
											</span>
											<span>
												Total value: $
												{packs
													.filter((pack) => pack.name.toLowerCase().includes(searchQuery.toLowerCase()))
													.reduce((acc, pack) => acc + Number(pack.floor) * pack.packs.length, 0)
													.toFixed(2)}
											</span>
										</div>
									</div>
									<div className='mt-5 mb-3 mr-4 flex items-center justify-end'>
										<Tooltip
											direction='left'
											text={`It will load ALL your packs. If you have too many it's gonna take a while or you can stop loading the items by clicking on "Stop".`}
										/>
										<button className='button' onClick={() => setShowListedModal(true)}>
											Manage Listings
										</button>
									</div>
								</div>

								<PackGallery packs={packs} searchQuery={searchQuery} />

								{showListedModal && (
									<ListedModal showModal={showListedModal} setShowModal={setShowListedModal} />
								)}
							</>
						) : (
							<PurchasePage />
						)}
					</div>
				</div>
			</div>
		</>
	);
};
export default Packmanager;
