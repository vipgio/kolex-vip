import { useContext, useEffect, useRef, useState } from "react";
import uniq from "lodash/uniq";
import { useAxios } from "hooks/useAxios";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "context/UserContext";
import LoadingSpin from "../LoadingSpin";
import ListedTable from "./ListedTable";

const ListedModal = ({ setShowListedModal }) => {
	const { user } = useContext(UserContext);
	const { fetchData } = useAxios();
	const finished = useRef(false);
	const [listed, setListed] = useState([]);
	const [sortMethod, setSortMethod] = useState("mint");
	const [loading, setLoading] = useState(false);
	const [insertFloor, setInsertFloor] = useState(0);

	const getAllListed = async (firstPage) => {
		setLoading(true);
		setShowListedModal(true);
		let page = firstPage;

		const data = await getListed(page);
		if (data.count > 0 && !finished.current) {
			const templateList = uniq(
				data.market.map((item) => {
					if (item.type === "card") return item.card.cardTemplateId;
				})
			).toString();
			const { result: templates } = await fetchData(`/api/cards/templates`, {
				cardIds: templateList,
			});
			const { result: floorData } = await fetchData(`/api/market/templates`, {
				templateIds: templateList,
				type: "card",
				page: 1,
				price: "asc",
			});
			setListed((prev) => [
				...prev,
				...data.market.map((item) => {
					const obj = {
						marketId: item.marketId,
						price: item.price,
						minOffer: item.minOffer,
						mintNumber: item.card.mintNumber,
						mintBatch: item.card.mintBatch,
						type: item.type,
						created: item.created,
						signatureImage: item.signatureImage,
						circulation: templates.filter((res) => res.id === item.card.cardTemplateId)[0]
							.inCirculation,
						title: templates.filter((res) => res.id === item.card.cardTemplateId)[0]
							.title,
						floor: floorData.templates.filter(
							(res) => res.entityTemplateId === item.card.cardTemplateId
						)[0].lowestPrice,
					};
					return obj;
				}),
			]);
			if (!finished.current) {
				setLoading(false);
				getAllListed(++page);
			}
		} else {
			setLoading(false);
		}
	};

	const getListed = async (page) => {
		const { result, error } = await fetchData(
			`/api/market/listed/users/${user.user.id}`,
			{
				page: page,
			}
		);
		if (result) return result;
		if (error) console.log(error);
	};

	useEffect(() => {
		if (listed.length === 0) {
			setLoading(true);
			getAllListed(1);
		}
		return () => {
			setShowListedModal(false);
			finished.current = true;
		};
	}, []);

	return (
		<div className='fixed inset-0 z-30 flex flex-col items-center justify-center overscroll-none bg-black/90'>
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<div className='absolute inset-0 z-20 my-auto mx-8 flex h-fit max-h-[90vh] flex-col overflow-hidden overscroll-none rounded-md bg-gray-100 dark:bg-gray-900 sm:mx-16'>
				<div
					className='relative flex h-12 w-full items-center border-b border-b-white/10 bg-gray-300 dark:bg-gray-800' /*modal header*/
				>
					{!finished.current && (
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
					)}
					<h1 className='mx-auto py-2 text-3xl text-gray-800 dark:text-gray-200'>
						{loading ? <LoadingSpin /> : "Listed Items"}
					</h1>
					<button
						className='absolute right-0 top-0 h-12 w-12 p-1 text-gray-900 transition-colors duration-300 hover:cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300 active:bg-indigo-300 active:text-orange-400 dark:text-gray-200 dark:hover:bg-gray-700'
						onClick={() => {
							setShowListedModal(false);
						}}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							strokeWidth={2}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>
				<div className='flex h-16 min-h-[4rem] border border-gray-700 p-1 dark:border-gray-500'>
					<div className='flex items-center'>
						<label htmlFor='sort' className='ml-1 text-gray-700 dark:text-gray-300'>
							Sort by:{" "}
						</label>
						<select
							name='sort'
							id='sort'
							className='mx-2 my-1 rounded-md border border-gray-800 p-1 text-gray-900 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:mb-0'
							onChange={(e) => setSortMethod(e.target.value)}
						>
							{/* <option disabled selected value>
							Select an option
						</option> */}
							<option value='mint'>Mint</option>
							<option value='price'>Price</option>
							<option value='floor'>Floor</option>
							<option value='circulation'>Circulation</option>
						</select>
					</div>
					<button
						className='simple-button my-1.5 ml-auto mr-2'
						onClick={() => setInsertFloor((prev) => prev + 1)}
					>
						Insert Floor
					</button>
				</div>
				<div className='overflow-auto'>
					<ListedTable
						setListed={setListed}
						listed={listed}
						sortMethod={sortMethod}
						insertFloor={insertFloor}
					/>
				</div>
			</div>
		</div>
	);
};
export default ListedModal;
