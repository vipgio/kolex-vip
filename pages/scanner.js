import { useContext, useState } from "react";
import axios from "axios";
import isEmpty from "lodash/isEmpty";
import sortBy from "lodash/sortBy";
import { ToastContainer, toast } from "react-toastify";
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
	const [selectedUser, setSelectedUser] = useState(null);
	const [scanResults, setScanResults] = useState({});
	const [collectionTemplates, setCollectionTemplates] = useState({});
	const [ownedItems, setOwnedItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const isSelfScan = user.user.id === selectedUser?.id;

	const handleScan = async () => {
		if (!selectedUser) {
			toast.error("Please select a user", {
				toastId: "user-not-selected",
			});
			return;
		}
		if (!selectedCollection) {
			toast.error("Please select a collection", {
				toastId: "collection-not-selected",
			});
			return;
		}
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
			setLoading(true);
			const { data } = await axios.get(`/api/collections/cards/${collectionId}`, {
				headers: {
					jwt: user.jwt,
				},
			});
			setLoading(false);
			return data;
		};
		setLoading(true);
		setScanResults({});
		const { data } = await scanUser(selectedUser.id, selectedCollection.collection.id);
		const { data: own } =
			user.user.id !== selectedUser.id &&
			(await scanUser(user.user.id, selectedCollection.collection.id));
		const { data: templates } = await getCollection(selectedCollection.collection.id);
		setCollectionTemplates(templates);
		own //if scanning someone else
			? setOwnedItems(
					//pick the best set
					sortBy(
						[...own.cards, ...own.stickers].map((item) =>
							pickObj(item, selectedCollection)
						),
						["mintBatch", "mintNumber"]
					)
			  )
			: setOwnedItems(
					//pick the best 5 sets
					sortBy(
						[...data.cards, ...data.stickers].map((item) =>
							pickObj(item, selectedCollection)
						),
						["mintBatch", "mintNumber"]
					).reduce(
						(previousValue, currentValue) =>
							previousValue.filter((item) => item.templateId === currentValue.templateId)
								.length < 4 //if less than 4 are in the acc
								? [...previousValue, currentValue] //add the item to acc
								: [...previousValue], //skip it
						[]
					)
			  );
		setScanResults(
			[...data.cards, ...data.stickers].map((item) => pickObj(item, selectedCollection))
		);
		setLoading(false);
	};
	return (
		<>
			<Meta title='Scanner | Kolex VIP' />

			<div className='mt-2 flex flex-col justify-center px-2'>
				<ToastContainer
					position='top-right'
					autoClose={3500}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
				<div className='relative mt-10 mb-5 flex max-h-96 overflow-y-hidden rounded-md border border-gray-700 pb-2 transition-all duration-300 dark:border-gray-300'>
					<div className='overflow-hidden'>
						<div className='p-2 px-4 font-semibold text-gray-700 dark:text-gray-300'>
							<span>Selected User: {selectedUser?.username}</span>
							{selectedUser ? (
								<span
									className='ml-1 cursor-pointer text-red-500'
									title='Clear selection'
									onClick={() => {
										setSelectedUser(null);
										setScanResults({});
									}}
								>
									x
								</span>
							) : (
								<span className='ml-2'>
									<button
										className='rounded-md border border-gray-800 bg-gray-100 p-1 text-center text-gray-700 shadow-lg transition-colors hover:bg-gray-300 hover:text-gray-800 active:bg-gray-400 dark:border-gray-200 dark:text-gray-800 dark:hover:text-gray-800'
										onClick={() => setSelectedUser(user.user)}
									>
										Me
									</button>
								</span>
							)}
						</div>
						<UserSearch
							jwt={user.jwt}
							setSelectedUser={setSelectedUser}
							selectedUser={selectedUser}
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

						<div tabIndex={-1}>
							<SetSelector setSelectedCollection={setSelectedCollection} />
						</div>
					</div>
				</div>
				<div className='flex w-full items-center justify-center'>
					<button className='submit-button' onClick={handleScan} disabled={loading}>
						{loading ? <LoadingSpin /> : "Scan"}
					</button>
					<div className='text-gray-700 dark:text-gray-300'>
						<Tooltip
							text={
								"If there are too many of the same card, they won't be in the API response."
							}
							direction='right'
						/>
					</div>
				</div>
				{!isEmpty(scanResults) && (
					<div>
						<ScanResult
							scanResults={scanResults}
							templates={collectionTemplates}
							user={selectedUser}
							collection={selectedCollection}
							ownedItems={ownedItems}
							isSelfScan={isSelfScan}
						/>
					</div>
				)}
			</div>
		</>
	);
};
export default Scanner;

const pickObj = (item, selectedCollection) => {
	return {
		templateId: item.cardTemplateId ? item.cardTemplateId : item.stickerTemplateId,
		id: item.id,
		mintBatch: item.mintBatch,
		mintNumber: item.mintNumber,
		type: item.type,
		status: item.status,
		rating: item.rating,
		signatureImage: item.signatureImage,
		collectionId: selectedCollection.collection.id,
		title: item.type === "card" ? undefined : item.stickerTemplate.title,
		inCirculation: item.type === "card" ? undefined : item.stickerTemplate.inCirculation,
	};
};
