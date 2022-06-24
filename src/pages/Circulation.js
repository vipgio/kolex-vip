import { UserContext } from "../context/UserContext";
import { CircList } from "../components/CircList";

const { useContext, useState } = require("react");

export const Circulation = () => {
	const { getCirc, getCollections, loading, setLoading } = useContext(UserContext);
	const [collectionID, setCollectionID] = useState("");
	const [collection, setCollection] = useState({ info: {}, items: [] });

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
		<div className='flex flex-col items-center'>
			<div className='w-full flex justify-center h-full items-start pt-10'>
				<form className='flex flex-col space-y-2 items-center' onSubmit={onSubmit}>
					<input
						type='text'
						name='collection-id'
						placeholder='Collection ID'
						value={collectionID}
						onChange={(e) => setCollectionID(e.target.value)}
						disabled={loading}
						autoComplete='off'
						className={`input-field ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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
				<div className='text-gray-300 font-bold text-xl mt-3'>
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
	);
};
