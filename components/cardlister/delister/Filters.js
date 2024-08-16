const Filters = ({ filter, setFilter }) => {
	return (
		<div className='my-1 ml-auto mr-1 inline-flex items-center text-gray-700 dark:text-gray-300'>
			<div className='mr-3 flex items-center'>
				<label htmlFor='undercut' className='my-1 hover:cursor-pointer'>
					Only undercuts
				</label>
				<input
					type='checkbox'
					name='undercut'
					id='undercut'
					className='ml-1 mr-3 mt-1 accent-primary-500 hover:cursor-pointer sm:mr-0'
					checked={filter.undercut}
					onChange={(e) => setFilter((prev) => ({ ...prev, undercut: e.target.checked }))}
				/>
			</div>
			<div>
				<label htmlFor='batch'>Batch: </label>
				<select
					id='batch'
					className='input-field mb-2 mr-3 w-24 p-0 sm:mb-0'
					onChange={(e) => setFilter((prev) => ({ ...prev, batch: e.target.value }))}
				>
					<option value='A'>A</option>
					<option value='B'>B</option>
					<option value='C'>C</option>
					<option value='M'>M</option>
					<option value='HB'>HB</option>
					<option value='P'>P</option>
				</select>
			</div>
			<div>
				<label htmlFor='minMint'>Minimum Mint: </label>
				<input
					type='number'
					name='minMint'
					id='minMint'
					min={1}
					className='input-field mb-2 mr-3 w-24 sm:mb-0'
					placeholder='Minimum Mint'
					value={filter.min}
					onChange={(e) => setFilter((prev) => ({ ...prev, min: e.target.value }))}
				/>
			</div>
			<div>
				<label htmlFor='maxMint'>Maximum Mint: </label>
				<input
					type='number'
					name='maxMint'
					id='maxMint'
					min={1}
					className='input-field mb-2 mr-3 w-24 sm:mb-0'
					placeholder='Maximum Mint'
					value={filter.max}
					onChange={(e) => setFilter((prev) => ({ ...prev, max: e.target.value }))}
				/>
			</div>
		</div>
	);
};
export default Filters;
