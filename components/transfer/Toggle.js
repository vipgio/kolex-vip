import { Switch } from "@headlessui/react";

const Toggle = ({ user, selectedUser, inProgress, send, setSend }) => {
	return (
		<div className='flex flex-col items-center rounded-md border border-gray-700 p-2 dark:border-gray-300'>
			<Switch.Group>
				<Switch
					checked={send}
					onChange={setSend}
					disabled={inProgress}
					className='relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 enabled:ui-checked:bg-primary-500 enabled:ui-not-checked:bg-primary-500'
				>
					<span className='inline-block h-4 w-4 transform rounded-full bg-white transition ui-checked:translate-x-6 ui-not-checked:translate-x-1' />
				</Switch>
				<Switch.Label passive className='text-gray-custom mr-4 w-fit pt-2'>
					{send ? (
						<div>
							Send all items from <span className='font-semibold text-primary-500'>{user.user.username}</span>{" "}
							to <span className='font-semibold text-primary-500'>{selectedUser.username}</span>
						</div>
					) : (
						<div>
							Accept all trdes from{" "}
							<span className='font-semibold text-primary-500'>{selectedUser.username}</span> to{" "}
							<span className='font-semibold text-primary-500'>{user.user.username}</span>
						</div>
					)}
				</Switch.Label>
			</Switch.Group>
		</div>
	);
};
export default Toggle;
