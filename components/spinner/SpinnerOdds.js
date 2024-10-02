import { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@/components/Icons";
import isMobile from "@/utils/isMobile";

const SpinnerOdds = ({ spinnerInfo }) => {
	const [showTable, setShowTable] = useState(!isMobile());
	return (
		<>
			<div
				className={`${
					showTable ? "max-h-[75vh]" : "max-h-7"
				} text-gray-custom relative w-full overflow-hidden rounded-md border border-gray-800 text-center font-semibold transition-all duration-500 dark:border-gray-400 sm:w-96`}
			>
				<div
					className='inline-flex w-full items-center justify-center gap-1 bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-400 sm:hidden'
					onClick={() => setShowTable((prev) => !prev)}
				>
					Spinner odds
					{showTable ? <ArrowUpIcon /> : <ArrowDownIcon />}
				</div>

				<table className='h-full'>
					<thead className='bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-400'>
						<tr>
							<th>Item</th>
							<th>Chance (%)</th>
						</tr>
					</thead>
					<tbody className='text-center'>
						{spinnerInfo.items
							.sort((a, b) => b.chance - a.chance)
							.map((item) => (
								<tr
									className='border-b bg-white hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
									key={item.id}
								>
									<td className='py-0.5 px-1'>{item.name}</td>
									<th
										className='pr-1'
										title={`1 in ${Number(
											(100 / item.chance).toFixed(2).replace(/0+$/, "").replace(/\.$/, "")
										).toLocaleString()}`}
									>
										{item.chance}
									</th>
								</tr>
							))}
						<tr className='border-t-2 border-gray-500 bg-white hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600'>
							<td className='font-semibold'>Total</td>
							<th>{spinnerInfo.items.reduce((prev, curr) => prev + Number(curr.chance), 0).toFixed(4)}</th>
						</tr>
						<tr className='border-t border-gray-500 bg-white hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600'>
							<td className='font-semibold'>Silver return per 100 spins</td>
							<th>
								{(
									spinnerInfo.items.reduce(
										(prev, curr) => prev + (Number(curr.chance) / 100) * curr.properties.silvercoins,
										0
									) * 100
								).toLocaleString()}
							</th>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	);
};
export default SpinnerOdds;
