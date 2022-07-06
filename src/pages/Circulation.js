import { UserContext } from "../context/UserContext";
import { CircList } from "../components/CircList";
import Layout from "../components/Layout";

const { useContext, useState, useEffect } = require("react");

const Circulation = () => {
	const { getCirc, getCollections, loading, setLoading, setActive } =
		useContext(UserContext);
	const [collectionID, setCollectionID] = useState("");
	const [collection, setCollection] = useState({ info: {}, items: [] });

	useEffect(() => {
		setActive(2);
		document.title = "Kolex VIP | Circulations";
	}, []);
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const everything = await getCollections();
			setCollection((collection) => ({
				...collection,
				info: everything.data.data.filter(
					(item) => item.collection.id === Number(collectionID)
				),
			}));
		} catch (err) {
			console.log(err);
		}

		try {
			const collectionDataPromise = await getCirc(collectionID);
			collectionDataPromise && setLoading(false);
			const collectionData = collectionDataPromise.data.data;
			!collectionData.length && setCollection("");
			collectionData.length
				? setCollection((collection) => ({ ...collection, items: collectionData }))
				: alert("Collection not found");
		} catch (err) {
			alert(err);
			setLoading(false);
		}
	};
	return (
		<Layout>
			<div className='flex flex-col items-center'>
				<div className='flex h-full w-full items-start justify-center pt-10'>
					<form className='flex flex-col items-center space-y-2' onSubmit={onSubmit}>
						<input
							type='text'
							name='collection-id'
							placeholder='Collection ID'
							value={collectionID}
							onChange={(e) => setCollectionID(e.target.value)}
							disabled={loading}
							autoComplete='off'
							className={`input-field ${loading ? "cursor-not-allowed opacity-50" : ""}`}
						/>
						<button
							type='submit'
							disabled={loading}
							className={`big-button ${loading ? "cursor-not-allowed opacity-50" : ""}`}
						>
							Get Circulations
						</button>
					</form>
				</div>
				{collection.info?.length > 0 && (
					<div className='mt-3 text-xl font-bold text-gray-300'>
						{collection.info[0].collection.properties.seasons[0]}{" "}
						{collection.info[0].collection.description}
					</div>
				)}
				{collection.items.length > 0 && (
					<div className='overflow-hidden'>
						<CircList data={collection.items} />
					</div>
				)}
			</div>
		</Layout>
	);
};
export default Circulation;
