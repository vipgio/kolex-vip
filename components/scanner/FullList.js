import { useContext, useState } from "react";

import sortBy from "lodash/sortBy";
import { useInView } from "react-intersection-observer";

import { UserContext } from "@/context/UserContext";

import HistoryModal from "@/components/history/HistoryModal";

import FullListRow from "./FullListRow";
import MarketModal from "./MarketModal";

const FullList = ({ results, isSelfScan, singleUserSearch }) => {
	const [sortMethod, setSortMethod] = useState("mint");
	const [show, setShow] = useState(0);
	const [selectedItem, setSelectedItem] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isMarketOpen, setIsMarketOpen] = useState(false);
	const { user } = useContext(UserContext);

	const handleSort = (e) => {
		setSortMethod(e.target.value);
	};

	const { ref } = useInView({
		rootMargin: "-10px",
		onChange: (inView) => {
			if (inView && show < results.length) {
				setShow((prev) => prev + 50);
				inView = false;
			}
		},
	});

	const openModal = (item) => {
		setSelectedItem(item);
		setIsModalOpen(true);
	};

	const openMarket = (item) => {
		setSelectedItem(item);
		setIsMarketOpen(true);
	};

	return (
		<>
			<div className='flex items-center p-2'>
				<div>
					<label htmlFor='sort' className='text-gray-custom mr-1'>
						Sort By:{" "}
					</label>
					<select name='sort' id='sort' className='dropdown' onChange={handleSort}>
						<option value='mint'>Mint</option>
						{!isSelfScan && <option value='gain'>Point gain</option>}
						<option value='circ'>Circulation</option>
						<option value='points'>Points</option>
					</select>
				</div>
			</div>
			<div className='overflow-x-auto'>
				<table className='w-full table-auto overflow-hidden border-t text-gray-600 transition-colors dark:text-gray-400'>
					<thead className='text-gray-custom border-b bg-gray-300 uppercase transition-colors dark:border-gray-300 dark:bg-gray-700'>
						<tr>
							<th className='table-cell'>Mint</th>
							<th className='table-cell'>Title</th>
							<th className='table-cell'>Circulation</th>
							<th className='table-cell'>Listed</th>
							<th className='table-cell'>Item Points</th>
							<th className='table-cell'>ID</th>
							{!singleUserSearch && <th className='table-cell'>Owner</th>}
							{!isSelfScan && <th className='table-cell'>Point gain</th>}
							<th className='table-cell'>History</th>
						</tr>
					</thead>
					<tbody className='text-center transition-colors'>
						{sortBy(
							results,
							sortMethod === "mint"
								? [
										"mintBatch",
										"mintNumber",
										(o) => -o.signatureImage,
										(o) => -o.delta,
										"inCirculation",
									]
								: sortMethod === "gain"
									? [
											(o) => -o.delta,
											"mintBatch",
											"mintNumber",
											(o) => -o.signatureImage,
											"inCirculation",
										]
									: sortMethod === "points"
										? [
												(o) => -o.rating,
												"mintBatch",
												"mintNumber",
												"inCirculation",
												(o) => -o.signatureImage,
											]
										: [
												"inCirculation",
												"mintBatch",
												"mintNumber",
												(o) => -o.signatureImage,
												(o) => -o.delta,
											],
						)
							.slice(0, show + 100)
							.map((item) => (
								<FullListRow
									key={item.id}
									item={item}
									isSelfScan={isSelfScan}
									singleUserSearch={singleUserSearch}
									openModal={openModal}
									openMarket={openMarket}
									user={user}
								/>
							))}
						<tr>
							<td ref={ref} className='p-0'></td>
						</tr>
					</tbody>
				</table>
				{isModalOpen && selectedItem && (
					<HistoryModal
						data={selectedItem}
						isOpen={isModalOpen}
						setIsOpen={setIsModalOpen}
						type={selectedItem.type}
						method={selectedItem.type === "card" ? "uuid" : undefined}
					/>
				)}
				{isMarketOpen && selectedItem && (
					<MarketModal
						item={selectedItem}
						isOpen={isMarketOpen}
						setIsOpen={setIsMarketOpen}
						user={user}
					/>
				)}
			</div>
		</>
	);
};
export default FullList;
