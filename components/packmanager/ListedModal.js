import { useContext, useEffect, useRef, useState } from "react";
import uniq from "lodash/uniq";
import { useAxios } from "hooks/useAxios";
import { UserContext } from "context/UserContext";
import BigModal from "@/components/BigModal";
import ListedTable from "./ListedTable";
import Toggle from "./Toggle";

const ListedModal = ({ showModal, setShowModal }) => {
	const { user, categoryId } = useContext(UserContext);
	const { fetchData } = useAxios();
	const finished = useRef(false);
	const [listed, setListed] = useState([]);
	const [loading, setLoading] = useState(false);
	const [sortMethod, setSortMethod] = useState("template");
	const [insertFloor, setInsertFloor] = useState(0);
	const [compactMode, setCompactMode] = useState(false);
	const [undercuts, setUndercuts] = useState(false);

	const getAllListed = async (firstPage) => {
		setLoading(true);
		setShowModal(true);
		let page = firstPage;

		const data = await getListed(page, categoryId);
		if (data.count > 0 && !finished.current) {
			const templateList = uniq(
				data.market.map((item) => {
					if (item.type === "pack") return item.pack.packTemplate.id;
				})
			).toString();
			const { result: floorData } = await fetchData({
				endpoint: `/api/market/templates`,
				params: {
					templateIds: templateList,
					type: "pack",
					page: 1,
					price: "asc",
				},
				forceCategoryId: true,
			});
			setListed((prev) => [
				...prev,
				...data.market.map((item) => {
					const obj = {
						marketId: item.marketId,
						templateId: item.pack.packTemplate.id,
						price: item.price,
						minOffer: item.minOffer,
						type: item.type,
						minted: item.pack.created.split("T")[0],
						season: item.pack.packTemplate.properties.seasons[0],
						title: item.pack.packTemplate.name,
						floor: floorData.templates.find((res) => res.entityTemplateId === item.pack.packTemplate.id)
							.lowestPrice,
					};
					return obj;
				}),
			]);
			if (!finished.current) {
				setLoading(false);
				getAllListed(++page);
			}
		} else {
			finished.current = true;
			setLoading(false);
		}
	};

	const getListed = async (page) => {
		const { result, error } = await fetchData({
			endpoint: `/api/market/listed/users/${user.user.id}`,
			params: {
				type: "pack",
				page: page,
			},
			forceCategoryId: true,
		});
		if (result) return result;
		if (error) console.error(error);
	};

	useEffect(() => {
		if (listed.length === 0) {
			setLoading(true);
			getAllListed(1);
		}
		return () => {
			setShowModal(false);
			finished.current = true;
		};
	}, []);

	return (
		<>
			<BigModal
				stopButton={
					!finished.current && (
						<button
							className='ml-2 rounded bg-red-400 p-1 font-semibold text-gray-800 hover:bg-red-500 active:bg-red-600 dark:text-gray-200'
							onClick={() => {
								finished.current = true;
								setLoading(false);
							}}
							title='Stop loading the items'
						>
							Stop
						</button>
					)
				}
				loading={loading}
				header='Listed Packs'
				showModal={showModal}
				setShowModal={setShowModal}
				closingFunction={() => (finished.current = true)}
				hasToast={true}
			>
				<div className='flex h-16 min-h-[4rem] justify-between border-gray-700 p-1 dark:border-gray-500'>
					<div className='flex flex-1 items-center'>
						<label htmlFor='sort' className='ml-1 text-gray-700 dark:text-gray-300'>
							Sort by:{" "}
						</label>
						<select
							name='sort'
							id='sort'
							disabled={compactMode}
							className='dropdown mx-2 my-1 sm:mb-0'
							onChange={(e) => setSortMethod(e.target.value)}
						>
							<option value='templateId'>Template ID</option>
							<option value='mintDate'>Mint Date</option>
							<option value='price'>Price</option>
							<option value='priceDec'>Price Descending</option>
							<option value='floor'>Floor</option>
						</select>
					</div>
					<div className='flex-1'>
						<Toggle compactMode={compactMode} setCompactMode={setCompactMode} />
					</div>
					<div className='flex-1 text-end'>
						{/* <button className='button my-1.5 ml-auto mr-1'>Update All</button> */}
						<button
							className='simple-button my-1.5 ml-1 mr-1.5'
							onClick={() => setInsertFloor((prev) => prev + 1)}
						>
							Insert Floor
						</button>
					</div>
				</div>
				<div className='overflow-auto'>
					<ListedTable
						compactMode={compactMode}
						setListed={setListed}
						listed={undercuts ? listed.filter((pack) => pack.floor < pack.price) : listed}
						sortMethod={sortMethod}
						insertFloor={insertFloor}
					/>
				</div>

				<div className='mt-auto mb-1 flex items-center border-t border-gray-700 px-4 py-2 dark:border-gray-300'>
					<div className='inline-flex items-center'>
						<input
							type='checkbox'
							name='undercut'
							id='undercut'
							checked={undercuts}
							onChange={(e) => setUndercuts(e.target.checked)}
							className='cursor-pointer'
						/>
						<label htmlFor='undercut' className='ml-1 cursor-pointer text-gray-700 dark:text-gray-300'>
							Only show undercuts
						</label>
					</div>
				</div>
			</BigModal>
		</>
	);
};
export default ListedModal;
