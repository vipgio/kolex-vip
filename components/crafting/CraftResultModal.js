import React from "react";
import isEqual from "lodash/isEqual";
import Dialog from "@/HOC/Dialog";
import LoadingSpin from "../LoadingSpin";

const CraftResultModal = React.memo(
	({ data, showResult, setShowResult, loading, craftCount }) => {
		return (
			<div className='fixed z-50'>
				<Dialog
					title={
						<>
							<div>
								<span>Craft result</span>
								<span className='ml-2 text-sm'>
									{data.length} / {craftCount}
								</span>
							</div>
							{loading && (
								<span className='mx-auto'>
									<LoadingSpin />
								</span>
							)}
							<span className='ml-auto'></span>
						</>
					}
					isOpen={showResult}
					setIsOpen={setShowResult}
					closeButton={true}
				>
					<div className='max-h-96 overflow-auto border-y border-gray-500'>
						{data.length > 0 &&
							data.map((card) => (
								<div className='flex text-gray-800 dark:text-gray-200' key={card.uuid}>
									<span className='w-8 text-orange-400'>
										{card.mintBatch}
										{card.mintNumber}
									</span>
									<span className='ml-5'>{card.title ? card.title : card.stickerTemplate.title}</span>
								</div>
							))}
					</div>
				</Dialog>
			</div>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
CraftResultModal.displayName = "CraftResultModal";
export default CraftResultModal;
