import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import pick from "lodash/pick";
import "react-toastify/dist/ReactToastify.css";
import { useAxios } from "@/hooks/useAxios";
import Meta from "@/components/Meta";
import Toggle from "@/components/packs/Toggle";
import ListModeToggle from "@/components/packs/ListModeToggle";
import Filters from "@/components/packs/Filters";
import DirectSearch from "@/components/packs/DirectSearch";
import ImageModeGallery from "@/components/packs/ImageModeGallery";
import ListModeTable from "@/components/packs/ListModeTable";

const PackSearch = () => {
	const { fetchData } = useAxios();
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
			refreshPacks();
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
		const packs = await getPacks(page);
		if (packs)
			if (packs.length > 0) {
				setPacks((prev) => [
					...prev,
					...packs.map((item) =>
						pick(item, [
							"id",
							"name",
							"description",
							"entityCount",
							"inventoryCount",
							"cost",
							"costType",
							"images",
							"properties",
							"purchaseStart",
							"marketStart",
							"treatmentsChance",
							"mintCount",
							"openedCount",
							"images",
							"acquireType",
						])
					),
				]);
				getAllPacks(++page);
			} else {
				setLoading(false);
			}
	};

	const refreshPacks = () => {
		setLoading(true);
		setPacks([]);
		getAllPacks(1);
	};

	const onSubmit = async (e) => {
		//search for packs
		e.preventDefault();
		searchQuery.length > 0 &&
			setResults(
				/^\d+$/.test(searchQuery)
					? packs.filter((pack) => pack.id === Number(searchQuery))
					: packs
							.filter((pack) => pack.name.toLowerCase().replace(":", "").includes(searchQuery.toLowerCase()))
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
				<Toggle filtersMode={filtersMode} setFiltersMode={setFiltersMode} loading={loading} />
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
						<ListModeToggle listMode={listMode} setListMode={setListMode} loading={loading} />

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
