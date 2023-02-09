import { useContext, useState } from "react";
import axios from "axios";
import isEmpty from "lodash/isEmpty";
import sortBy from "lodash/sortBy";
import SetSelector from "HOC/SetSelector";
import { UserContext } from "context/UserContext";
import Meta from "components/Meta";
import UserSearch from "components/UserSearch";
import ScanResult from "components/scanner/ScanResults";
import Tooltip from "components/Tooltip";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpin from "@/components/LoadingSpin";

const Scanner = () => {
	const { user } = useContext(UserContext);
	const [selectedCollection, setSelectedCollection] = useState(null);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [scanResults, setScanResults] = useState([]);
	const [collectionTemplates, setCollectionTemplates] = useState({});
	const [ownedItems, setOwnedItems] = useState([]);
	const [loading, setLoading] = useState(false);

	const singleUserSearch = selectedUsers.length === 1;
	const isSelfScan = singleUserSearch && user.user.id === selectedUsers[0].id;

	const handleScan = async () => {
		const scanUser = async (userId, collectionId) => {
			const { data } = await axios.get(`/api/users/scan`, {
				params: {
					collectionId: collectionId,
					userId: userId,
				},
				headers: {
					jwt: user.jwt,
				},
			});
			return data;
		};

		const getCollection = async (collectionId) => {
			const { data } = await axios.get(`/api/collections/cards/${collectionId}`, {
				headers: {
					jwt: user.jwt,
				},
			});
			return data;
		};

		setLoading(true);
		setScanResults([]);

		const { data: templates } = await getCollection(selectedCollection.collection.id);
		setCollectionTemplates(templates);

		const { data: own } = await scanUser(user.user.id, selectedCollection.collection.id);
		if (selectedUsers.some((usr) => usr.id === user.user.id))
			setScanResults(
				[...own.cards, ...own.stickers].map((item) =>
					pickObj(item, selectedCollection, user.user.username)
				)
			);

		// for (const selectedUser of selectedUsers) {
		selectedUsers.forEach(async (selectedUser) => {
			if (selectedUser.username !== user.user.username) {
				const { data } = await scanUser(
					selectedUser.id,
					selectedCollection.collection.id
				);
				setScanResults((prev) => [
					...prev,
					...[...data.cards, ...data.stickers].map((item) =>
						pickObj(item, selectedCollection, selectedUser.username)
					),
				]);
			}
		});

		own && //if scanning someone else
			setOwnedItems(
				//pick the best set
				sortBy(
					[...own.cards, ...own.stickers].map((item) =>
						pickObj(item, selectedCollection, user.user.username)
					),
					["mintBatch", "mintNumber"]
				)
			);

		setLoading(false);
	};
	return (
		<>
			<Meta title='Scanner | Kolex VIP' />

			<div className='mt-2 flex flex-col justify-center px-2'>
				<div className='relative mt-10 mb-5 flex max-h-96 overflow-y-hidden rounded-md border border-gray-700 pb-2 transition-all duration-300 dark:border-gray-300'>
					<div className='overflow-hidden'>
						<div className='p-2 px-4 font-semibold text-gray-700 dark:text-gray-300'>
							<div>
								<span>
									Selected User:{" "}
									{selectedUsers?.length > 0 &&
										selectedUsers.map((user, index) => (
											<span key={user.id}>
												{!!index && <span className='mx-2 text-main-500'>|</span>}
												<span>{user.username}</span>
												<span
													className='ml-1 mr-1 cursor-pointer text-red-500'
													title='Clear selection'
													onClick={() => {
														setSelectedUsers((prev) =>
															prev.filter((oldUser) => oldUser.id !== user.id)
														);
														setScanResults({});
													}}
												>
													x
												</span>
											</span>
										))}
								</span>
								{!selectedUsers.some((u) => u.id === user.user.id) && (
									<span className='ml-2'>
										<button
											className='rounded-md border border-gray-800 bg-gray-100 p-1 text-center text-gray-700 shadow-lg transition-colors hover:bg-gray-300 hover:text-gray-800 active:bg-gray-400 dark:border-gray-200 dark:text-gray-800 dark:hover:text-gray-800'
											onClick={() => setSelectedUsers((prev) => [...prev, user.user])}
										>
											Me
										</button>
									</span>
								)}
							</div>
						</div>
						<UserSearch
							setSelectedUsers={setSelectedUsers}
							selectedUsers={selectedUsers}
						/>
					</div>
				</div>

				<div className='relative mb-5 flex max-h-96 overflow-visible rounded-md border border-gray-700 pb-2 transition-all duration-300 dark:border-gray-300'>
					<div className='px-1.5'>
						<div className='p-2 font-semibold text-gray-700 dark:text-gray-300'>
							Selected Collection:
							{selectedCollection && (
								<span>
									{" "}
									{selectedCollection.collection.properties.seasons[0]} -{" "}
									{selectedCollection.collection.properties.tiers[0]} -{" "}
									{selectedCollection.collection.name}
								</span>
							)}
						</div>

						<SetSelector setSelectedCollection={setSelectedCollection} />
					</div>
				</div>
				<div className='flex w-full items-center justify-center'>
					<button
						className='submit-button'
						onClick={handleScan}
						disabled={loading || !selectedCollection || !selectedUsers.length}
					>
						{loading ? <LoadingSpin /> : "Scan"}
					</button>
					<div className='text-gray-700 dark:text-gray-300'>
						<Tooltip
							text={"If there are too many of the same card, they won't be shown here."}
							direction='right'
						/>
					</div>
				</div>
				{!isEmpty(scanResults) && (
					<div>
						<ScanResult
							scanResults={scanResults}
							templates={collectionTemplates}
							user={selectedUsers}
							collection={selectedCollection}
							ownedItems={ownedItems}
							isSelfScan={isSelfScan}
							singleUserSearch={singleUserSearch}
						/>
					</div>
				)}
			</div>
		</>
	);
};
export default Scanner;

const pickObj = (item, selectedCollection, owner) => {
	return {
		templateId: item.cardTemplateId ? item.cardTemplateId : item.stickerTemplateId,
		id: item.id,
		mintBatch: item.mintBatch,
		mintNumber: item.mintNumber,
		type: item.type,
		status: item.status,
		rating: item.rating,
		signatureImage: item.signatureImage,
		title: item.type === "card" ? undefined : item.stickerTemplate.title,
		inCirculation: item.type === "card" ? undefined : item.stickerTemplate.inCirculation,
		collectionId: selectedCollection.collection.id,
		owner: owner,
	};
};
