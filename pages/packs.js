import { parse } from "postcss";
import Layout from "../components/Layout";
import { PackResults } from "../components/PackResults";
import { UserContext } from "../context/UserContext";

const { useContext, useState, useEffect } = require("react");

export default function PackSearch() {
	const { getPacks, loading, setLoading, setActive } = useContext(UserContext);
	const [packs, setPacks] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [results, setResults] = useState([]);

	const getAllPacks = async (page) => {
		getPacks(page).then((res) => {
			if (res.data.success)
				if (res.data.data.length > 0) {
					setPacks((prev) => [...prev, ...res.data.data]);
					getAllPacks(++page);
				} else {
					setLoading(false);
				}
		});
	};

	const refreshPacks = () => {
		setLoading(true);
		setPacks([]);
		localStorage.removeItem("packs");
		getAllPacks(1);
	};

	useEffect(() => {
		packs.length > 0 && localStorage.setItem("packs", JSON.stringify(packs));
	}, [packs]);

	useEffect(() => {
		setActive(3);
		document.title = "Kolex VIP | Packs";
		const localPacks = JSON.parse(localStorage.getItem("packs"));
		if (localPacks) {
			setPacks(localPacks);
		} else {
			setLoading(true);
			getAllPacks(1);
		}
	}, []);

	useEffect(() => {
		searchQuery.length === 0 && setResults([]);
	}, [searchQuery]);

	const onSubmit = async (e) => {
		//search for packs
		e.preventDefault();
		try {
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
							.sort((a, b) => a.purchaseStart?.localeCompare(b.purchaseStart))
			);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Layout>
			<div className='flex flex-col justify-center pt-10'>
				<form className='flex flex-col items-center space-y-2' onSubmit={onSubmit}>
					<label htmlFor='pack'>Enter pack ID or pack name</label>
					<input
						type='text'
						name='pack'
						className={`input-field ${loading ? "cursor-not-allowed opacity-50" : ""}`}
						value={searchQuery}
						placeholder='Pack ID / Pack name'
						onChange={(e) => setSearchQuery(e.target.value)}
						autoComplete='off'
					/>
					{loading ? (
						<div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-700'></div>
					) : (
						<button
							type='submit'
							disabled={loading}
							className={`big-button ${loading ? "cursor-not-allowed opacity-50" : ""}`}
						>
							Search for packs
						</button>
					)}
				</form>
				<button
					title='Refresh packs'
					className='absolute top-28 right-2 mt-2 flex flex-col items-center rounded-md bg-red-500 p-1 font-semibold disabled:cursor-not-allowed disabled:opacity-50'
					disabled={loading}
				>
					{/* Refresh packs */}
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className={`h-6 w-6 cursor-pointer ${loading && "animate-spin-ac"}`}
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}
						onClick={refreshPacks}
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
						/>
					</svg>
				</button>
				{/* <button onClick={() => console.log(JSON.parse(localStorage.getItem("packs")))}>
				local
			</button>
			<button onClick={() => console.log(results)}>results</button>
			<button onClick={() => console.log(packs)}>packs</button> */}

				{results.length > 0 &&
					results.map((res) => (
						<div key={res.id}>
							<PackResults pack={res} />
						</div>
					))}
			</div>
		</Layout>
	);
}
