import { useState } from "react";
import { PackOdds } from "./PackOdds";

export const PackResults = ({ pack }) => {
	const [showOdds, setShowOdds] = useState(false);
	return (
		<div className='m-2 flex border-t p-2'>
			<div className='pt-1'>
				<img
					src={`http://cdn.epics.gg${
						pack.images.filter(
							(images) => images.name === "image"
							// || images.name === "pack-store"
						)[0].url
					}`}
					width='200'
					height='200'
					alt={pack.name}
					style={{ objectFit: "contain" }}
				/>
			</div>
			<div className='mx-2 space-y-1 text-gray-200'>
				<div className='mb-2 text-lg font-bold'>{pack.name}</div>
				<div>{pack.description}</div>
				<div>
					Number of cards in pack:{" "}
					<span className='font-semibold text-indigo-500'>{pack.entityCount}</span>
				</div>
				{pack.purchaseStart && (
					<div>
						Release date:{" "}
						<span className='font-semibold text-indigo-500'>
							{pack.purchaseStart.split("T")[0]}
						</span>
					</div>
				)}
				<div>
					Season:{" "}
					<span className='font-semibold text-indigo-500'>
						{pack.properties.seasons[0]}
					</span>
				</div>
				{pack.marketStart && (
					<div>
						Market start:{" "}
						<span className='font-semibold text-indigo-500'>{pack.marketStart}</span>
					</div>
				)}
				<div>
					Price:{" "}
					<span className='font-semibold text-indigo-500'>
						{pack.cost} {pack.costType}
					</span>
				</div>
				<div>
					Pack ID: <span className='font-semibold text-indigo-500'>{pack.id}</span>
				</div>
				<div className='flex'>
					Link to marketplace:
					<a
						href={`https://app.epics.gg/csgo/marketplace/pack/${pack.id}`}
						className='ml-1 flex items-center text-indigo-500 hover:underline'
						target='_blank'
					>
						Here
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-4 w-4'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							strokeWidth={1}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
							/>
						</svg>
					</a>
				</div>
				<button onClick={() => setShowOdds((prev) => !prev)}>Show/Hide odds</button>
				{showOdds && (
					<div>
						<PackOdds odds={pack.treatmentsChance} />
					</div>
				)}
			</div>
		</div>
	);
};
