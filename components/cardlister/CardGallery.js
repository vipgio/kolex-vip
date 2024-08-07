import { useEffect, useState } from "react";
import sortBy from "lodash/sortBy";
import { maxPrice, minPrice } from "@/config/config";
import AdvancedModal from "./AdvancedModal";
import SimpleModal from "./SimpleModal";
import Tooltip from "../Tooltip";
import FiltersModal from "./FiltersModal";
import CardGalleryItem from "./CardGalleryItem";

const CardGallery = ({ templates, user }) => {
	const [selectedTemplates, setSelectedTemplates] = useState([]);
	const [showAdvancedModal, setShowAdvancedModal] = useState(false);
	const [showSimpleModal, setShowSimpleModal] = useState(false);
	const [showFiltersModal, setShowFiltersModal] = useState(false);
	const [sortMethod, setSortMethod] = useState("listed");
	const defaultFilters = { minOwned: 1, minFloor: minPrice, maxFloor: maxPrice };
	const [filters, setFilters] = useState(defaultFilters);

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
				</select>
			</div>

			<div className='ml-1 flex h-full'>
				<div className='flex items-end'>
					<button
						onClick={() =>
							setSelectedTemplates(
								templates
									.filter((item) => item.count && item.listed !== item.count)
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
					<button onClick={() => setSelectedTemplates([])} className='simple-button m-1'>
						Deselect All
					</button>
					<button onClick={() => setShowFiltersModal(true)} className='simple-button m-1'>
						Filters
					</button>
				</div>
				<div className='ml-auto flex flex-col justify-end py-1 sm:block'>
					<div className='mb-2 flex items-center'>
						<Tooltip direction='left' text='Pick mints and price for each item' />
						<button
							className='button mr-2 sm:mb-0'
							onClick={() => {
								setShowAdvancedModal(true);
							}}
							disabled={!selectedTemplates.length}
						>
							Advanced
						</button>
					</div>
					<div className='mt-1 flex items-center sm:mt-2'>
						<Tooltip direction='left' text='Pick mints or set count for all items at once' />
						<button
							className='button mr-2 w-full sm:mb-0'
							onClick={() => {
								setShowSimpleModal(true);
							}}
							disabled={!selectedTemplates.length}
						>
							Simple
						</button>
					</div>
				</div>
			</div>

			<div className='m-2 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5'>
				{sortBy(
					templates,
					sortMethod === "owned"
						? [(o) => -o.count, (o) => -o.floor]
						: sortMethod === "floor"
						? [(o) => -o.floor, (o) => -o.count]
						: [(o) => o.listed, (o) => -o.count, (o) => -o.floor]
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
		</>
	);
};
export default CardGallery;
