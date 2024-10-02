import { memo } from "react";
import isEqual from "lodash/isEqual";
import ImageWrapper from "@/HOC/ImageWrapper";
import HistoryContent from "./HistoryContent";
const CardHistory = memo(
	({ item, compactMode }) => {
		return (
			<>
				<div className='m-5 flex basis-11/12 items-start rounded border border-gray-700/50 p-2 dark:border-gray-300/50 lg:basis-[calc(50%_-_40px)]'>
					{item.images.size402 && !compactMode && (
						<div className='mr-2 min-w-fit'>
							<a href={item.cardImage || ""} target='_blank' rel='noreferrer noopener'>
								<ImageWrapper
									src={item.images.size201 || item.images.size102 || item.images.size402 || ""}
									alt={item.id}
									width={50 * 1.5}
									height={75 * 1.5}
								/>
							</a>
						</div>
					)}
					<div className='w-full'>
						<div className='mb-2 w-full border-b border-gray-700/50 text-gray-800 dark:border-gray-300/50 dark:text-gray-200'>
							<span className='text-orange-400'>
								{item.mintBatch}
								{item.mintNumber}{" "}
							</span>
							<span>
								{item.title}: {item.id}
							</span>
						</div>

						<div className='relative max-h-48 w-full divide-y divide-gray-500 overflow-auto overscroll-contain text-gray-800 dark:text-gray-200'>
							<HistoryContent item={item} />
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
