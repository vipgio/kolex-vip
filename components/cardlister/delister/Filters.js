const Filters = ({ filter, setFilter, setSortMethod }) => {
	return (
		<div className='text-gray-custom my-1 ml-auto mr-1 inline-flex w-full flex-col items-center sm:flex-row'>
			<div className='flex w-full justify-between'>
				<div className='mr-auto flex items-center sm:ml-1'>
					<label htmlFor='sort' className='text-gray-custom sm:ml-1'>
						Sort by:{" "}
					</label>
					<select
						name='sort'
						id='sort'
						className='dropdown mx-2 my-1 transition-opacity disabled:cursor-not-allowed disabled:opacity-50'
						onChange={(e) => setSortMethod(e.target.value)}
					>
						<option value='mint'>Mint</option>
						<option value='price'>Price</option>
						<option value='floor'>Floor</option>
						<option value='circulation'>Circulation</option>
						<option value='date'>Date Listed</option>
					</select>
				</div>
				<div className='ml-auto flex items-center sm:mr-3'>
					<label htmlFor='undercut' className='my-1 hover:cursor-pointer'>
						Only undercuts
					</label>
					<input
						type='checkbox'
						name='undercut'
						id='undercut'
						className='ml-1 mr-3 mt-1 accent-primary-500 hover:cursor-pointer'
						checked={filter.undercut}
						onChange={(e) => setFilter((prev) => ({ ...prev, undercut: e.target.checked }))}
					/>
				</div>
			</div>
			<div className='flex w-full items-center sm:w-auto'>
				<label htmlFor='batch'>Batch: </label>
				<select
					id='batch'
					className='input-field ml-1 mr-5 w-24'
					onChange={(e) => setFilter((prev) => ({ ...prev, batch: e.target.value }))}
				>
					<option value='A'>A</option>
					<option value='B'>B</option>
					<option value='C'>C</option>
					<option value='M'>M</option>
					<option value='HB'>HB</option>
					<option value='P'>P</option>
					<option value='any'>Any</option>
				</select>
			</div>
			<div className='flex gap-0 sm:gap-2'>
				<div className='flex items-center'>
					<label htmlFor='minMint' className='sm:w-max'>
						Minimum Mint:{" "}
					</label>
					<input
						type='number'
						name='minMint'
						id='minMint'
						min={1}
						className='input-field  ml-1 mr-3 w-24'
						placeholder='Minimum Mint'
						value={filter.min}
						onChange={(e) => setFilter((prev) => ({ ...prev, min: e.target.value }))}
					/>
				</div>
				<div className='flex items-center'>
					<label htmlFor='maxMint' className='sm:w-max'>
						Maximum Mint:{" "}
					</label>
					<input
						type='number'
						name='maxMint'
						id='maxMint'
						min={1}
						className='input-field ml-1  mr-2 w-24'
						placeholder='Maximum Mint'
						value={filter.max}
						onChange={(e) => setFilter((prev) => ({ ...prev, max: e.target.value }))}
					/>
				</div>
			</div>
		</div>
	);
};
export default Filters;
