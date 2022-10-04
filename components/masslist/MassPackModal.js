import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { HiOutlineArrowCircleRight, HiOutlineArrowCircleLeft } from "react-icons/hi";

import { UserContext } from "context/UserContext";
import { CDN } from "@/config/config";
import PackSelection from "./PackSelection";
import ModalPage2 from "./ModalPage2";

const MassPackModal = ({ packTemplate, setShowModal }) => {
	const { user } = useContext(UserContext);
	const [page, setPage] = useState(1);
	const [selected, setSelected] = useState([]);
	const [action, setAction] = useState("list");
	const [marketInfo, setMarketInfo] = useState({});
	//set marketInfo equal to getmarketInfo function value
	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getMarketInfo(packTemplate.id);
			setMarketInfo(data);
		};
		fetchData();
	}, []);

	const getMarketInfo = async (packId) => {
		const { data } = await axios.get(`/api/market/pack/${packId}`, {
			headers: {
				jwt: user.jwt,
			},
		});
		return data;
	};

	return (
		<>
			<div className='fixed inset-0 z-30 flex flex-col items-center justify-center bg-black/70'>
				<div className='absolute inset-0 z-20 my-8 mx-8 box-content flex flex-col overflow-hidden rounded-md bg-gray-100 dark:bg-gray-900 sm:mx-24'>
					<div
						className='relative flex h-12 w-full items-center border-b border-b-white/10 bg-gray-300 dark:bg-gray-800' /*modal header*/
					>
						<h1 className='mx-auto py-2 text-3xl text-gray-800 dark:text-gray-200'>
							{packTemplate.name}
						</h1>
						<button
							className='absolute right-0 top-0 h-12 w-12 p-1 text-gray-800 transition-colors duration-300 hover:cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300 active:bg-indigo-300 active:text-orange-400 dark:text-gray-200 dark:hover:bg-gray-700'
							onClick={() => setShowModal(false)}
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
					{page === 1 ? (
						<PackSelection
							packTemplate={packTemplate}
							selected={selected}
							setSelected={setSelected}
							marketInfo={marketInfo}
							CDN={CDN}
							setPage={setPage}
						/>
					) : (
						<ModalPage2
							selected={selected}
							setSelected={setSelected}
							packTemplate={packTemplate}
							action={action}
							setAction={setAction}
							setPage={setPage}
							CDN={CDN}
						/>
					)}
					<Footer
						page={page}
						setPage={setPage}
						disabled={selected.length > 0 ? false : true}
					/>
				</div>
				<div //fullscreen close button
					className='fixed z-10 h-screen w-screen'
					onClick={() => setShowModal(false)}
				></div>
			</div>
		</>
	);
};
export default MassPackModal;

const Footer = ({ page, setPage, disabled }) => {
	return (
		<div className='relative bottom-0 z-20 mt-auto mb-1 flex h-10 border-t border-gray-700 pt-2 text-gray-800 dark:border-gray-300 dark:text-gray-300'>
			{page === 1 ? (
				<div
					className={`${
						disabled
							? "cursor-not-allowed text-gray-400"
							: "cursor-pointer hover:text-orange-500"
					} ml-auto mr-4 flex`}
					onClick={() => !disabled && setPage(2)}
				>
					<span className='mr-1'>Next </span>
					<HiOutlineArrowCircleRight size={22} />
				</div>
			) : (
				<div
					className='mr-auto ml-4 flex cursor-pointer hover:text-orange-500'
					onClick={() => setPage(1)}
				>
					<HiOutlineArrowCircleLeft size={22} />
					<span className='ml-1'>Back </span>
				</div>
			)}
		</div>
	);
};
