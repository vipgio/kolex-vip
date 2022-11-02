import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import sortBy from "lodash/sortBy";
import TradeInfoModal from "./TradeInfoModal";

const TradeInfoBox = ({ user, myItems, setTradeList }) => {
	const [showInfoModal, setShowInfoModal] = useState(false);
	const openModal = () => {
		setShowInfoModal(true);
	};
	const removeItem = (item, owner) => {
		owner
			? setTradeList((prev) => {
					const oldItems = prev.receive.find((o) => o.owner === owner); //the user object in the tradelist
					const newItems = oldItems.items.filter((o) => o.id !== item.id);
					const otherUsers = prev.receive.filter((o) => o.owner !== owner);
					return newItems.length === 0 //if items is gonna enp up empty, remove the user
						? {
								...prev,
								receive: otherUsers,
						  }
						: //remove the item from user's list
						  {
								...prev,
								receive: [
									...otherUsers,
									{
										...oldItems,
										items: newItems,
									},
								],
						  };
			  })
			: setTradeList((prev) => {
					const newItems = prev.send[0].items.filter((o) => o.id !== item.id);
					return newItems.length === 0
						? {
								...prev,
								send: [],
						  }
						: {
								...prev,
								send: [
									{
										bestOwned: prev.send[0].bestOwned,
										items: prev.send[0].items.filter(
											(sendItem) => sendItem.id !== item.id
										),
									},
								],
						  };
			  });
	};
	return (
		<>
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<div
				key={user.id || "..."}
				className={`my-2 flex flex-col p-1 ${
					user.owner ? "sm:flex-row" : ""
				} border border-gray-600 dark:border-gray-400`}
			>
				<div>
					<div className='text-lg text-orange-500'>{user.owner || "You"}</div>
					<div className='max-h-80 divide-y divide-gray-500 overflow-auto'>
						{sortBy(user.items, ["mintBatch", "mintNumber"]).map((item) => (
							<div key={item.id} className='flex items-center'>
								<span className='mr-1'>
									{item.mintBatch}
									{item.mintNumber} {item.title}
								</span>
								<span
									className='ml-auto cursor-pointer text-red-500'
									title='Remove item'
									onClick={() => removeItem(item, user.owner)}
								>
									<IoMdClose />
								</span>
							</div>
						))}
					</div>
				</div>
				{user.owner && (
					<div className='flex flex-1 flex-col items-end p-1'>
						<button className='button mt-auto mb-1' onClick={openModal}>
							Preview Trades
						</button>
					</div>
				)}
				{showInfoModal && (
					<TradeInfoModal
						isOpen={showInfoModal}
						setIsOpen={setShowInfoModal}
						receive={user}
						send={myItems}
					/>
				)}
			</div>
		</>
	);
};
export default TradeInfoBox;
