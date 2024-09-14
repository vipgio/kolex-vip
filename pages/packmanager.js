import { useState, useContext, useEffect } from "react";
import findIndex from "lodash/findIndex";
import uniq from "lodash/uniq";
import chunk from "lodash/chunk";
import { IoSearchOutline } from "react-icons/io5";
import { templateLimit } from "@/config/config";
import { useAxios } from "@/hooks/useAxios";
import { UserContext } from "@/context/UserContext";
import Meta from "@/components/Meta";
import PackGallery from "@/components/packmanager/PackGallery";
import RefreshButton from "@/components/RefreshButton";
import Tooltip from "@/components/Tooltip";
import ListedModal from "@/components/packmanager/ListedModal";
import PurchaseToggle from "@/components/packmanager/PurchaseToggle";
import PurchasePage from "@/components/packmanager/PurchasePage";

const Packmanager = () => {
	const { user, categoryId } = useContext(UserContext);
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
								image: pack.packTemplate.images.find((image) => image.name === "image").url,
								userLimit: pack.packTemplate.userLimit,
								categoryId: pack.packTemplate.categoryId,
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
		await getAllPacks(1);
	};

	const getMarketInfo = async () => {
		const templateChunks = chunk(
			templates.map((pack) => pack.id),
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
		const localPacks = JSON.parse(localStorage.getItem("userPacks")) || []; // Get the user packs from the local storage or an empty array if it doesn't exist
		localStorage.setItem("userPacks", JSON.stringify(localPacks.filter((packs) => packs.categoryId))); // Remove any item in the userPacks that doesn't have a categoryId
		if (localPacks.find((packs) => packs.categoryId === categoryId)) {
			// Check if the category is already in the local storage
			setPacks(localPacks.find((packs) => packs.categoryId === categoryId).packTemplates); // Set the packs to the category
		} else {
			//remove any item in the userPacks that doesn't have a categoryId
			setLoading(true);
			user && getAllPacks(1);
		}
	}, [user, setLoading]);

	useEffect(() => {
		if (packs.length === 0) return;
		let localPacks = JSON.parse(localStorage.getItem("userPacks")) || []; // Get the user packs from the local storage or an empty array if it doesn't exist
		const categoryPacks = { packTemplates: packs, categoryId: categoryId }; // Create the new category
		localPacks = localPacks.filter((packs) => packs.categoryId !== categoryId); // Remove the old category
		localPacks.push(categoryPacks); // Add the new category
		localStorage.setItem("userPacks", JSON.stringify(localPacks)); // Save the new category
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
									<div className='mt-5 ml-4 inline-flex flex-col sm:flex-row'>
										<div className='relative'>
											<input
												type='text'
												placeholder='Search pack name'
												className='input-field'
												onChange={(e) => setSearchQuery(e.target.value.trimStart())}
												value={searchQuery}
											/>
											<IoSearchOutline className='pointer-events-none absolute top-2.5 right-1.5 text-gray-400' />
										</div>
										<div className='text-gray-custom my-2 flex flex-col font-semibold sm:ml-4 sm:-mt-2'>
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
									<div className='mb-3 mr-4 mt-5 flex items-start justify-end sm:items-center'>
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
