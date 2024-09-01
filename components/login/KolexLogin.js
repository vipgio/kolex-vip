import LoadingSpin from "../LoadingSpin";
import Tooltip from "../Tooltip";

const KolexLogin = ({
	setEmail,
	setCode,
	setPassword,
	loading,
	password,
	email,
	code,
	onSubmit,
	codeEnabled,
}) => {
	return (
		<>
			<span className='text-gray-custom pb-2 text-xl font-semibold'>Login using your Kolex account</span>
			<form
				className='flex flex-col items-center space-y-2 rounded-md border border-gray-700 p-2 dark:border-gray-300'
				onSubmit={onSubmit}
			>
				<input
					type='email'
					name='email'
					placeholder='Email address'
					value={email}
					required={true}
					onChange={(e) => setEmail(e.target.value)}
					autoComplete='email'
					disabled={loading}
					className={`input-field ${loading ? "cursor-not-allowed opacity-50" : ""}`}
				/>

				<input
					type='password'
					name='password'
					placeholder='Password'
					value={password}
					required={true}
					onChange={(e) => setPassword(e.target.value)}
					autoComplete='current-password'
					disabled={loading}
					className={`input-field ${loading ? "cursor-not-allowed opacity-50" : ""}`}
				/>

				{codeEnabled && (
					<input
						type='text'
						name='2fa'
						placeholder='Two Factor Authentication Code'
						autoComplete='off'
						value={code}
						onChange={(e) => setCode(e.target.value)}
						disabled={loading}
						className={`input-field ${loading ? "cursor-not-allowed opacity-50" : ""}`}
					/>
				)}
				<button type='submit' disabled={loading} className='submit-button'>
					{loading ? <LoadingSpin /> : "Login"}
				</button>
				<div className='text-gray-custom pr-2'>
					<Tooltip
						text={
							"Your password is never stored or sent to anywhere other than kolex. If you have any questions you can check the source code or contact me on discord vipgio#4884"
						}
						direction='right'
					/>
				</div>
			</form>
		</>
	);
};
export default KolexLogin;
