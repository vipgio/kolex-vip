import { Fragment, useState } from "react";
import { CDN } from "@/config/config";
import ImageWrapper from "HOC/ImageWrapper";
import CraftingModal from "./CraftingModal";

const PlanSelection = ({ plan }) => {
	const [showModal, setShowModal] = useState(false);
	return (
		<div>
			<div
				className='max-w-xs rounded border border-gray-800 transition-transform hover:scale-105 hover:cursor-pointer dark:border-gray-200'
				onClick={() => setShowModal(true)}
			>
				<div className='inline-flex w-full max-w-xs justify-center p-1'>
					<ImageWrapper
						src={`${CDN}${
							plan.theme.images[0].url || plan.theme.treatment.images[0].url
						}`}
						width={200}
						height={300}
						alt={plan.name}
					/>
				</div>
				<div className='border-y border-gray-700 px-1 text-center text-lg font-semibold text-gray-800 dark:border-gray-300 dark:text-gray-200'>
					{plan.name}
				</div>
				<div className='p-1 text-gray-800 dark:text-gray-200'>
					<div>Cost: {plan.silvercoinCost.toLocaleString()} Silver</div>
					<div>
						Requirements:{" "}
						{plan.requirements.map((item, i) => [
							i > 0 && ", ",
							<Fragment key={item.id}>
								<span className='text-orange-500'>{item.count}x</span> {item.name}
							</Fragment>,
						])}
					</div>
				</div>
			</div>
			{showModal && (
				<CraftingModal plan={plan} showModal={showModal} setShowModal={setShowModal} />
			)}
		</div>
	);
};
export default PlanSelection;
