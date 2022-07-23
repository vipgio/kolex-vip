import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import MassPackGrid from "../components/MassPackGrid";
import findIndex from "lodash/findIndex";
import values from "lodash/values";
import pickBy from "lodash/pickBy";
import Meta from "../components/Meta";

const Masslist = () => {
	const { userPacks, setLoading, setActive, loading, user } = useContext(UserContext);
	const [packs, setPacks] = useState([]);

	let templates = [];
	const getAllPacks = async (page) => {
		userPacks(page).then((res) => {
			if (res.data.success)
				if (res.data.data.packs.length > 0) {
					res.data.data.packs.forEach((pack) => {
						const index = findIndex(templates, { name: pack.packTemplate.name });

						index !== -1
							? templates[index].packs.push({
									id: pack.id,
									created: pack.created.split("T")[0],
							  })
							: templates.push({
									name: pack.packTemplate.name,
									id: pack.packTemplate.id,
									description: pack.packTemplate.description,
									releaseTime: pack.packTemplate.releaseTime?.split("T")[0],
									image: values(
										pickBy(pack.packTemplate.images, (image) => image.name === "image")
									)[0].url,
									packs: [{ id: pack.id, created: pack.created.split("T")[0] }],
							  });
						// setPackTemplates((prev) => ({ ...prev, ...templates }));
					});
					// console.log(templates);
					getAllPacks(++page);
				} else {
					setPacks(templates);
					// console.log(templates);
					setLoading(false);
				}
		});
	};

	const refreshPacks = () => {
		setLoading(true);
		setPacks([]);
		localStorage.removeItem("userPacks");
		getAllPacks(1);
	};

	useEffect(() => {
		setActive(5);
		const localPacks = JSON.parse(localStorage.getItem("userPacks"));
		if (localPacks) {
			setPacks(localPacks);
		} else {
			setLoading(true);
			user && getAllPacks(1);
		}
	}, [user, setActive, setLoading, getAllPacks]);

	useEffect(() => {
		packs.length > 0 && localStorage.setItem("userPacks", JSON.stringify(packs));
	}, [packs]);

	return (
		<>
			<Meta title='Mass List | Kolex VIP' />

			<div className='my-4 mx-2 mt-12 grid grid-cols-2 gap-16 border-gray-200 sm:grid-cols-3'>
				{packs
					.sort((a, b) => b.id - a.id)
					.map((packTemplate) => (
						<MassPackGrid key={packTemplate.id} pack={packTemplate} />
					))}
			</div>
		</>
	);
};
export default Masslist;
