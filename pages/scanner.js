import { useContext, useState, useEffect } from "react";
import axios from "axios";
import groupBy from "lodash/groupBy";
import isEmpty from "lodash/isEmpty";
import pickBy from "lodash/pickBy";
import sortBy from "lodash/sortBy";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "context/UserContext";
import Dropdown from "@/components/Dropdown";
import Meta from "@/components/Meta";
import UserSearch from "@/components/UserSearch";
import ScanResult from "@/components/scanner/ScanResults";
const coreNames = [
	"Common",
	"Uncommon",
	"Rare",
	"Epic",
	"Legendary",
	"Roles",
	"Mastery Roles",
	"Legendary Roles",
	"Tier 1 Superior",
	"Tier 2 Epic",
	"Tier 3 Legendary",
	"Pinnacle",
	"Signature Series",
];
const seasons = ["Founders Edition", "2018", "2019", "2020", "2021", "2022"];
const Scanner = () => {
	const { getCollections, user } = useContext(UserContext);
	const [collections, setCollections] = useState([]);
	const [selectedCollection, setSelectedCollection] = useState(null);
	const [selectedUser, setSelectedUser] = useState(null);
	const [showSearchSection, setShowSearchSection] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const [scanResults, setScanResults] = useState({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const groupCollections = async () => {
			const { data } = await getCollections();
			const grouped = groupBy(data.data, (col) => col.collection.properties.seasons[0]);
			Object.entries(grouped).forEach(([season, seasonCollections]) => {
				const coreGrouped = groupBy(
					pickBy(
						seasonCollections,
						(col) =>
							coreNames.includes(col.collection.properties.tiers[0]) &&
							!col.collection.physical
					),
					(col) => col.collection.properties.tiers[0]
				);

				const eventsGrouped = groupBy(
					pickBy(
						seasonCollections,
						(col) => col.collection.properties.types[0] === "event_primary"
					),
					(col) => col.collection.properties.tiers[0]
				);

				const nonEventsGrouped = groupBy(
					pickBy(
						seasonCollections,
						(col) =>
							col.collection.properties.types[0] !== "event_primary" &&
							!coreNames.includes(col.collection.properties.tiers[0])
					),
					(col) => col.collection.properties.tiers[0]
				);
				setCollections((prev) => [
					...prev,
					[
						season,
						isEmpty(eventsGrouped)
							? Object.entries({
									Core: [...Object.entries(coreGrouped)],
									...nonEventsGrouped,
							  })
							: Object.entries({
									Events: [...Object.entries(eventsGrouped)],
									Core: [...Object.entries(coreGrouped)],
									...nonEventsGrouped,
							  }),
					],
				]);
			});
		};
		groupCollections();
	}, []);

	const handleScan = async () => {
		if (!selectedUser) {
			toast.error("Please select a user", {
				toastId: "user-not-selected",
			});
			return;
		}
		if (!selectedCollection) {
			toast.error("Please select a collection", {
				toastId: "collection-not-selected",
			});
			return;
		}
		const scanUser = async (userId, collectionId) => {
			setLoading(true);
			setScanResults({});
			const { data } = await axios.get(`/api/users/scan`, {
				params: {
					collectionId: collectionId,
					userId: userId,
				},
				headers: {
					jwt: user.jwt,
				},
			});
			setLoading(false);
			return data;
		};
		const { data } = await scanUser(selectedUser.id, selectedCollection.collection.id);
		setScanResults(data);
	};
	return (
		<>
			<Meta title='Scanner | Kolex VIP' />

			<div className='mt-2 flex flex-col justify-center px-2'>
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
				<div
					className={`mt-10 flex ${
						showSearchSection ? "max-h-96" : "max-h-10"
					} relative mb-5 overflow-y-hidden rounded-md border border-gray-300 pb-2 transition-all duration-300`}
				>
					<div className='overflow-hidden'>
						<div className='p-2 px-4 font-semibold text-gray-300'>
							Selected User: {selectedUser?.username}
						</div>
						<UserSearch
							jwt={user.jwt}
							setSelectedUser={setSelectedUser}
							selectedUser={selectedUser}
							setShowSearchSection={setShowSearchSection}
							disabled={!showSearchSection}
						/>
					</div>
					<div className='absolute right-2 top-2'>
						{showSearchSection ? (
							<IoIosArrowDropup
								className='cursor-pointer text-orange-400 hover:text-orange-500'
								size={24}
								onClick={() => setShowSearchSection(false)}
								tabIndex={0}
								onKeyDown={(e) =>
									(e.key === "Enter" || e.key === "ArrowUp") &&
									setShowSearchSection(false)
								}
							/>
						) : (
							<IoIosArrowDropdown
								className='cursor-pointer text-orange-400 hover:text-orange-500'
								size={24}
								onClick={() => setShowSearchSection(true)}
								tabIndex={0}
								onKeyDown={(e) =>
									(e.key === "Enter" || e.key === "ArrowDown") &&
									setShowSearchSection(true)
								}
							/>
						)}
					</div>
				</div>

				<div
					className={`flex ${
						showDropdown ? "max-h-96 overflow-visible" : "max-h-10 overflow-hidden"
					} relative mb-5 rounded-md border border-gray-300 pb-2 transition-all duration-300`}
				>
					<div>
						<div className='p-2 px-4 font-semibold text-gray-300'>
							Selected Collection: {selectedCollection?.collection.properties.seasons[0]}{" "}
							- {selectedCollection?.collection.properties.tiers[0]} -{" "}
							{selectedCollection?.collection.name}
						</div>

						<div tabIndex={-1}>
							<Dropdown
								collections={sortBy(collections, (item) => seasons.indexOf(item[0]))}
								setSelectedCollection={setSelectedCollection}
								setShowDropdown={setShowDropdown}
							/>
						</div>
					</div>
					<div className='absolute right-2 top-2'>
						{showDropdown ? (
							<IoIosArrowDropup
								className='cursor-pointer text-orange-400 hover:text-orange-500'
								size={24}
								onClick={() => setShowDropdown(false)}
								tabIndex={0}
								onKeyDown={(e) =>
									(e.key === "Enter" || e.key === "ArrowUp") && setShowDropdown(false)
								}
							/>
						) : (
							<IoIosArrowDropdown
								className='cursor-pointer text-orange-400 hover:text-orange-500'
								size={24}
								onClick={() => setShowDropdown(true)}
								tabIndex={0}
								onKeyDown={(e) =>
									(e.key === "Enter" || e.key === "ArrowDown") && setShowDropdown(true)
								}
							/>
						)}
					</div>
				</div>
				<div className='flex w-full justify-center'>
					<button
						className='big-button disabled:cursor-not-allowed'
						onClick={handleScan}
						disabled={loading}
					>
						{loading ? (
							<div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-700'></div>
						) : (
							"Scan"
						)}
					</button>
				</div>
				{!isEmpty(scanResults) && (
					<div>
						<ScanResult
							scanResults={scanResults}
							user={selectedUser}
							collection={selectedCollection}
						/>
					</div>
				)}
			</div>
		</>
	);
};
export default Scanner;
