import { useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import isEmpty from "lodash/isEmpty";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
import { useAxios } from "hooks/useAxios";
import SetSelector from "HOC/SetSelector";
import { UserContext } from "context/UserContext";
import Meta from "@/components/Meta";
import LoadingSpin from "@/components/LoadingSpin";
import UserSearch from "@/components/UserSearch";
import Tooltip from "@/components/Tooltip";
import "react-toastify/dist/ReactToastify.css";

const Trades = () => {
	const { user } = useContext(UserContext);
	const { fetchData } = useAxios();
	const [scanResults, setScanResults] = useState({});
	const [selectedCollection, setSelectedCollection] = useState(null);
	const [selectedUser, setSelectedUser] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleScan = async () => {
		setLoading(true);
		if (selectedUser.id === user.user.id) {
			toast.error("You can't trade with yourself. Select a different user.", {
				toastId: "no-user",
			});
			return;
		}
		const scanUser = async (userId, collectionId) => {
			const { result, error } = await fetchData(`/api/users/scan`, {
				collectionId: collectionId,
				userId: userId,
			});
			return result;
		};
		const getCollection = async (collectionId) => {
			const { result, error } = await fetchData(`/api/collections/cards/${collectionId}`);
			return result;
		};
		const data = await scanUser(selectedUser.id, selectedCollection.collection.id);
		const own = await scanUser(user.user.id, selectedCollection.collection.id);
		const templates = await getCollection(selectedCollection.collection.id);

		const sendItems = sortBy(
			[...own.cards, ...own.stickers].map((item) =>
				pickObj(item, selectedCollection, templates)
			),
			["mintBatch", "mintNumber"]
		);

		const receiveItems = sortBy(
			[...data.cards, ...data.stickers].map((item) =>
				pickObj(item, selectedCollection, templates)
			),
			["mintBatch", "mintNumber"]
		);

		setScanResults({
			send: {
				items: sendItems,
				bestSet: uniqBy(sendItems, "templateId"),
				bestFourSets: sendItems.reduce(
					(previousValue, currentValue) =>
						previousValue.filter((item) => item.templateId === currentValue.templateId)
							.length < 4 //if less than 4 are in the acc
							? [...previousValue, currentValue] //add the item to acc
							: [...previousValue], //skip it
					[]
				),
			},
			receive: {
				items: receiveItems,
				bestSet: uniqBy(receiveItems, "templateId"),
				bestFourSets: receiveItems.reduce(
					(previousValue, currentValue) =>
						previousValue.filter((item) => item.templateId === currentValue.templateId)
							.length < 4 //if less than 4 are in the acc
							? [...previousValue, currentValue] //add the item to acc
							: [...previousValue], //skip it
					[]
				),
			},
		});
		setLoading(false);
	};

	return (
		<>
			<Meta title='Trades | Kolex VIP' />
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
			<div className='mt-2 flex flex-col justify-center px-2'>
				<div className='relative mt-10 mb-5 flex max-h-96 overflow-y-hidden rounded-md border border-gray-700 pb-2 transition-all duration-300 dark:border-gray-300'>
					<div className='overflow-hidden'>
						<div className='p-2 px-4 font-semibold text-gray-700 dark:text-gray-300'>
							<span>Select a user to trade with: {selectedUser?.username}</span>
							{selectedUser && (
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
							)}
						</div>
						<UserSearch setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
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
					<button
						className='submit-button'
						onClick={handleScan}
						disabled={loading || !selectedCollection || !selectedUser}
					>
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
				<button onClick={() => console.log(scanResults)}>RESULTS</button>
				{/* {!isEmpty(scanResults) && (
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
				)} */}
			</div>
		</>
	);
};
export default Trades;

const pickObj = (item, selectedCollection, templates) => {
	const templateId = item.cardTemplateId ? item.cardTemplateId : item.stickerTemplateId;
	const foundTemplate = templates.find((o) => o.id === templateId);
	return {
		templateId: templateId,
		id: item.id,
		mintBatch: item.mintBatch,
		mintNumber: item.mintNumber,
		type: item.type,
		status: item.status,
		rating: item.rating,
		signatureImage: item.signatureImage,
		collectionId: selectedCollection.collection.id,
		title: item.type === "card" ? foundTemplate.title : item.stickerTemplate.title,
		inCirculation:
			item.type === "card"
				? foundTemplate.inCirculation
				: item.stickerTemplate.inCirculation,
	};
};
