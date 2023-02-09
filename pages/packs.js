import { useContext, useState, useEffect } from "react";
import pick from "lodash/pick";
import { UserContext } from "context/UserContext";
import Meta from "components/Meta";
import PackResults from "components/PackResults";
import Tooltip from "components/Tooltip";
import LoadingSpin from "@/components/LoadingSpin";

const PackSearch = () => {
	const { getPacks, loading, setLoading, user } = useContext(UserContext);
	const [packs, setPacks] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [results, setResults] = useState(null);

	// useEffect(() => {
	// 	packs.length > 0 && localStorage.setItem("packs", JSON.stringify(packs));
	// }, [packs]);

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
				<form className='flex flex-col items-center space-y-2' onSubmit={onSubmit}>
					<label
						htmlFor='pack'
						className='flex flex-row-reverse items-center text-gray-700 dark:text-gray-300'
					>
						<Tooltip
							text='If your input is a number only, it will search for pack id. If there is any other text in it, it will search for pack name; ignoring lowercase, uppercase and colon.'
							direction='right'
						/>
						Enter pack ID or pack name
					</label>
					<input
						type='text'
						name='pack'
						id='pack'
						className={`input-field ${loading ? "cursor-not-allowed opacity-50" : ""}`}
						value={searchQuery}
						placeholder='Pack ID / Pack name'
						onChange={(e) => setSearchQuery(e.target.value)}
						autoComplete='off'
					/>
					{loading ? (
						<LoadingSpin />
					) : (
						<button
							type='submit'
							disabled={loading}
							className={`submit-button ${
								loading ? "cursor-not-allowed opacity-50" : ""
							}`}
						>
							Search for packs
						</button>
					)}
				</form>

				{results?.length > 0
					? results.map((res) => <PackResults pack={res} key={res.id} />)
					: searchQuery.length > 0 &&
					  results && (
							<div className='mt-2 flex justify-center text-gray-700 dark:text-gray-300'>
								No results found
							</div>
					  )}
			</div>
		</>
	);
};
export default PackSearch;
