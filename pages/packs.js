import { useContext, useState, useEffect } from "react";
import pick from "lodash/pick";
import ImageWrapper from "HOC/ImageWrapper";
import { CDN } from "@/config/config";
import { UserContext } from "context/UserContext";
import Meta from "components/Meta";
import Toggle from "@/components/packs/Toggle";
import Filters from "@/components/packs/Filters";
import DirectSearch from "@/components/packs/DirectSearch";
import PackModal from "@/components/packs/PackModal";
import FilteredBox from "@/components/packs/FilteredBox";

const PackSearch = () => {
	const { getPacks, loading, setLoading } = useContext(UserContext);
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

	const getAllPacks = async (page) => {
		getPacks(page).then((res) => {
			if (res.data.success)
				if (res.data.data.length > 0) {
					setPacks((prev) => [
						...prev,
						...res.data.data.map((item) =>
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
							])
						),
					]);
					getAllPacks(++page);
				} else {
					setLoading(false);
				}
		});
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
							.filter((pack) =>
								pack.name
									.toLowerCase()
									.replace(":", "")
									.includes(searchQuery.toLowerCase())
							)
							.sort((a, b) => b.id - a.id)
			);
	};

	return (
		<>
			<Meta title='Pack Search | Kolex VIP' />
			<div className='mt-10 flex flex-col justify-center'>
				<Toggle
					filtersMode={filtersMode}
					setFiltersMode={setFiltersMode}
					loading={loading}
				/>
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
							<div className='mt-4 grid grid-cols-1 gap-3 p-1.5 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'>
								{packs
									.filter(
										(pack) =>
											filters.seasons.includes(pack.properties.seasons[0]) &&
											(filters.costTypes.length > 0
												? filters.costTypes.includes(pack.costType)
												: true)
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
