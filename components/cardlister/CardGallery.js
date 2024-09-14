import { useEffect, useState } from "react";
import sortBy from "lodash/sortBy";
import { maxPrice, minPrice } from "@/config/config";
import AdvancedModal from "./AdvancedModal";
import SimpleModal from "./SimpleModal";
import Tooltip from "../Tooltip";
import FiltersModal from "./FiltersModal";
import CardGalleryItem from "./CardGalleryItem";
import Delister from "./delister/Delister";

const CardGallery = ({ templates, user }) => {
	const [selectedTemplates, setSelectedTemplates] = useState([]);
	const [showAdvancedModal, setShowAdvancedModal] = useState(false);
	const [showSimpleModal, setShowSimpleModal] = useState(false);
	const [showDelister, setShowDelister] = useState(false);
	const [showFiltersModal, setShowFiltersModal] = useState(false);
	const [sortMethod, setSortMethod] = useState("listed");
	const defaultFilters = { minOwned: 1, minFloor: minPrice, maxFloor: maxPrice };
	const [filters, setFilters] = useState(defaultFilters);

	const totalValue = templates
		.filter((item) => item.count)
		.reduce((acc, cur) => acc + (cur.floor ? cur.floor * cur.count : 0), 0);

	useEffect(() => {
		setSelectedTemplates((prev) =>
			prev
				.filter((item) => item.count)
				.filter(
					(item) =>
						item.count >= filters.minOwned &&
						!(item.floor > filters.maxFloor) &&
						!(item.floor < filters.minFloor)
				)
		);
	}, [filters.minFloor, filters.maxFloor, filters.minOwned]);

	return (
		<>
			<div className='m-2'>
				<label htmlFor='sort' className='text-gray-800 dark:text-gray-200'>
					Sort By:
				</label>
				<select
					name='sort'
					id='sort'
					className='dropdown mx-2 my-1 sm:mb-0'
					onChange={(e) => setSortMethod(e.target.value)}
					value={sortMethod}
				>
					<option value='listed'>Listed</option>
					<option value='owned'>Owned</option>
					<option value='floor'>Floor</option>
					<option value='circ'>Circulation</option>
					<option value='value'>Value</option>
				</select>
			</div>

			<div className='ml-1 flex h-full'>
				<div className='mb-1 flex flex-col'>
					<div className='mt-1 ml-1 mb-2 flex items-center sm:mt-2'>
						<button
							className='button sm:mb-0'
							onClick={() => setShowDelister(true)}
							disabled={!selectedTemplates.length}
						>
							Manage
						</button>
						<Tooltip direction='right' text='Manage listings for the selected items' />
					</div>
					<div>
						<button
							onClick={() =>
								setSelectedTemplates(
									templates
										.filter((item) => item.count)
										.filter(
											(item) =>
												item.count >= filters.minOwned &&
												!(item.floor > filters.maxFloor) &&
												!(item.floor < filters.minFloor)
										)
								)
							}
							className='simple-button m-1'
						>
							Select All
						</button>
						<button
							onClick={() =>
								setSelectedTemplates(
									templates
										.filter((item) => item.count && !item.listed && item.listed !== item.count)
										.filter(
											(item) =>
												item.count >= filters.minOwned &&
												!(item.floor > filters.maxFloor) &&
												!(item.floor < filters.minFloor)
										)
								)
							}
							className='simple-button m-1'
						>
							All Not Listed
						</button>
						<button
							onClick={() =>
								setSelectedTemplates(
									templates
										.filter((item) => item.count && item.listed)
										.filter(
											(item) =>
												item.count >= filters.minOwned &&
												!(item.floor > filters.maxFloor) &&
												!(item.floor < filters.minFloor)
										)
								)
							}
							className='simple-button m-1'
						>
							All Listed
						</button>
						<button onClick={() => setSelectedTemplates([])} className='simple-button m-1'>
							Deselect All
						</button>
						<button onClick={() => setShowFiltersModal(true)} className='button sm:nml-10 m-1'>
							Filters
						</button>
					</div>
				</div>
				<div className='ml-auto flex flex-col justify-end py-2.5 sm:block'>
					<div className='mb-2 flex items-center'>
						<Tooltip direction='left' text='Pick mints and price for each item' />
						<button
							className='button mr-2 sm:mb-0'
							onClick={() => setShowAdvancedModal(true)}
							disabled={!selectedTemplates.length}
						>
							Advanced
						</button>
					</div>
					<div className='mt-1 flex items-center sm:mt-2'>
						<Tooltip direction='left' text='Pick mints or set count for all items at once' />
						<button
							className='button mr-2 w-full sm:mb-0'
							onClick={() => setShowSimpleModal(true)}
							disabled={!selectedTemplates.length}
						>
							Simple
						</button>
					</div>
				</div>
			</div>

			{totalValue > 0 && (
				<div className='text-gray-custom ml-2 mt-1 flex items-center font-semibold'>
					Total set value: ${totalValue.toFixed(2)}
					<Tooltip
						direction='right'
						text='Total value of all items based on floor price, regardless of mint'
					/>
				</div>
			)}
			<div className='m-2 mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6'>
				{sortBy(
					templates,
					sortMethod === "owned"
						? [(o) => -o.count, (o) => -o.floor]
						: sortMethod === "floor"
						? [(o) => -o.floor, (o) => -o.count]
						: sortMethod === "circ"
						? [(o) => -o.inCirculation, (o) => -o.count]
						: sortMethod === "value"
						? [(o) => -o.floor * o.count, (o) => -o.count]
						: [(o) => o.listed, (o) => -o.count, (o) => -o.floor] //listed
				)
					.filter((item) => item.count)
					.filter(
						(item) =>
							item.count >= filters.minOwned &&
							!(item.floor > filters.maxFloor) &&
							!(item.floor < filters.minFloor)
					)
					.map((item) => (
						<CardGalleryItem
							item={item}
							selectedTemplates={selectedTemplates}
							setSelectedTemplates={setSelectedTemplates}
							key={item.uuid}
						/>
					))}
			</div>

			{showFiltersModal && (
				<FiltersModal
					isOpen={showFiltersModal}
					setIsOpen={setShowFiltersModal}
					filters={filters}
					setFilters={setFilters}
					defaultFilters={defaultFilters}
				/>
			)}
			{showAdvancedModal && (
				<AdvancedModal
					showModal={showAdvancedModal}
					setShowModal={setShowAdvancedModal}
					selectedTemplates={selectedTemplates}
					user={user}
					templates={templates}
				/>
			)}
			{showSimpleModal && (
				<SimpleModal
					showModal={showSimpleModal}
					user={user}
					setShowModal={setShowSimpleModal}
					selectedTemplates={selectedTemplates}
					templates={templates}
				/>
			)}
			{showDelister && (
				<Delister
					showModal={showDelister}
					user={user}
					setShowModal={setShowDelister}
					selectedTemplates={selectedTemplates}
					templates={templates}
				/>
			)}
		</>
	);
};
export default CardGallery;
