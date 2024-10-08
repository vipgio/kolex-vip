import { Switch } from "@headlessui/react";

const PurchaseToggle = ({ manageMode, setManageMode }) => {
	return (
		<div className='flex flex-col items-center rounded-md p-0'>
			<Switch.Group>
				<Switch
					checked={manageMode}
					onChange={setManageMode}
					className='relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 enabled:ui-checked:bg-primary-500 enabled:ui-not-checked:bg-primary-500'
				>
					<span className='inline-block h-4 w-4 transform rounded-full bg-white transition ui-checked:translate-x-6 ui-not-checked:translate-x-1' />
				</Switch>
				<Switch.Label className='text-gray-custom cursor-pointer pt-2'>
					{manageMode ? <div>Manage your packs</div> : <div>Purchase market packs</div>}
				</Switch.Label>
			</Switch.Group>
		</div>
	);
};
export default PurchaseToggle;
