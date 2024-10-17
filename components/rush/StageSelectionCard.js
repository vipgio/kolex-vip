import { CDN } from "@/config/config";
import ImageWrapper from "@/HOC/ImageWrapper";
import { CheckIcon } from "@/components/Icons";
const StageSelectionCard = ({ stage, setShowStageModal, setSelectedStage }) => {
	return (
		<>
			<button
				key={stage.id}
				className='my-outline flex items-center rounded p-1 sm:justify-center'
				onClick={() => {
					setShowStageModal(true);
					setSelectedStage(stage);
				}}
			>
				<span className='flex w-full cursor-pointer items-center justify-center' title={stage.name}>
					<div className='relative mr-2 h-12 w-12'>
						<ImageWrapper
							src={`${CDN}${stage.images[0].url}`}
							alt={stage.name}
							width={50}
							height={50}
							className='absolute top-0 left-0 h-full w-full object-contain'
						/>
					</div>
					<span>{stage.name}</span>
					{stage.completed && (
						<CheckIcon
							size={20}
							className={`ml-auto stroke-1 text-green-500 sm:ml-0 ${
								!stage.isClaimed && "animate-pulse"
							}`}
						/>
					)}
				</span>
			</button>
		</>
	);
};
export default StageSelectionCard;
