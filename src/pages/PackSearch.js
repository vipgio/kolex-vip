import { PackResults } from "../components/PackResults";
import { UserContext } from "../context/UserContext";

const { useContext, useState, useEffect } = require("react");

export const PackSearch = () => {
	const { getPacks, loading, setLoading } = useContext(UserContext);
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

	useEffect(() => {
		if (packs.length === 0) {
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
			// console.log(/^\d+$/.test(searchQuery));
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
			<button onClick={() => console.log(results)}>packs</button>
			{results.length > 0 &&
				results.map((res) => (
					<div key={res.id}>
						<PackResults pack={res} />
					</div>
				))}
		</div>
	);
};
