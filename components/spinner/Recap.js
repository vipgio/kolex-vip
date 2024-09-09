import { useState } from "react";
import countBy from "lodash/countBy";
import Dialog from "@/HOC/Dialog";
import fixDecimal from "@/utils/NumberUtils";

// import { spins } from "./spinsLocal";

const Recap = ({ spins, items, isOpen, setIsOpen }) => {
	const [showMints, setShowMints] = useState(false);
	const counted = Object.entries(countBy(spins, "id")).map(([id, count]) => {
		const mints = spins
			.filter((spinItems) => spinItems.id == id && spinItems.cards.length > 0)
			.map((item) => item.cards[0].mintNumber)
			.sort((a, b) => a - b);
		return (mints.length > 0 && [id, count, mints]) || [id, count];
	});
	const totalSpent =
		counted.reduce(
			(acc, cur) => acc + items.find((item) => item.id === Number(cur[0])).properties.silvercoins * cur[1],
			0
		) -
		spins.length * 1000;
	const shouldHaveSpent = fixDecimal(
		(
			(items.reduce((prev, curr) => prev + (Number(curr.chance) / 100) * curr.properties.silvercoins, 0) -
				1000) *
			spins.length
		).toFixed(0)
	);
	const diff = fixDecimal(-((totalSpent - shouldHaveSpent) / shouldHaveSpent) * 100).toFixed(2);

	const closeModal = () => setIsOpen(false);

	return (
		<Dialog isOpen={isOpen} setIsOpen={setIsOpen} title={`Spins Recap: ${spins.length} spins`}>
			<div className='text-gray-custom my-1 overflow-auto rounded border border-gray-700/20 p-1 dark:border-gray-300/20'>
				<div className='max-h-[75vh] divide-y divide-gray-700/20 overflow-auto dark:divide-gray-300/20'>
					{counted
						.sort((a, b) => b[1] - a[1])
						.map(([id, count, mints]) => {
							const chanceDiff =
								(count / spins.length) * 100 - //my %
								items.find((item) => item.id === Number(id)).chance; //spinner odds

							return (
								<div key={id}>
									{items.find((item) => item.id === Number(id)).name}:{" "}
									<span className='font-semibold'>{count}</span> (
									<span className={`${chanceDiff >= 0 ? "text-green-400" : "text-red-400"}`}>
										{((count / spins.length) * 100).toFixed(2)}%
									</span>
									)
									{mints &&
										(showMints ? (
											<div className='py-1 px-0.5 text-xs'>
												{mints &&
													mints.map((mint, i) => [
														i > 0 && <span key={i}>, </span>,
														<span key={mint + i}>{mint}</span>,
													])}
											</div>
										) : (
											<span>{` (...)`}</span>
										))}
								</div>
							);
						})}
				</div>
				<div className='mt-2 border-t border-gray-700/50 dark:border-gray-300/50'>
					<div className='font-semibold'>Silver: {totalSpent.toLocaleString()} Silvercoins</div>

					<div className='text-xs'>
						Silver you should have spent based on the odds:{" "}
						<span className='text-sm'>{shouldHaveSpent.toLocaleString()} </span>
						Silvercoins (
						<span className={`${diff >= 0 ? "text-green-400" : "text-red-400"}`}>
							{[diff > 0 && "+", diff.toLocaleString()]}%
						</span>
						)
					</div>
				</div>
			</div>
			<div className='mt-4 flex justify-between'>
				<button type='button' className='button' onClick={closeModal}>
					Close
				</button>
				<button type='button' className='button' onClick={() => setShowMints((prev) => !prev)}>
					{showMints ? "Hide" : "Show"} Mints
				</button>
			</div>
		</Dialog>
	);
};
export default Recap;
