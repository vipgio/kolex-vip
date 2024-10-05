import LoadingSpin from "../LoadingSpin";
import Tooltip from "../Tooltip";

const JWTLogin = ({ jwt, setJwt, loading, onSubmit }) => {
	const hanlePaste = async (e) => {
		e.preventDefault();
		try {
			const token = await navigator.clipboard.readText();
			setJwt(token);
		} catch (err) {
			console.error("Failed to read clipboard contents: ", err);
		}
	};
	return (
		<>
			<div className='text-gray-custom p-1 text-xl font-semibold'>Login using your Kolex account JWT</div>
			<form
				className='m-1 flex flex-col items-center space-y-2 rounded-md border border-gray-700 p-2 dark:border-gray-300'
				onSubmit={onSubmit}
			>
				<div>
					<input
						type='text'
						name='jwt'
						placeholder='JWT Token'
						value={jwt}
						required={true}
						onChange={(e) => setJwt(e.target.value)}
						autoComplete='off'
						disabled={loading}
						className='input-field'
					/>
					<button
						className='simple-button ml-2 !py-0.5 !px-1'
						onClick={hanlePaste}
						type='button'
						disabled={loading}
					>
						Paste
					</button>
				</div>

				<button type='submit' disabled={loading} className='submit-button'>
					{loading ? <LoadingSpin /> : "Login"}
				</button>
				<div className='text-gray-custom pr-2'>
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
