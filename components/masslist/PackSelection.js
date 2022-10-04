import Image from "next/future/image";
import Tooltip from "../Tooltip";
const PackSelection = ({
	packTemplate,
	marketInfo,
	selected,
	setSelected,
	CDN,
	setPage,
}) => {
	const handleSelect = (id) => {
		if (selected.includes(id)) {
			setSelected(selected.filter((item) => item !== id));
		} else {
			setSelected([...selected, id]);
		}
	};
	return (
		<>
			<div className='m-2 flex '>
				<Image
					src={`${CDN}${packTemplate.image}`}
					width={100}
					height={150}
					quality={100}
					alt={packTemplate.name}
					style={{ objectFit: "contain" }}
					unoptimized={true}
				/>
				<div className='ml-2 text-gray-800 dark:text-gray-300'>
					<div>{packTemplate.description}</div>
					{/* <div>Drop date: {packTemplate.releaseTime}</div> */}
					{/* <div>Pack Template ID: {packTemplate.id}</div> */}
					{marketInfo.market && ( //wait for market info to load
						<>
							{marketInfo.market[0][0].price > 0 && ( //if price is bigger than 0, show price
								<>
									<div className='flex'>
										Market floor:{" "}
										<span className='ml-1 text-orange-400'>
											{marketInfo.market[0][0].price}
										</span>
										<span className='ml-1 text-gray-800 hover:no-underline dark:text-gray-300'>
											USD
										</span>
										<a
											href={`https://kolex.gg/csgo/marketplace/pack/${packTemplate.id}`}
											className='ml-1 flex items-center'
											target='_blank'
											rel='noreferrer'
										>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												className='h-4 w-4'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
												strokeWidth={1}
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
												/>
											</svg>
										</a>
									</div>
									<div></div>
								</>
							)}
							{marketInfo.market[0][0].price < 0 && ( //if price is 0, it means it's not on the market
								<div className='flex'>
									Market floor:{" "}
									<a
										href={`https://app.epics.gg/csgo/marketplace/pack/${packTemplate.id}`}
										className='ml-1 flex items-center text-orange-400 hover:underline'
										target='_blank'
										rel='noreferrer'
									>
										No listings on market
									</a>
								</div>
							)}
							<div>
								Recent sales:{" "}
								{marketInfo.recentSales.slice(0, 4).map((sale) => (
									<div className='flex border-b border-gray-600' key={sale.updated}>
										<span className='text-orange-400'>{sale.price} </span>
										<span className='ml-1 sm:mr-16'>USD</span>
										<span className='ml-auto sm:mr-2'>
											{sale.updated.split("T")[0]}
											{/* {" - "} */}
											{/* {sale.updated.split("T")[1].split(".")[0]} */}
										</span>
									</div>
								))}
							</div>
						</>
					)}
				</div>
			</div>
			<div className='m-2 flex flex-1 flex-col overflow-auto'>
				<div className='my-2 flex items-center justify-around text-gray-800 dark:text-gray-300 sm:w-1/2'>
					<button
						onClick={() => setSelected(packTemplate.packs.map((pack) => pack.id))}
						className='m-1 cursor-pointer rounded-md border border-gray-800 p-1 text-center text-gray-800 transition-colors hover:bg-gray-300 hover:text-gray-800 active:bg-gray-400 dark:border-gray-200 dark:text-gray-300'
					>
						Select All ({packTemplate.packs.length})
					</button>
					<button
						onClick={() => setSelected([])}
						className='m-1 cursor-pointer rounded-md border border-gray-800 p-1 text-center text-gray-800 transition-colors hover:bg-gray-300 hover:text-gray-800 active:bg-gray-400 dark:border-gray-200 dark:text-gray-300'
					>
						Deselect All
					</button>
					<span></span>
					<div className='flex items-center'>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								setPage(2);
							}}
						>
							<label htmlFor='pack-count'>Pack count:</label>
							<input
								type='number'
								id='pack-count'
								min={0}
								max={packTemplate.packs.length}
								className='ml-2 rounded-md border border-gray-800 p-1 text-black focus:outline-orange-400'
								onChange={(e) =>
									setSelected(
										packTemplate.packs.slice(0, e.target.value).map((pack) => pack.id)
									)
								}
								value={selected.length}
								onFocus={(e) => e.target.select()}
							/>
						</form>
						<Tooltip
							text='Must be bigger than 0. Consecutive packs, starting from the oldest minted pack'
							direction='right'
						/>
					</div>
				</div>
				<div className='overflow-auto overscroll-contain border-t border-b border-gray-500'>
					{packTemplate.packs
						.sort((a, b) => a.id - b.id)
						.map((pack) => (
							<div
								className='flex items-center text-gray-800 dark:text-gray-300'
								key={pack.id}
							>
								<label htmlFor={pack.id} className='cursor-pointer'>
									<span>Mint Date: </span>
									<span>{pack.created} - </span>
									<span>Pack ID: </span>
									<span>{pack.id}</span>
								</label>
								<input
									type='checkbox'
									className='m-2'
									onChange={() => handleSelect(pack.id)}
									checked={selected.includes(pack.id)}
									id={pack.id}
								/>
							</div>
						))}
				</div>
			</div>
		</>
	);
};
export default PackSelection;
