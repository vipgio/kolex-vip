import React, { Fragment } from "react";
import Image from "next/future/image";
import isEqual from "lodash/isEqual";
const CardHistory = React.memo(
	({ item }) => {
		return (
			<>
				<div className='m-5 flex basis-3/4 items-start border border-gray-300 p-2 lg:basis-[calc(50%_-_40px)]'>
					{item.images.size402 && (
						<div className='mr-2 min-w-fit'>
							<Image
								src={
									item.images.size402 ? item.images.size402 : item.template.images.size402
								}
								alt={item.id}
								width={50 * 1.5}
								height={75 * 1.5}
								quality={100}
								className='h-full w-full object-cover'
							/>
						</div>
					)}
					<div>
						<div className='mb-2 w-full border-b text-gray-300'>
							<span className='text-orange-400'>
								{item.mintBatch}
								{item.mintNumber}{" "}
							</span>
							<span>
								{item.template?.title}: {item.id}
							</span>
						</div>

						<div className='relative max-h-48 w-full overflow-auto overscroll-contain text-gray-300'>
							{item.history
								.slice()
								.reverse()
								.map((event) => (
									<Fragment key={`${item.id}-${event.created}`}>
										{event.type === "mint" && (
											<div>
												<p>Minted on {event.created.replace("T", " ").split(".")[0]}</p>
											</div>
										)}

										{event.type === "pack" && (
											<div>
												<p>
													<span className='text-green-400'>
														{event.receiver.username}{" "}
													</span>
													opened from a pack.{" "}
													<span className='text-gray-500'>
														{event.created.replace("T", " ").split(".")[0]}
													</span>
												</p>
											</div>
										)}
										{event.type === "spinner" && (
											<div>
												<p>
													<span className='text-green-400'>
														{event.receiver.username}{" "}
													</span>
													received the item from the spinner.{" "}
													<span className='text-gray-500'>
														{event.created.replace("T", " ").split(".")[0]}
													</span>
												</p>
											</div>
										)}
										{event.type === "craft" && (
											<div>
												<p>
													<span className='text-green-400'>
														{event.receiver.username}{" "}
													</span>
													received the item from a craft.{" "}
													<span className='text-gray-500'>
														{event.created.replace("T", " ").split(".")[0]}
													</span>
												</p>
											</div>
										)}
										{event.type === "qr-claim" && (
											<div>
												<p>
													<span className='text-green-400'>
														{event.receiver.username}{" "}
													</span>
													acquired from a QR code redemption.{" "}
													<span className='text-gray-500'>
														{event.created.replace("T", " ").split(".")[0]}
													</span>
												</p>
											</div>
										)}
										{event.type === "achievement" && (
											<div>
												<p>
													<span className='text-green-400'>
														{event.receiver.username}{" "}
													</span>
													received the item from an achievement.{" "}
													<span className='text-gray-500'>
														{event.created.replace("T", " ").split(".")[0]}
													</span>
												</p>
											</div>
										)}
										{event.type === "trade" && (
											<div>
												<p>
													<span className='text-green-400'>
														{event.receiver.username}{" "}
													</span>
													received the item from{" "}
													<span className='text-red-400'>{event.sender.username} </span>
													in a trade.{" "}
													<span className='text-gray-500'>
														{event.created.replace("T", " ").split(".")[0]}
													</span>
												</p>
											</div>
										)}
										{event.type === "market" && (
											<div>
												<p>
													<span className='text-green-400'>
														{event.receiver.username}{" "}
													</span>
													purchased the item from{" "}
													<span className='text-red-400'>{event.sender.username} </span>
													for <span>{event.value} </span>
													<span>{event.costType === "usd" ? "USD. " : "coins. "}</span>
													<span className='text-gray-500'>
														{event.created.replace("T", " ").split(".")[0]}
													</span>
												</p>
											</div>
										)}
										{event.type === "imx-locked" && (
											<div>
												<p>
													<span className='text-green-400'>
														{event.receiver.username}{" "}
													</span>
													transferred the item to Immutable.{" "}
													<span className='text-gray-500'>
														{event.created.replace("T", " ").split(".")[0]}
													</span>
												</p>
											</div>
										)}
										{event.type === "imx-unlocked" && (
											<div>
												<p>
													<span className='text-green-400'>
														{event.receiver?.username}{" "}
													</span>
													Item was transferred to Epics.{" "}
													<span className='text-gray-500'>
														{event.created.replace("T", " ").split(".")[0]}
													</span>
												</p>
											</div>
										)}
										{event.type === "imx-market" && (
											<div>
												<p>
													<span className='text-green-400'>
														{event.receiver.username}{" "}
													</span>
													purchased the item from Immutable.{" "}
													<span className='text-gray-500'>
														{event.created.replace("T", " ").split(".")[0]}
													</span>
												</p>
											</div>
										)}
										{event.type === "level-upgrade" && (
											<div>
												<p>
													<span className='text-green-400'>
														{event.receiver.username}{" "}
													</span>
													upgraded the card to level{" "}
													<span className='text-red-400'>{event.value} </span>
													<span className='text-gray-500'>
														{event.created.replace("T", " ").split(".")[0]}
													</span>
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
