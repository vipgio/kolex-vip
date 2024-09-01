import { maxPrice, minPrice } from "@/config/config";
import Dialog from "@/HOC/Dialog";

const FiltersModal = ({ isOpen, setIsOpen, filters, setFilters, defaultFilters }) => {
	const closeModal = () => setIsOpen(false);

	return (
		<div className='fixed z-50'>
			<Dialog isOpen={isOpen} setIsOpen={setIsOpen} title={"Filters"}>
				<>
					<div className='text-gray-custom border-y border-gray-500 p-2'>
						<div className='mb-1'>
							<label htmlFor='minOwned'>Min Owned: </label>
							<input
								type='number'
								name='minOwned'
								id='minOwned'
								className='input-field'
								min={1}
								max={9999}
								value={filters.minOwned}
								onChange={(e) =>
									setFilters((prev) => ({
										...prev,
										minOwned: Number(e.target.value),
									}))
								}
							/>
						</div>
						<div className='my-2'>
							<label htmlFor='minFloor'>Min Floor: </label>
							<input
								type='number'
								name='minFloor'
								id='minFloor'
								className='input-field'
								min={minPrice}
								max={maxPrice}
								step={0.01}
								value={filters.minFloor}
								onChange={(e) =>
									setFilters((prev) => ({
										...prev,
										minFloor: Number(e.target.value),
									}))
								}
							/>
						</div>
						<div className='mb-1'>
							<label htmlFor='maxFloor'>Max Floor: </label>
							<input
								type='number'
								name='maxFloor'
								id='maxFloor'
								className='input-field'
								min={minPrice}
								max={maxPrice}
								step={0.01}
								value={filters.maxFloor}
								onChange={(e) =>
									setFilters((prev) => ({
										...prev,
										maxFloor: Number(e.target.value),
									}))
								}
							/>
						</div>
					</div>

					<div className='mt-4 inline-flex w-full'>
						<button type='button' className='button' onClick={() => setFilters(defaultFilters)}>
							Default
						</button>
						<button type='button' className='button ml-auto' onClick={closeModal}>
							Close
						</button>
					</div>
				</>
			</Dialog>
		</div>
	);
};
export default FiltersModal;
