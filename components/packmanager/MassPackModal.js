import { useState, useEffect } from "react";
import { HiOutlineArrowCircleRight, HiOutlineArrowCircleLeft } from "react-icons/hi";
import { CDN } from "@/config/config";
import { useAxios } from "@/hooks/useAxios";
import PackSelection from "./PackSelection";
import ModalPage2 from "./ModalPage2";
import BigModal from "@/components/BigModal";

const MassPackModal = ({ packTemplate, showModal, setShowModal }) => {
	const { fetchData } = useAxios();
	const [page, setPage] = useState(1);
	const [selected, setSelected] = useState([]);
	const [action, setAction] = useState("list");
	const [marketInfo, setMarketInfo] = useState({});

	useEffect(() => {
		const fetchData = async () => {
			const data = await getMarketInfo(packTemplate.id);
			setMarketInfo(data);
		};
		fetchData();
	}, []);

	const getMarketInfo = async (packId) => {
		const { result, error } = await fetchData(`/api/market/pack/${packId}`);
		if (error) {
			console.error(error);
			return;
		}
		return result;
	};

	return (
		<BigModal
			header={`${packTemplate.name} - ${packTemplate.id}`}
			showModal={showModal}
			setShowModal={setShowModal}
			closeOnClick={true}
			hasToast={true}
		>
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
			<Footer page={page} setPage={setPage} disabled={selected.length > 0 ? false : true} />
		</BigModal>
	);
};
export default MassPackModal;

const Footer = ({ page, setPage, disabled }) => {
	return (
		<div className='relative bottom-0 z-20 mt-auto mb-1 flex h-10 border-t border-gray-700 pt-2 text-gray-800 dark:border-gray-300 dark:text-gray-300'>
			{page === 1 ? (
				<div
					className={`${
						disabled ? "cursor-not-allowed text-gray-400" : "cursor-pointer hover:text-orange-500"
					} ml-auto mr-4 flex`}
					onClick={() => !disabled && setPage(2)}
				>
					<span className='mr-1'>Next </span>
					<HiOutlineArrowCircleRight size={22} />
				</div>
			) : (
				<div className='mr-auto ml-4 flex cursor-pointer hover:text-orange-500' onClick={() => setPage(1)}>
					<HiOutlineArrowCircleLeft size={22} />
					<span className='ml-1'>Back </span>
				</div>
			)}
		</div>
	);
};
