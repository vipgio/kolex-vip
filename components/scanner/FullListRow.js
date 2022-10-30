import React, { useContext, useState } from "react";
import uniqBy from "lodash/uniqBy";
import { FaSignature, FaLock, FaBan, FaHistory } from "react-icons/fa";
import { UserContext } from "context/UserContext";
import HistoryModal from "components/HistoryModal";

const FullListRow = React.memo(({ item, owner, isSelfScan, ownedItems }) => {
	const { user, tradeList, setTradeList } = useContext(UserContext);
	const [showHistory, setShowHistory] = useState(false);

	const openModal = (e) => {
		e.stopPropagation();
		setShowHistory(true);
	};

	const handleItem = () => {
		if (isSelfScan) {
			// console.log(item);
			// console.log(tradeList);
			setTradeList((prev) => {
				const isListed =
					prev.send &&
					prev.send[0] &&
					prev.send[0].items.some((sentItem) => sentItem.id === item.id);
				return isListed
					? {
							//remove the item
							...prev,
							send: [
								{
									items: prev.send[0].items.filter((sentItem) => sentItem.id !== item.id),
									bestOwned: prev.send[0].bestOwned,
								},
							],
					  }
					: prev.send && prev.send[0] && prev.send[0]?.items
					? {
							//add the item if the list already exists
							...prev,
							send: [
								{
									items: [...prev.send[0].items, item],
									bestOwned: uniqBy(
										[
											...prev.send[0].bestOwned,
											{ collectionId: item.collectionId, items: ownedItems },
										],
										"collectionId"
									),
								},
							],
					  }
					: {
							//create the list on first item
							...prev,
							send: [
								{
									items: [item],
									bestOwned: [{ collectionId: item.collectionId, items: ownedItems }],
								},
							],
					  };
			});
		} else {
			setTradeList((prev) => {
				const oldItems = prev.receive?.find((o) => o.owner === owner.username); //the user object in the tradelist
				const isListed = oldItems ? oldItems.items.some((o) => o.id === item.id) : false; //check if the item is already somewhere in the tradelist
				const newItems = oldItems && oldItems.items.filter((o) => o.id !== item.id);
				const otherUsers = prev.receive?.filter((o) => o.owner !== owner.username); //everyone else
				return isListed
					? newItems.length === 0 //if items is gonna enp up empty, remove the user
						? { ...prev, receive: otherUsers }
						: {
								//remove the item from user's list
								...prev,
								receive: [
									...(otherUsers || []),
									{
										...oldItems,
										items: newItems,
									},
								],
						  }
					: {
							...prev,
							receive: [
								//add the item to user's list
								...(otherUsers || []),
								oldItems //if user already exists, add the items
									? {
											...oldItems,
											items: [...oldItems.items, item],
											bestOwned: uniqBy(
												[
													...oldItems.bestOwned,
													{ collectionId: item.collectionId, items: ownedItems },
												],
												"collectionId"
											),
									  }
									: {
											//if user doesn't exist, create user
											owner: owner.username,
											id: owner.id,
											items: [item],
											bestOwned: [
												{
													collectionId: item.collectionId,
													items: ownedItems,
												},
											],
									  },
							],
					  };
			});
		}
	};

	return (
		<tr
			className={`border-b border-gray-200 transition-colors hover:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 ${
				user.info.allowed.includes("tradesssss")
					? isSelfScan
						? tradeList.send &&
						  tradeList.send[0] &&
						  tradeList.send[0].items.some((sentItem) => sentItem.id === item.id)
							? "bg-gray-300 active:bg-gray-100 dark:bg-gray-600 dark:active:bg-gray-800"
							: "bg-gray-100 active:bg-gray-300 dark:bg-gray-800 dark:active:bg-gray-600"
						: tradeList.receive?.some((user) =>
								user.items?.some((listItem) => listItem.id === item.id)
						  )
						? "bg-gray-300 active:bg-gray-100 dark:bg-gray-600 dark:active:bg-gray-800"
						: "bg-gray-100 active:bg-gray-300 dark:bg-gray-800 dark:active:bg-gray-600"
					: "bg-gray-100 dark:bg-gray-800"
			}`}
			key={item.id}
			// onClick={handleItem}
		>
			<td
				className={`py-1 px-2 sm:py-3 sm:px-6 ${
					item.signatureImage ? "text-yellow-400" : ""
				}`}
				title={item.signatureImage ? "Signed" : undefined}
			>
				<span className='flex items-center justify-center'>
					{item.signatureImage && <FaSignature className='mr-2' />}
					{item.mintBatch}
					{item.mintNumber}
				</span>
			</td>
			<td className='min-w-[10rem] py-1 px-2 sm:py-3 sm:px-6'>{item.title}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.inCirculation}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				{item.status === "market" ? "Yes" : "No"}
			</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				{item.status === "imx_locked" ? "Yes" : "No"}
			</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>{(item.rating * 10).toFixed(2)}</td>
			<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.id}</td>
			{!isSelfScan && (
				<td className='py-1 px-2 sm:py-3 sm:px-6'>
					{item.delta > 0 ? `+${item.delta}` : 0}
				</td>
			)}
			<td className='py-1 px-2 sm:py-3 sm:px-6'>
				<span className='relative flex h-8 items-center justify-center'>
					{user.info.allowed.includes("history") ? (
						item.type === "sticker" ? (
							<FaBan
								title="Doesn't work with stickers"
								className='fill-gray-900 dark:fill-current'
							/>
						) : showHistory ? (
							<HistoryModal data={item} isOpen={showHistory} setIsOpen={setShowHistory} />
						) : (
							<button onClick={openModal}>
								<FaHistory />
							</button>
						)
					) : (
						<FaLock
							className='cursor-not-allowed'
							title='You need history access for this feature'
						/>
					)}
				</span>
			</td>
		</tr>
	);
});
FullListRow.displayName = "FullListRow";
export default FullListRow;
