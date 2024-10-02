import { useContext, useEffect, useRef, useState } from "react";
import uniq from "lodash/uniq";
import { useAxios } from "@/hooks/useAxios";
import { UserContext } from "@/context/UserContext";
import ListedTable from "./ListedTable";
import BigModal from "@/components/BigModal";

const ListedModal = ({ showModal, setShowModal }) => {
	const { user } = useContext(UserContext);
	const { fetchData } = useAxios();
	const finished = useRef(false);
	const [listed, setListed] = useState([]);
	const [sortMethod, setSortMethod] = useState("mint");
	const [loading, setLoading] = useState(false);
	const [insertFloor, setInsertFloor] = useState(0);

	const updateSelectedItems = async () => {};

	const deleteSelectedItems = async () => {};

	const getAllListed = async (firstPage) => {
		setLoading(true);
		setShowModal(true);
		let page = firstPage;

		const data = await getListed(page);
		if (data.count > 0 && !finished.current) {
			const templateList = uniq(
				data.market.map((item) => {
					if (item.type === "card") return item.card.cardTemplateId;
				})
			).toString();

			const { result: templates, error } = await fetchData(`/api/cards/templates`, {
				cardIds: templateList,
			});
			if (error) console.error(error);
			setListed((prev) => [
				...prev,
				...data.market.map((item) => {
					const template = templates.find((res) => res.id === item.card.cardTemplateId);
					// const floor = floorData.templates.find((res) => res.entityTemplateId === item.card.cardTemplateId);
					const obj = {
						marketId: item.marketId,
						templateId: item.card.cardTemplateId,
						price: item.price,
						minOffer: item.minOffer,
						mintNumber: item.card.mintNumber,
						mintBatch: item.card.mintBatch,
						type: item.type,
						created: item.created,
						signatureImage: item.card.signatureImage,
						circulation: template ? template.inCirculation : null,
						title: template ? template.title : null,
						// floor: floor ? floor.lowestPrice : null,
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
		<BigModal
			stopButton={
				!finished.current && (
					<button
						className='my-outline ml-2 rounded bg-red-400 p-1 font-semibold text-gray-800 hover:bg-red-500 active:bg-red-600 dark:text-gray-200'
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
			header='Listed Items'
			showModal={showModal}
			setShowModal={setShowModal}
			closingFunction={() => (finished.current = true)}
			hasToast={true}
		>
			<div className='flex h-16 min-h-[4rem] border border-gray-700 p-1 dark:border-gray-500'>
				<div className='flex items-center'>
					<label htmlFor='sort' className='text-gray-custom ml-1'>
						Sort by:{" "}
					</label>
					<select
						name='sort'
						id='sort'
						className='dropdown mx-2 my-1 sm:mb-0'
						onChange={(e) => setSortMethod(e.target.value)}
					>
						<option value='mint'>Mint</option>
						<option value='price'>Price</option>
						<option value='floor'>Floor</option>
						<option value='circulation'>Circulation</option>
						<option value='date'>Date Listed</option>
					</select>
				</div>
				<button
					className='simple-button my-1.5 ml-auto mr-1.5'
					onClick={() => setInsertFloor((prev) => prev + 1)}
				>
					Insert Floor
				</button>
			</div>
			<div className='overflow-auto'>
				<ListedTable setListed={setListed} listed={listed} sortMethod={sortMethod} insertFloor={insertFloor} />
			</div>
		</BigModal>
	);
};
export default ListedModal;
