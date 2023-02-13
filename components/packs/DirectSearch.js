import LoadingSpin from "../LoadingSpin";
import Tooltip from "../Tooltip";
import PackResults from "./PackResults";

const DirectSearch = ({ loading, searchQuery, setSearchQuery, results, onSubmit }) => {
	return (
		<>
			<form className='flex flex-col items-center space-y-2' onSubmit={onSubmit}>
				<label
					htmlFor='pack'
					className='flex flex-row-reverse items-center text-gray-700 dark:text-gray-300'
				>
					<Tooltip
						text='If your input is a number only, it will search for pack id. If there is any other text in it, it will search for pack name; ignoring lowercase, uppercase and colon.'
						direction='right'
					/>
					Enter pack ID or pack name
				</label>
				<input
					type='text'
					name='pack'
					id='pack'
					className={`input-field ${loading ? "cursor-not-allowed opacity-50" : ""}`}
					value={searchQuery}
					placeholder='Pack ID / Pack name'
					onChange={(e) => setSearchQuery(e.target.value)}
					autoComplete='off'
				/>
				{loading ? (
					<LoadingSpin />
				) : (
					<button
						type='submit'
						disabled={loading}
						className={`submit-button ${loading ? "cursor-not-allowed opacity-50" : ""}`}
					>
						Search for packs
					</button>
				)}
			</form>
			{results?.length > 0
				? results.map((res) => <PackResults pack={res} key={res.id} />)
				: searchQuery.length > 0 &&
				  results && (
						<div className='mt-2 flex justify-center text-gray-700 dark:text-gray-300'>
							No results found
						</div>
				  )}
		</>
	);
};
export default DirectSearch;
