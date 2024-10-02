import { useEffect, useRef } from "react";
import { webApp } from "@/config/config";
import Dialog from "@/HOC/Dialog";
import { LinkIcon } from "@/components/Icons";
import fixDecimal from "@/utils/NumberUtils";

const Leaderboard = ({ isOpen, setIsOpen, Leaderboard, points, rank, collection }) => {
	const itemRefs = useRef([]);

	const scrollToIndex = (index) => {
		if (itemRefs.current[index]) {
			itemRefs.current[index].scrollIntoView({ behavior: "smooth", block: "center" });
		}
		if (index >= 120) {
			itemRefs.current[119].scrollIntoView({ behavior: "smooth", block: "center" });
		}
	};
	useEffect(() => {
		scrollToIndex(rank);
	}, [rank]);

	return (
		<>
			<Dialog
				title={`Leaderboard - ${collection.collection.description}`}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				closeButton
				extraButton={<ExtraButton id={collection.collection.id} />}
			>
				<div className='flex max-h-96 flex-col overflow-auto rounded border border-gray-700 dark:border-gray-300'>
					<table className='table-auto p-1'>
						<thead className='bg-gray sticky top-0 bg-gray-300 dark:bg-gray-700'>
							<tr>
								<th className='table-cell text-center'>Rank</th>
								<th className='table-cell text-center'>Points</th>
								<th className='table-cell text-center'>Point Difference</th>
							</tr>
						</thead>
						<tbody>
							{Leaderboard.map((item, index) => (
								<tr
									key={index}
									className={`${
										index === rank && points === fixDecimal(item * 10)
											? "bg-gray-300 dark:bg-gray-700"
											: "dark:bg-gray-800"
									} ${
										index === rank && points !== fixDecimal(item * 10) ? "border-t-4 border-primary-500" : ""
									} ${
										[3, 10, 25, 50, 100].includes(index + 1) ? "border-b border-gray-500" : ""
									} hover:bg-gray-300 dark:hover:bg-gray-700`}
									ref={(el) => (itemRefs.current[index] = el)}
								>
									<td className='table-cell text-center'>{index + 1}</td>
									<td className='table-cell text-center'>{fixDecimal(fixDecimal(item * 10))}</td>
									<td className='table-cell text-center'>
										{points >= fixDecimal(item * 10) ? "" : "+"}
										{fixDecimal(fixDecimal(item * 10) - points)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Dialog>
		</>
	);
};
export default Leaderboard;

const ExtraButton = ({ id }) => {
	const url = `${webApp}/leaderboard?collection=${id}`;
	return (
		// <button type='button' className='button'>
		<a
			href={url}
			target='_blank'
			rel='noreferrer noopener'
			className='button inline-flex items-center hover:underline'
		>
			Open LB in Kolex <LinkIcon />
		</a>
		// </button>
	);
};
