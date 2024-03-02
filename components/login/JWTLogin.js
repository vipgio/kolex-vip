import LoadingSpin from "../LoadingSpin";
import Tooltip from "../Tooltip";

const JWTLogin = ({ jwt, setJwt, loading, onSubmit }) => {
	const parseData = () => {};
	return (
		<>
			<span className='pb-2 text-xl font-semibold text-gray-700 dark:text-gray-300'>
				Login using your Kolex account jwt
			</span>
			<form
				className='flex flex-col items-center space-y-2 rounded-md border border-gray-700 p-2 dark:border-gray-300'
				onSubmit={onSubmit}
			>
				<input
					type='text'
					name='jwt'
					placeholder='JWT Token'
					value={jwt}
					required={true}
					onChange={(e) => setJwt(e.target.value)}
					autoComplete='off'
					disabled={loading}
					className={`input-field ${loading ? "cursor-not-allowed opacity-50" : ""}`}
				/>

				<button type='submit' disabled={loading} className='submit-button'>
					{loading ? <LoadingSpin /> : "Login"}
				</button>
				<div className='pr-2 text-gray-700 dark:text-gray-300'>
					<Tooltip
						text={
							"Your token is never stored or sent to anywhere other than Kolex. If you have any questions you can check the source code or contact me on discord."
						}
						direction='right'
					/>
				</div>
			</form>
		</>
	);
};
export default JWTLogin;
