import { useState, useContext, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { UserContext } from "context/UserContext";
import Meta from "@/components/Meta";
import UserSearch from "@/components/UserSearch";
import Toggle from "@/components/transfer/Toggle";
import ReceiveSection from "@/components/transfer/ReceiveSection";
import SendSection from "@/components/transfer/SendSection";
import "react-toastify/dist/ReactToastify.css";
import ModeSelection from "@/components/transfer/ModeSelection";

const AccountTransfer = () => {
	const { user } = useContext(UserContext);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [transferMode, setTransferMode] = useState(null);
	const [send, setSend] = useState(true);
	const [loading, setLoading] = useState(false);
	const [showReceiveSection, setShowReceiveSection] = useState(false);
	const [showSendSection, setShowSendSection] = useState(false);

	const handleStart = () => {
		if (send) {
			setShowSendSection(true);
			setShowReceiveSection(false);
		} else {
			setShowSendSection(false);
			setShowReceiveSection(true);
		}
	};

	useEffect(() => {
		setShowReceiveSection(false);
		setShowSendSection(false);
	}, [selectedUsers[0]?.id]);

	return (
		<>
			<Meta title='Account Transfer | Kolex VIP' />
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
			<div className='mt-10 p-2 text-2xl font-semibold text-gray-700 dark:text-gray-300'>
				<span>
					Transfers left:
					<span
						className={`${
							user.info.transfers > 0 ? "text-green-500" : "text-red-500"
						} ml-1`}
					>
						{user.info.transfers}
					</span>
				</span>
			</div>
			<div className='mx-2'>
				<div className='relative mt-2 mb-5 flex max-h-96 overflow-y-hidden rounded-md border border-gray-700 pb-2 transition-all duration-300 dark:border-gray-300'>
					<div className='overflow-hidden'>
						<div className='p-2 px-4 font-semibold text-gray-700 dark:text-gray-300'>
							<span>
								Selected User: {selectedUsers.length > 0 && selectedUsers[0].username}
							</span>
						</div>
						<UserSearch
							setSelectedUsers={setSelectedUsers}
							selectedUsers={selectedUsers}
							allowed={user.info.transfers > 0}
						/>
					</div>
				</div>
				{selectedUsers.length > 0 && (
					<Toggle
						user={user}
						selectedUser={selectedUsers[0]}
						inProgress={loading}
						send={send}
						setSend={setSend}
					/>
				)}
				<div className='mt-3 flex'>
					{" "}
					{/* accept received trades*/}
					<button
						className='button ml-auto'
						disabled={
							!selectedUsers.length > 0 || loading || selectedUsers[0].id === user.user.id
						}
						onClick={handleStart}
					>
						Next
					</button>
				</div>
				{showReceiveSection && (
					<ReceiveSection
						selectedUser={selectedUsers[0]}
						loading={loading}
						setLoading={setLoading}
					/>
				)}
				{showSendSection && (
					<div className='relative my-3 flex flex-col rounded-md border border-gray-700 dark:border-gray-300 xs:flex-row'>
						<ModeSelection
							transferMode={transferMode}
							setTransferMode={setTransferMode}
						/>
						<SendSection
							transferMode={transferMode}
							selectedUser={selectedUsers[0]}
							user={user}
							loading={loading}
							setLoading={setLoading}
						/>
					</div>
				)}
			</div>
		</>
	);
};
export default AccountTransfer;
