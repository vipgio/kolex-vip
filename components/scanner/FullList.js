import { useState } from "react";
import { useInView } from "react-intersection-observer";
import sortBy from "lodash/sortBy";
import FullListRow from "./FullListRow";

const FullList = ({ results, owner, isSelfScan, ownedItems, singleUserSearch }) => {
	const [sortMethod, setSortMethod] = useState("mint");
	const [show, setShow] = useState(0);

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

	return (
		<>
			<div className='flex items-center p-2'>
				<div>
					<label htmlFor='sort' className='mr-1 text-gray-800 dark:text-gray-300'>
						Sort By:{" "}
					</label>
					<select name='sort' id='sort' className='dropdown' onChange={handleSort}>
						<option value='mint'>Mint</option>
						{!isSelfScan && <option value='points'>Point gain</option>}
						<option value='circ'>Circulation</option>
					</select>
				</div>
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
							{!singleUserSearch && <th className='py-1 px-2 sm:py-3 sm:px-6'>Owner</th>}
							{!isSelfScan && <th className='py-1 px-2 sm:py-3 sm:px-6'>Point gain</th>}
							<th className='py-1 px-2 sm:py-3 sm:px-6'>History</th>
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
									singleUserSearch={singleUserSearch}
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
