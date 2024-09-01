import { useContext, useState } from "react";
import sortBy from "lodash/sortBy";
import { UserContext } from "@/context/UserContext";
import PackGalleryItem from "./PackGalleryItem";

const PackGallery = ({ packs, searchQuery }) => {
	const { packGalleryColumns, setPackGalleryColumns } = useContext(UserContext);
	const [sortMethod, setSortMethod] = useState("newest");

	const getGridColumnClass = (columns) => {
		columns = columns.toString();
		switch (columns) {
			case "2":
				return "sm:grid-cols-2";
			case "3":
				return "sm:grid-cols-3";
			case "4":
				return "sm:grid-cols-4";
			case "5":
				return "sm:grid-cols-5";
			case "6":
				return "sm:grid-cols-6";
			case "7":
				return "sm:grid-cols-7";
			case "8":
				return "sm:grid-cols-8";
			default:
				return "sm:grid-cols-3"; // Default to 3 columns if none is specified
		}
	};
	return (
		<>
			<div className='text-gray-custom mx-4'>
				<label htmlFor='columns'>Columns: </label>
				<select
					id='columns'
					className='input-field mb-2 mr-3 w-14 text-center sm:mb-0'
					onChange={(e) => setPackGalleryColumns(() => e.target.value)}
					value={packGalleryColumns}
				>
					<option value='2'>2</option>
					<option value='3'>3</option>
					<option value='4'>4</option>
					<option value='5'>5</option>
					<option value='6'>6</option>
					<option value='7'>7</option>
					<option value='8'>8</option>
				</select>
			</div>
			<div className='text-gray-custom m-4 mb-2'>
				<label htmlFor='columns'>Sort: </label>
				<select
					id='columns'
					className='input-field mb-2 mr-3 w-28 sm:mb-0'
					onChange={(e) => setSortMethod(() => e.target.value)}
					defaultValue={sortMethod}
				>
					<option value='newest'>Newest</option>
					<option value='floor'>Floor</option>
					<option value='value'>Value</option>
					<option value='owned'>Owned</option>
				</select>
			</div>
			<div className={`mx-2 mt-2 grid grid-cols-2 gap-16 pb-8 ${getGridColumnClass(packGalleryColumns)}`}>
				{sortBy(
					packs
						.filter((pack) => pack.name.toLowerCase().includes(searchQuery.toLowerCase()))
						.filter((pack) => pack.packs.length > 0),
					sortMethod === "owned"
						? [(o) => -o.packs.length, (o) => -o.floor]
						: sortMethod === "floor"
						? [(o) => -o.floor, (o) => -o.packs.length]
						: sortMethod === "value"
						? [(o) => -o.floor * o.packs.length, (o) => -o.packs.length]
						: [(o) => -o.id] //id newest
				).map((packTemplate) => (
					<PackGalleryItem key={packTemplate.id} packTemplate={packTemplate} />
				))}
			</div>
		</>
	);
};
export default PackGallery;
