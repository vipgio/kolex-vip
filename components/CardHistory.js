import React, { Fragment } from "react";
import isEqual from "lodash/isEqual";
import ImageWrapper from "HOC/ImageWrapper";
const CardHistory = React.memo(
	({ item, compactMode }) => {
		return (
			<>
				<div className='m-5 flex basis-11/12 items-start rounded border border-gray-700 p-2 dark:border-gray-300 lg:basis-[calc(50%_-_40px)]'>
					{item.images.size402 && !compactMode && (
						<div className='mr-2 min-w-fit'>
							<ImageWrapper
								src={
									item.images.size402 ? item.images.size402 : item.template.images.size402
								}
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
								{item.template?.title}: {item.id}
							</span>
						</div>

						<div className='relative max-h-48 w-full divide-y divide-gray-500 overflow-auto overscroll-contain text-gray-800 dark:text-gray-200'>
							{item.history
								.slice()
								.reverse()
								.map((event) => (
									<Fragment key={`${item.id}-${event.created}`}>
										{event.type === "mint" && (
											<div>Minted on {event.created.replace("T", " ").split(".")[0]}</div>
										)}

										{event.type === "pack" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver.username}{" "}
												</span>
												opened from a pack.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "spinner" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver.username}{" "}
												</span>
												received the item from the spinner.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "craft" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver.username}{" "}
												</span>
												received the item from a craft.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "qr-claim" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver.username}{" "}
												</span>
												acquired from a QR code redemption.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "achievement" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver.username}{" "}
												</span>
												received the item from an achievement.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "trade" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver.username}{" "}
												</span>
												received the item from{" "}
												<span className='font-medium text-red-400'>
													{event.sender.username}{" "}
												</span>
												in a trade.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "market" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver.username}{" "}
												</span>
												purchased the item from{" "}
												<span className='font-medium text-red-400'>
													{event.sender.username}{" "}
												</span>
												for <span>{event.value} </span>
												<span>{event.costType === "usd" ? "USD. " : "coins. "}</span>
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "imx-locked" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver.username}{" "}
												</span>
												transferred the item to Immutable.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "imx-unlocked" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver?.username}{" "}
												</span>
												Item was transferred to Kolex.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "imx-market" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver.username}{" "}
												</span>
												purchased the item from Immutable.{" "}
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
											</div>
										)}
										{event.type === "level-upgrade" && (
											<div>
												<span className='font-medium text-green-600 dark:text-green-400'>
													{event.receiver.username}{" "}
												</span>
												upgraded the card to level{" "}
												<span className='font-medium text-red-400'>{event.value} </span>
												<span className='block text-gray-500'>
													{event.created.replace("T", " ").split(".")[0]}
												</span>
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
