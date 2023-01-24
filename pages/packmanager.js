import { useState, useContext, useEffect } from "react";
import findIndex from "lodash/findIndex";
import uniq from "lodash/uniq";
import { UserContext } from "context/UserContext";
import Meta from "components/Meta";
import MassPackGrid from "@/components/packmanager/MassPackGrid";
import RefreshButton from "@/components/RefreshButton";
import Tooltip from "@/components/Tooltip";
import ListedModal from "@/components/packmanager/ListedModal";

const Packmanager = () => {
	const { userPacks, setLoading, loading, user } = useContext(UserContext);
	const [showListedModal, setShowListedModal] = useState(false);
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
			<Meta title='Pack Manager | Kolex VIP' />
			<div className='max-h-screen border-gray-200'>
				<RefreshButton
					title={"Refresh Packs"}
					func={refreshPacks}
					loading={loading}
					style='absolute top-14 right-2 mt-2'
				/>
				<div className='mt-16 mb-3 mr-2 flex items-center justify-end'>
					<Tooltip
						direction='left'
						text={`It will load ALL your packs. If you have too many it's gonna take a while or you can stop loading the items by clicking on "Stop".`}
					/>
					<button className='button' onClick={() => setShowListedModal(true)}>
						Manage Listings
					</button>
				</div>
				<div className='mx-2 mt-2 grid grid-cols-2 gap-16 pb-8 sm:grid-cols-3'>
					{packs
						.sort((a, b) => b.id - a.id)
						.map((packTemplate) => (
							<MassPackGrid key={packTemplate.id} packTemplate={packTemplate} />
						))}
				</div>
				{showListedModal && (
					<ListedModal showModal={showListedModal} setShowModal={setShowListedModal} />
				)}
			</div>
		</>
	);
};
export default Packmanager;
