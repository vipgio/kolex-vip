import { useState, useContext, useEffect } from "react";
import findIndex from "lodash/findIndex";
import uniq from "lodash/uniq";
import { UserContext } from "context/UserContext";
import { useAxios } from "hooks/useAxios";
import Meta from "components/Meta";
import MassPackGrid from "@/components/packmanager/MassPackGrid";
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
		const { result, error } = await fetchData(`/api/packs/user?page=${page}`);
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
								packs: [{ id: pack.id, created: pack.created.split("T")[0] }],
						  }); // add the pack template to the array
				});
				getAllPacks(++page);
			} else {
				setPacks(uniq(templates));
				setLoading(false);
			}
		}
	};

	const refreshPacks = () => {
		setLoading(true);
		setSearchQuery("");
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
									<div className='relative mt-5 ml-4'>
										<input
											type='text'
											placeholder='Search pack name'
											className='input-field'
											onChange={(e) => setSearchQuery(e.target.value.trimStart())}
											value={searchQuery}
										/>
										<IoSearchOutline className='absolute top-2.5 right-1.5 text-gray-400' />
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
								<div className='mx-2 mt-2 grid grid-cols-2 gap-16 pb-8 sm:grid-cols-3'>
									{packs
										.sort((a, b) => b.id - a.id)
										.filter((pack) => pack.name.toLowerCase().includes(searchQuery.toLowerCase()))
										.map((packTemplate) => (
											<MassPackGrid key={packTemplate.id} packTemplate={packTemplate} />
										))}
								</div>
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
