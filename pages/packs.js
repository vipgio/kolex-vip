import { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import pick from "lodash/pick";
import omit from "lodash/omit";
import "react-toastify/dist/ReactToastify.css";
import { useAxios } from "@/hooks/useAxios";
import { UserContext } from "@/context/UserContext";
import Meta from "@/components/Meta";
import Toggle from "@/components/packs/Toggle";
import ListModeToggle from "@/components/packs/ListModeToggle";
import Filters from "@/components/packs/Filters";
import RefreshButton from "@/components/RefreshButton";
import DirectSearch from "@/components/packs/DirectSearch";
import ImageModeGallery from "@/components/packs/ImageModeGallery";
import ListModeTable from "@/components/packs/ListModeTable";
import stripPack from "@/utils/stripPack";

const PackSearch = () => {
	const { fetchData } = useAxios();
	const { categoryId } = useContext(UserContext);
	const [loading, setLoading] = useState(false);
	const [listMode, setListMode] = useState(false);
	const [packs, setPacks] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [results, setResults] = useState(null);
	const [filtersMode, setFiltersMode] = useState(false);
	const [filters, setFilters] = useState({
		seasons: [],
		costTypes: [],
		show: false,
	});

	useEffect(() => {
		const localPacks = JSON.parse(localStorage.getItem("packs"));
		if (localPacks) {
			refreshPacks();
			localStorage.removeItem("packs");
		} else {
			loadPacks();
		}
	}, []);

	useEffect(() => {
		searchQuery.length === 0 && setResults(null);
		/^\s*$/.test(searchQuery) && setSearchQuery("");
	}, [searchQuery]);

	const getPacks = async (page) => {
		const { result, error } = await fetchData({ endpoint: `/api/packs?page=${page}`, forceCategoryId: true });
		if (error) {
			setLoading(false);
			toast.error(`${error.response?.data?.error ?? error.code}`, {
				toastId: page,
			});
			console.error(error);
		}
		if (result?.length > 0) {
			return result;
		} else {
			setLoading(false);
		}
	};

	const getAllPacks = async (page) => {
		const packsFetch = await getPacks(page);
		if (packsFetch && packsFetch.length > 0) {
			const strippedPacks = packsFetch.map((pack) => stripPack(pack));
			setPacks((prev) => [...prev, ...strippedPacks]);
			sessionStorage.setItem(
				"packs",
				JSON.stringify([...JSON.parse(sessionStorage.getItem("packs") ?? "[]"), ...strippedPacks])
			);
			getAllPacks(++page);
		} else {
			setLoading(false);
		}
	};

	const loadPacks = () => {
		const storedData = sessionStorage.getItem("packs");
		let allPacks = storedData ? JSON.parse(storedData) : [];
		if (
			storedData &&
			allPacks.length > 0 &&
			allPacks.every((pack) => pack.categoryId === Number(categoryId))
		) {
			setPacks(allPacks);
			setLoading(false);
		} else {
			sessionStorage.removeItem("packs");
			getAllPacks(1);
		}
	};

	const refreshPacks = () => {
		setLoading(true);
		sessionStorage.removeItem("packs");
		setPacks([]);
		loadPacks();
	};

	const onSubmit = async (e) => {
		//search for packs
		e.preventDefault();
		searchQuery.length > 0 &&
			setResults(
				/^\d+$/.test(searchQuery)
					? packs.filter((pack) => pack.id === Number(searchQuery))
					: packs
							.filter((pack) => pack.name.toLowerCase().replace(/:/g, "").includes(searchQuery.toLowerCase()))
							.sort((a, b) => b.id - a.id)
			);
	};

	return (
		<>
			<Meta title='Pack Search | Kolex VIP' />
			<ToastContainer
				position='top-right'
				autoClose={3500}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<div className='mt-5 flex flex-col justify-center px-5'>
				<div className='relative flex justify-center'>
					<Toggle filtersMode={filtersMode} setFiltersMode={setFiltersMode} loading={loading} />
					<RefreshButton
						loading={loading}
						func={refreshPacks}
						title='Refresh Packs'
						style='absolute top-2 right-0'
					/>
				</div>
				{!filtersMode ? ( //old style
					<>
						<DirectSearch
							loading={loading}
							results={results}
							onSubmit={onSubmit}
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
						/>
					</>
				) : (
					<>
						<div className='relative flex justify-center'>
							<ListModeToggle listMode={listMode} setListMode={setListMode} loading={loading} />
						</div>

						<Filters filters={filters} setFilters={setFilters} packs={packs} />
						{filters.seasons.length > 0 && filters.show && (
							<div className=''>
								{listMode ? (
									<ListModeTable packs={packs} filters={filters} />
								) : (
									<ImageModeGallery packs={packs} filters={filters} />
								)}
							</div>
						)}
					</>
				)}
			</div>
		</>
	);
};
export default PackSearch;
