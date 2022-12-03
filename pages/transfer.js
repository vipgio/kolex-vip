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
	const [selectedUser, setSelectedUser] = useState(null);
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
	}, [selectedUser?.id]);

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
			<div className='mx-2'>
				<div className='relative mt-10 mb-5 flex max-h-96 overflow-y-hidden rounded-md border border-gray-700 pb-2 transition-all duration-300 dark:border-gray-300'>
					<div className='overflow-hidden'>
						<div className='p-2 px-4 font-semibold text-gray-700 dark:text-gray-300'>
							<span>Selected User: {selectedUser?.username}</span>
						</div>
						<UserSearch setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
					</div>
				</div>
				{selectedUser && (
					<Toggle
						user={user}
						selectedUser={selectedUser}
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
						disabled={!selectedUser || loading || selectedUser.id === user.user.id}
						onClick={handleStart}
					>
						Next
					</button>
				</div>
				{showReceiveSection && (
					<ReceiveSection
						selectedUser={selectedUser}
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
							selectedUser={selectedUser}
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
