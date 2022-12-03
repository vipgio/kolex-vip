import { RadioGroup } from "@headlessui/react";

const plans = [
	{
		name: "Scan",
		id: "scan",
		description:
			"Uses the same method as the scanner. Only gets you the available items and best and worst 30+ mints on each item, but ignores the ones in the middle. (Recommended)",
	},
	{
		name: "Card IDs",
		id: "cardid",
		description:
			"Gets every item you own and is also faster than the other method, but doesn't consider market and IMX items so some trades will fail. You can reduce the errors by removing market listings and IMX cards before starting.",
	},
];

const ModeSelection = ({ transferMode, setTransferMode }) => {
	return (
		<div className='w-full border-b border-gray-500 px-3 pb-3 pt-2 xs:border-r'>
			<p className='mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300'>
				Select the transfer method
			</p>
			<div className='w-full max-w-md'>
				<RadioGroup value={transferMode} onChange={setTransferMode}>
					<RadioGroup.Label className='sr-only'>Server size</RadioGroup.Label>
					<div className='space-y-2'>
						{plans.map((plan) => (
							<RadioGroup.Option
								key={plan.name}
								value={plan}
								className='relative flex cursor-pointer rounded-lg px-3 py-2 shadow-md focus:outline-none ui-checked:bg-main-500/80 ui-checked:text-gray-900 ui-not-checked:bg-gray-900 dark:ui-checked:text-gray-100 dark:ui-not-checked:bg-gray-100'
							>
								{({ checked }) => (
									<>
										<div className='flex w-full items-center justify-between'>
											<div className='flex items-center'>
												<div className='text-sm'>
													<RadioGroup.Label
														as='p'
														className={`font-medium text-gray-100 ${
															checked ? "dark:text-gray-100" : "dark:text-gray-900"
														}`}
													>
														{plan.name}
													</RadioGroup.Label>
													<RadioGroup.Description
														as='span'
														className={`inline ${
															checked ? "text-sky-100" : "text-gray-500"
														}`}
													>
														<span>{plan.description}</span>
													</RadioGroup.Description>
												</div>
											</div>
											{checked && (
												<div className='shrink-0 text-white'>
													<CheckIcon className='h-6 w-6' />
												</div>
											)}
										</div>
									</>
								)}
							</RadioGroup.Option>
						))}
					</div>
				</RadioGroup>
			</div>
		</div>
	);
};

function CheckIcon(props) {
	return (
		<svg viewBox='0 0 24 24' fill='none' {...props}>
			<circle cx={12} cy={12} r={12} fill='#fff' opacity='0.3' />
			<path
				d='M7 13l3 3 7-7'
				stroke='#fff'
				strokeWidth={1.5}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	);
}
export default ModeSelection;
