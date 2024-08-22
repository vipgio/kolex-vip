import { RushContext } from "context/RushContext";
import ImageWrapper from "HOC/ImageWrapper";
import { useContext } from "react";

const RosterDetail = () => {
	const { maps, selectedRoster } = useContext(RushContext);
	const mapBonus = maps
		.map((map) => ({
			map: map.name,
			bonus: Number((selectedRoster.stats.maps.find((stat) => stat.mapId === map.id).weight * 100).toFixed(2)),
		}))
		.sort((a, b) => a.bonus - b.bonus);
	return (
		<>
			<div className='mx-2 mt-8 flex flex-col divide-gray-400 rounded-md border border-gray-500 dark:border-gray-300 lg:flex-row lg:divide-x'>
				<div className='flex justify-center gap-3 border-b border-gray-500 p-1 dark:border-gray-300 sm:p-5 lg:border-none'>
					{/*roster images*/}
					{selectedRoster.cards.map((card) => (
						<div className='relative aspect-auto w-28 overflow-hidden' key={card.card.id}>
							<ImageWrapper
								src={card.card.images.size402}
								width={200}
								height={300}
								alt={card.card.cardTemplateId || "loading"}
							/>
						</div>
					))}
				</div>
				<div className='flex divide-x divide-gray-500 text-gray-700 dark:divide-gray-300 dark:text-gray-300'>
					<div className='p-1 lg:p-2'>
						Maps bonus:
						{mapBonus.map((item) => (
							<div key={item.map}>
								{item.map}:{" "}
								<span
									className={`${item.bonus < 0 ? "text-red-500" : item.bonus > 0 ? "text-green-500" : ""}`}
								>
									{item.bonus}
								</span>
							</div>
						))}
					</div>
					<div className='flex flex-col p-1 lg:p-2'>
						<span>
							Country bonus:{" "}
							<span className={`${selectedRoster.stats.countryChemistry > 0 ? "text-green-500" : ""}`}>
								{(selectedRoster.stats.countryChemistry * 100).toFixed(2)}
							</span>
						</span>
						<span>
							Team bonus:{" "}
							<span className={`${selectedRoster.stats.teamChemistry > 0 ? "text-green-500" : ""}`}>
								{(selectedRoster.stats.teamChemistry * 100).toFixed(2)}
							</span>
						</span>
					</div>
				</div>
			</div>
		</>
	);
};
export default RosterDetail;
