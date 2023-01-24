import { Switch } from "@headlessui/react";

const Toggle = ({ compactMode, setCompactMode }) => {
	return (
		<div className='flex flex-col items-center rounded-md p-0'>
			<Switch.Group>
				<Switch
					checked={compactMode}
					onChange={setCompactMode}
					className='relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 enabled:ui-checked:bg-blue-500 enabled:ui-not-checked:bg-blue-500'
				>
					<span className='inline-block h-4 w-4 transform rounded-full bg-white transition ui-checked:translate-x-6 ui-not-checked:translate-x-1' />
				</Switch>
				<Switch.Label className='cursor-pointer pt-2 text-gray-700 dark:text-gray-300'>
					{compactMode ? <div>Compact</div> : <div>Detailed</div>}
				</Switch.Label>
			</Switch.Group>
		</div>
	);
};
export default Toggle;
