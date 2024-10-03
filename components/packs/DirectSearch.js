import LoadingSpin from "../LoadingSpin";
import Tooltip from "../Tooltip";
import PackData from "./PackData";
import { SearchIcon } from "@/components/Icons";

const DirectSearch = ({ loading, searchQuery, setSearchQuery, results, onSubmit }) => {
	return (
		<>
			<form className='flex flex-col items-center space-y-2' onSubmit={onSubmit}>
				<label htmlFor='pack' className='text-gray-custom flex flex-row-reverse items-center'>
					<Tooltip
						text='If your input is a number only, it will search for pack id. If there is any other text in it, it will search for pack name; ignoring lowercase, uppercase and colon.'
						direction='right'
					/>
					Enter pack ID or pack name
				</label>
				<div className='relative'>
					<input
						type='text'
						name='pack'
						id='pack'
						className='input-field'
						value={searchQuery}
						placeholder='Pack ID / Pack name'
						onChange={(e) => setSearchQuery(e.target.value)}
						autoComplete='off'
					/>
					<SearchIcon className='pointer-events-none absolute top-2 right-2 text-gray-500' />
				</div>
				{loading ? (
					<LoadingSpin />
				) : (
					<button type='submit' disabled={loading} className='submit-button'>
						Search for packs
					</button>
				)}
			</form>
			<div className='flex flex-col divide-y divide-gray-600 pt-5 dark:divide-gray-400'>
				{results?.length > 0
					? results.map((res) => <PackData pack={res} key={res.id} title={true} />)
					: searchQuery.length > 0 &&
					  results && <div className='text-gray-custom mt-2 flex justify-center'>No results found</div>}
			</div>
		</>
	);
};
export default DirectSearch;
