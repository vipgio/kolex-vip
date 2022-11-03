import { useContext } from "react";
import uniqBy from "lodash/uniqBy";
import { UserContext } from "context/UserContext";
const useTrade = () => {
	const { tradeList, setTradeList } = useContext(UserContext);

	const isInList = (isSelfScan, item) => {
		if (isSelfScan) {
			return (
				tradeList.send &&
				tradeList.send[0] &&
				tradeList.send[0].items.some((o) => o.id === item.id)
			);
		} else {
			return tradeList.receive?.some((listUser) =>
				listUser.items?.some((o) => o.id === item.id)
			);
		}
	};

	const handleItem = (isSelfScan, item, owner, ownedItems) => {
		if (isSelfScan) {
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

	const addItem = (isSelfScan, item, owner, ownedItems) => {
		if (isSelfScan) {
			setTradeList((prev) => {
				return prev.send && prev.send[0] && prev.send[0]?.items
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
				const otherUsers = prev.receive?.filter((o) => o.owner !== owner.username); //everyone else
				return {
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

	const removeItem = (isSelfScan, item, owner) => {
		if (isSelfScan) {
			setTradeList((prev) => {
				return {
					//remove the item
					...prev,
					send: [
						{
							items: prev.send[0].items.filter((sentItem) => sentItem.id !== item.id),
							bestOwned: prev.send[0].bestOwned,
						},
					],
				};
			});
		} else {
			setTradeList((prev) => {
				const oldItems = prev.receive?.find((o) => o.owner === owner.username); //the user object in the tradelist
				const newItems = oldItems && oldItems.items.filter((o) => o.id !== item.id);
				const otherUsers = prev.receive?.filter((o) => o.owner !== owner.username); //everyone else
				return newItems.length === 0 //if items is gonna enp up empty, remove the user
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
					  };
			});
		}
	};

	return { isInList, handleItem, addItem, removeItem };
	// return { isInList, handleItem };
};
export { useTrade };
