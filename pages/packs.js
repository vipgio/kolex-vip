import { useState, useEffect } from "react";
import pick from "lodash/pick";
import { useAxios } from "hooks/useAxios";
import Meta from "components/Meta";
import Toggle from "@/components/packs/Toggle";
import Filters from "@/components/packs/Filters";
import DirectSearch from "@/components/packs/DirectSearch";
import FilteredBox from "@/components/packs/FilteredBox";

const PackSearch = () => {
	const { fetchData } = useAxios();
	const [loading, setLoading] = useState(false);
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
		const { result, error } = await fetchData(`/api/packs?page=${page}`);
		if (error) console.error(error);
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
			<div className='mt-10 flex flex-col justify-center'>
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
						<Filters filters={filters} setFilters={setFilters} packs={packs} />
						{filters.seasons.length > 0 && filters.show && (
							<div className='mt-4 grid grid-cols-1 gap-3 p-1.5 px-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'>
								{packs
									.filter(
										(pack) =>
											filters.seasons.includes(pack.properties.seasons[0]) &&
											(filters.costTypes.length > 0 ? filters.costTypes.includes(pack.costType) : true)
									)
									.sort((a, b) => a.purchaseStart - b.purchaseStart)
									.map((pack) => (
										<FilteredBox pack={pack} key={pack.id} />
									))}
							</div>
						)}
					</>
				)}
			</div>
		</>
	);
};
export default PackSearch;
