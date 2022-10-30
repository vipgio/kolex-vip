import { useContext, useState } from "react";
import sortBy from "lodash/sortBy";
import { UserContext } from "context/UserContext";
import Toggle from "./Toggle";
import TradeInfoBox from "./TradeInfoBox";

const TradeModal = ({ setShowModal }) => {
	const { tradeList, setTradeList, user: me } = useContext(UserContext);
	console.log(tradeList);
	const [tradeType, setTradeType] = useState("receive");
	const dataToShow =
		tradeType === "send" ? tradeList.send || [] : sortBy(tradeList.receive, "owner");
	const myItems = tradeList.send && tradeList.send[0];

	// const removeUser = (user) => {
	// 	setTradeList((prev) => prev.filter((o) => o.owner !== user));
	// };

	return (
		<div className='fixed inset-0 z-30 flex flex-col items-center justify-center overscroll-none bg-black/90'>
			<div className='absolute inset-0 z-20 my-auto mx-8 flex h-fit max-h-[90vh] flex-col overflow-hidden overscroll-none rounded-md bg-gray-200 dark:bg-gray-900 sm:mx-16'>
				<div
					className='relative flex h-12 w-full items-center border-b border-b-white/10 bg-gray-300 dark:bg-gray-800' /*modal header*/
				>
					<h1
						className='mx-auto py-2 text-3xl text-gray-800 dark:text-gray-200'
						onClick={() => console.log(tradeList)}
					>
						Trade
					</h1>
					<button
						className='absolute right-0 top-0 h-12 w-12 p-1 text-gray-900 transition-colors duration-300 hover:cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300 active:bg-indigo-300 active:text-orange-400 dark:text-gray-200 dark:hover:bg-gray-700'
						onClick={() => {
							setShowModal(false);
						}}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							strokeWidth={2}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>

				<div className='my-3'>
					<Toggle action={tradeType} setAction={setTradeType} />
				</div>
				<div className='h-[30rem] max-h-full overflow-auto border'>
					<div className='p-2 text-gray-700 dark:text-gray-300'>
						{dataToShow.map((user) => (
							<TradeInfoBox
								user={user}
								key={user.id || "me"}
								myItems={myItems}
								setTradeList={setTradeList}
							/>
						))}
					</div>
				</div>
			</div>
			<div //fullscreen close button
				className='fixed z-10 h-screen w-screen'
				onClick={() => setShowModal(false)}
			></div>
		</div>
	);
};
export default TradeModal;
