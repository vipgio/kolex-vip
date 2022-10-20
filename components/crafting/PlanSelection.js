import { Fragment, useState } from "react";
import Image from "next/image";
import { CDN } from "@/config/config";
import CraftingModal from "./CraftingModal";

const PlanSelection = ({ plan, slots }) => {
	const [showModal, setShowModal] = useState(false);
	return (
		<>
			<div
				className='max-w-xs rounded border border-gray-800 transition-transform hover:scale-105 hover:cursor-pointer dark:border-gray-200'
				onClick={() => setShowModal(true)}
			>
				<div className='w-full max-w-xs p-1 text-center'>
					<Image
						src={`${CDN}${
							plan.theme.images[0].url || plan.theme.treatment.images[0].url
						}`}
						width={200}
						height={300}
						unoptimized={true}
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
			{showModal && <CraftingModal plan={plan} setShowModal={setShowModal} />}
		</>
	);
};
export default PlanSelection;
