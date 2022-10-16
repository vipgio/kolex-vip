import axios from "axios";
import { UserContext } from "context/UserContext";
import { useContext } from "react";
import { useState } from "react";
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";

const Worth = () => {
	const [list, setList] = useState([]);
	const { user } = useContext(UserContext);

	const getCollections = async () => {
		try {
			const { data } = await axios.get(
				`/api/collections/users/${user.user.id}/user-summary`,
				{
					params: {
						userId: user.user.id,
					},
					headers: {
						jwt: user.jwt,
					},
				}
			);
			return data;
		} catch (err) {
			console.log(err);
		}
	};

	const fetchData = async () => {
		const { data } = await getCollections();
		data.map(async (collection) => {
			if (collection.collection.id > 0) {
				const { data } = await axios.get(
					`/api/collections/cards/${collection.collection.id}`,
					{
						headers: {
							jwt: user.jwt,
						},
					}
				);
				if (data.success) {
					data.data.forEach((item) => {
						if (item.cardType && item.cardType === "player") {
							const obj = {
								title: item.title,
								cardId: item.id,
								playerId: item.player.id,
								playerHandle: item.player.handle,
							};
							setList((prev) => uniqBy([...prev, obj], "cardId"));
						}
					});
				}
			}
		});
	};
	return (
		<>
			<div className='mt-10 flex border'>
				<button onClick={fetchData}>Do</button>
				<button
					onClick={() => console.log(Object.entries(groupBy(list, "playerHandle")))}
					className='ml-10'
				>
					List
				</button>
			</div>

			<div className='flex flex-col border'>
				{list.length > 0 &&
					Object.entries(groupBy(list, "playerHandle")).map((arr) => (
						<div key={arr[0]} className='border-t text-gray-300'>
							<div>Player: {arr[0]}</div>
							<div>
								Cards:{" "}
								{sortBy(arr[1], "cardId").map((item) => (
									<div key={item.cardId}>{item.title}</div>
								))}
							</div>
						</div>
					))}
			</div>
		</>
	);
};
export default Worth;
