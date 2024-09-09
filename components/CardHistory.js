import React, { Fragment } from "react";
import isEqual from "lodash/isEqual";
import { historyEvents } from "@/config/config";
import ImageWrapper from "@/HOC/ImageWrapper";
const CardHistory = React.memo(
	({ item, compactMode }) => {
		const getDate = (event) => event.created.replace("T", " ").split(".")[0];
		return (
			<>
				<div className='m-5 flex basis-11/12 items-start rounded border border-gray-700 p-2 dark:border-gray-300 lg:basis-[calc(50%_-_40px)]'>
					{item.images.size402 && !compactMode && (
						<div className='mr-2 min-w-fit'>
							<ImageWrapper
								src={item.images.size201 || item.images.size102 || item.images.size402 || ""}
								alt={item.id}
								width={50 * 1.5}
								height={75 * 1.5}
							/>
						</div>
					)}
					<div className='w-full'>
						<div className='mb-2 w-full border-b border-current text-gray-800 dark:text-gray-200'>
							<span className='text-orange-400'>
								{item.mintBatch}
								{item.mintNumber}{" "}
							</span>
							<span>
								{item.title}: {item.id}
							</span>
						</div>

						<div className='relative max-h-48 w-full divide-y divide-gray-500 overflow-auto overscroll-contain text-gray-800 dark:text-gray-200'>
							{item.history.toReversed().map((event) => (
								<Fragment key={`${item.id}-${event.created}`}>
									{event.type === "mint" && <div>Minted on {getDate(event)}</div>}
									{event.type in historyEvents && (
										<div>
											<p>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver?.username || event.sender?.username || "null"}{" "}
												</span>
												{historyEvents[event.type](event)}{" "}
												<span className='block text-gray-500'>{getDate(event)}</span>
											</p>
										</div>
									)}
								</Fragment>
							))}
						</div>
					</div>
				</div>
			</>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
CardHistory.displayName = "CardHistory";
export default CardHistory;
