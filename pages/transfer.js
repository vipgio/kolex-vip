import { useState, useContext } from "react";
import { useAxios } from "hooks/useAxios";
import { UserContext } from "context/UserContext";
import Meta from "@/components/Meta";
import UserSearch from "@/components/UserSearch";
import Toggle from "@/components/transfer/Toggle";
import ReceiveModal from "@/components/transfer/ReceiveModal";
// import Toggle from "@/components/trade/Toggle";

const AccountTransfer = () => {
	const { user } = useContext(UserContext);
	const { fetchData } = useAxios();
	const [selectedUser, setSelectedUser] = useState(null);
	const [send, setSend] = useState(true);
	const [inProgress, setInProgress] = useState(false);

	const getAllTrades = async () => {
		// const { result, error } = fetchData('/api/trades')
	};

	return (
		<>
			<Meta title='Account Transfer | Kolex VIP' />
			<div className='mx-2'>
				<div className='relative mt-10 mb-5 flex max-h-96 overflow-y-hidden rounded-md border border-gray-700 pb-2 transition-all duration-300 dark:border-gray-300'>
					<div className='overflow-hidden'>
						<div className='p-2 px-4 font-semibold text-gray-700 dark:text-gray-300'>
							<span>Selected User: {selectedUser?.username}</span>
							{selectedUser && (
								<span
									className='ml-1 cursor-pointer text-red-500'
									title='Clear selection'
									onClick={() => setSelectedUser(null)}
								>
									x
								</span>
							)}
						</div>
						<UserSearch setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
					</div>
				</div>
				{/* <Toggle action={type} setAction={setType} /> */}
				{selectedUser && (
					<Toggle
						user={user}
						selectedUser={selectedUser}
						inProgress={inProgress}
						send={send}
						setSend={setSend}
					/>
				)}
				<div className='mt-3 flex'>
					<button
						className='button ml-auto'
						disabled={!selectedUser || inProgress}
						onClick={() => {
							!send && setInProgress(true);
						}}
					>
						Start
					</button>
				</div>
				{inProgress && (
					<ReceiveModal
						isOpen={inProgress && !send}
						setIsOpen={setInProgress}
						selectedUser={selectedUser}
					/>
				)}
			</div>
		</>
	);
};
export default AccountTransfer;

/*
Step 1: select target user, select transfer type (send, accept)

Send: load all collections, scan and add to a list. send trades for 50 chunks


Accept: load all trades where user2=target, accept all




*/
