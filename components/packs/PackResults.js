import React, { useState } from "react";
import isEqual from "lodash/isEqual";
import { GoLinkExternal } from "react-icons/go";
import { CDN, webApp } from "@/config/config";
import ImageWrapper from "@/HOC/ImageWrapper";
import PackOdds from "./PackOdds";

const PackResults = React.memo(
	({ pack }) => {
		const [showOdds, setShowOdds] = useState(false);
		return (
			<div className='relative m-2 flex border-t border-gray-600 p-2 dark:border-gray-400'>
				<div className='w-4/12 pt-1 sm:w-1/5'>
					<ImageWrapper
						src={`${CDN}${pack.images.find((images) => images.name === "image").url}`}
						width={200}
						height={200}
						alt={pack.name}
					/>
				</div>
				<div className='mx-2 w-8/12 space-y-1 text-gray-800 dark:text-gray-200 sm:w-4/5'>
					<div className='mb-2 text-lg font-bold'>{pack.name}</div>
					<div>{pack.description}</div>
					<div>
						Number of items in pack: <span className='font-semibold text-primary-500'>{pack.entityCount}</span>
					</div>
					{pack.purchaseStart && (
						<div>
							Release date:{" "}
							<span className='font-semibold text-primary-500'>{pack.purchaseStart.split("T")[0]}</span>
						</div>
					)}
					{pack.marketStart && (
						<div>
							Market start: <span className='font-semibold text-primary-500'>{pack.marketStart}</span>
						</div>
					)}
					<div>
						Total Minted:{" "}
						<span className='font-semibold text-primary-500'>{pack.mintCount.toLocaleString()}</span>
					</div>
					<div>
						Inventory Count:{" "}
						<span className='font-semibold text-primary-500'>{pack.inventoryCount.toLocaleString()}</span>
					</div>
					<div>
						Total Opened:{" "}
						<span className='font-semibold text-primary-500'>{pack.openedCount.toLocaleString()}</span>
					</div>
					<div>
						Packs Unopened:{" "}
						<span className='font-semibold text-orange-500'>
							{(pack.mintCount - pack.openedCount).toLocaleString()}
						</span>
						{pack.inventoryCount > 0 ? (
							<span className='ml-1'>
								({(pack.mintCount - pack.openedCount - pack.inventoryCount).toLocaleString()} available)
							</span>
						) : null}
					</div>
					<div>
						Season: <span className='font-semibold text-primary-500'>{pack.properties.seasons[0]}</span>
					</div>
					{pack.cost && (
						<div>
							Price:{" "}
							<span className='font-semibold text-primary-500'>
								{Number(pack.cost).toLocaleString()}{" "}
								{pack.costType === "usd"
									? pack.costType.toUpperCase()
									: pack.costType[0].toUpperCase() + pack.costType.slice(1)}
							</span>
						</div>
					)}
					<div>
						Pack ID: <span className='font-semibold text-primary-500'>{pack.id}</span>
					</div>
					<div className='flex'>
						Link to market:
						<a
							href={`${webApp}/market/pack/${pack.id}`}
							className='ml-1 flex items-center text-primary-500 hover:underline'
							target='_blank'
							rel='noreferrer'
						>
							Here
							<GoLinkExternal size={14} />
						</a>
					</div>
					<div className='mb-1 flex'>
						Link to drop page:
						<a
							href={`${webApp}/drops/${pack.id}`}
							className='ml-1 flex items-center text-primary-500 hover:underline'
							target='_blank'
							rel='noreferrer'
						>
							Here
							<GoLinkExternal size={14} />
						</a>
					</div>
					<button onClick={() => setShowOdds((prev) => !prev)} className='simple-button'>
						{showOdds ? "Hide odds" : "Show odds"}
					</button>
					{showOdds && <PackOdds odds={pack.treatmentsChance} />}
				</div>
			</div>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
PackResults.displayName = "PackResults";
export default PackResults;
