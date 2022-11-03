import { useContext, useState } from "react";
import { useInView } from "react-intersection-observer";
import sortBy from "lodash/sortBy";
import { useTrade } from "hooks/useTrade";
import FullListRow from "./FullListRow";
import { UserContext } from "context/UserContext";
import { FaBan, FaLock } from "react-icons/fa";

const FullList = ({ results, owner, isSelfScan, ownedItems, filterMethod }) => {
	const { isInList, addItem, removeItem } = useTrade();
	const { user } = useContext(UserContext);
	const allowed = user.info.allowed.includes("trades");
	const [sortMethod, setSortMethod] = useState("mint");
	const [show, setShow] = useState(0);

	const handleSort = (e) => {
		setSortMethod(e.target.value);
	};

	const addAll = () => {
		results.forEach((item) => {
			if (item.status === "available" && !isInList(isSelfScan, item)) {
				addItem(isSelfScan, item, owner, ownedItems);
			}
		});
	};

	const removeAll = () => {
		results.forEach((item) => {
			if (isInList(isSelfScan, item)) {
				removeItem(isSelfScan, item, owner);
			}
		});
	};

	const { ref } = useInView({
		rootMargin: "-10px",
		onChange: (inView) => {
			if (inView && show < results.length) {
				setShow((prev) => prev + 50);
				console.log(show + 50);
				inView = false;
			}
		},
	});

	return (
		<>
			<div className='flex items-center p-2'>
				<div>
					<label htmlFor='sort' className='mr-1 text-gray-800 dark:text-gray-300'>
						Sort By:{" "}
					</label>
					<select
						name='sort'
						id='sort'
						className='rounded-md border border-gray-700 p-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-300'
						onChange={handleSort}
					>
						<option value='mint'>Mint</option>
						{!isSelfScan && <option value='points'>Point gain</option>}
						<option value='circ'>Circulation</option>
					</select>
				</div>
				{(filterMethod === "best" ||
					filterMethod === "second" ||
					filterMethod === "worst") && (
					<div className='ml-auto flex'>
						<button
							className='simple-button text-sm sm:text-base'
							onClick={removeAll}
							disabled={!allowed}
							title='You need "trades" access for this feature.'
						>
							{!allowed && <FaLock className='mr-1 text-gray-800' />}
							Remove all from trade list
						</button>
						<button
							className='simple-button ml-2 text-sm sm:text-base'
							onClick={addAll}
							disabled={!allowed}
							title='You need "trades" access for this feature.'
						>
							{!allowed && <FaLock className='mr-1 text-gray-800' />}
							Add all to trade list
						</button>
					</div>
				)}
			</div>
			<div className='overflow-x-auto'>
				<table className='w-full table-auto overflow-hidden border-t text-gray-600 transition-colors dark:text-gray-400'>
					<thead className='border-b bg-gray-300 uppercase text-gray-700 transition-colors dark:border-gray-300 dark:bg-gray-700 dark:text-gray-400'>
						<tr>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Mint</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Title</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Circulation</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Listed</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Item Points</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>ID</th>
							{!isSelfScan && <th className='py-1 px-2 sm:py-3 sm:px-6'>Point gain</th>}
							<th className='py-1 px-2 sm:py-3 sm:px-6'>History</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Trade List</th>
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
								: sortMethod === "points"
								? [
										(o) => -o.delta,
										"mintBatch",
										"mintNumber",
										(o) => -o.signatureImage,
										"inCirculation",
								  ]
								: [
										"inCirculation",
										"mintBatch",
										"mintNumber",
										(o) => -o.signatureImage,
										(o) => -o.delta,
								  ]
						)
							.slice(0, show + 100)
							.map((item) => (
								<FullListRow
									key={item.id}
									item={item}
									owner={owner}
									isSelfScan={isSelfScan}
									ownedItems={ownedItems}
								/>
							))}
						<tr>
							<td ref={ref}></td>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	);
};
export default FullList;
