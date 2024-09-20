import { Switch } from "@headlessui/react";

const Toggle = ({ filtersMode, setFiltersMode, loading }) => {
	return (
		<div className='flex flex-col items-center rounded-md p-2'>
			<Switch.Group>
				<Switch
					checked={filtersMode}
					onChange={setFiltersMode}
					disabled={loading}
					className='relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 enabled:ui-checked:bg-primary-500 enabled:ui-not-checked:bg-primary-500'
				>
					<span className='inline-block h-4 w-4 transform rounded-full bg-white transition ui-checked:translate-x-6 ui-not-checked:translate-x-1' />
				</Switch>
				<Switch.Label className='text-gray-custom w-fit cursor-pointer pt-2 text-sm'>
					{filtersMode ? <div>Filters Mode</div> : <div>Default Mode</div>}
				</Switch.Label>
			</Switch.Group>
		</div>
	);
};
export default Toggle;
