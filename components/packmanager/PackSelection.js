import { GoLinkExternal } from "react-icons/go";
import { webApp } from "@/config/config";
import ImageWrapper from "@/HOC/ImageWrapper";
import Tooltip from "../Tooltip";

const PackSelection = ({ packTemplate, marketInfo, selected, setSelected, CDN, setPage }) => {
	const handleSelect = (id) => {
		if (selected.includes(id)) {
			setSelected(selected.filter((item) => item !== id));
		} else {
			setSelected([...selected, id]);
		}
	};
	return (
		<>
			<div className='m-2 flex'>
				<ImageWrapper
					src={`${CDN}${packTemplate.image}` || ""}
					width={100}
					height={150}
					quality={100}
					alt={packTemplate.name}
					className='object-contain'
				/>
				<div className='text-gray-custom ml-2'>
					<div>{packTemplate.description}</div>
					{/* <div>Drop date: {packTemplate.releaseTime}</div> */}
					{/* <div>Pack Template ID: {packTemplate.id}</div> */}
					{marketInfo.market && ( //wait for market info to load
						<>
							{marketInfo?.market?.[0]?.[0]?.price > 0 ? (
								//if price is bigger than 0, show price
								<>
									<div className='flex'>
										Market floor: <span className='ml-1 text-orange-400'>{marketInfo.market[0][0].price}</span>
										<span className='text-gray-custom ml-1 hover:no-underline'>USD</span>
										<a
											href={`${webApp}/market/pack/${packTemplate.id}`}
											className='ml-1 flex items-center'
											target='_blank'
											rel='noreferrer'
										>
											<GoLinkExternal />
										</a>
									</div>
								</>
							) : (
								<div className='flex'>
									Market floor:{" "}
									<a
										href={`${webApp}/market/pack/${packTemplate.id}`}
										className='ml-1 flex items-center text-orange-400 hover:underline'
										target='_blank'
										rel='noreferrer'
									>
										No listings on market
									</a>
								</div>
							)}
							<div>
								Recent sales: {marketInfo.recentSales.length === 0 && "None"}
								{marketInfo.recentSales.slice(0, 4).map((sale) => (
									<div className='flex border-b border-gray-600' key={sale.updated}>
										<span className='text-orange-400'>{sale.price} </span>
										<span className='ml-1 sm:mr-16'>USD</span>
										<span className='ml-auto sm:mr-2'>{sale.updated.split("T")[0]}</span>
									</div>
								))}
							</div>
						</>
					)}
				</div>
			</div>
			<div className='m-2 flex flex-1 flex-col overflow-auto'>
				<div className='text-gray-custom my-2 flex items-center justify-around sm:w-1/2'>
					<button
						onClick={() => setSelected(packTemplate.packs.map((pack) => pack.id))}
						className='text-gray-custom m-1 cursor-pointer rounded-md border border-gray-800 p-1 text-center transition-colors hover:bg-gray-300 hover:text-gray-800 active:bg-gray-400 dark:border-gray-200 dark:hover:text-gray-700'
					>
						Select All ({packTemplate.packs.length})
					</button>
					<button
						onClick={() => setSelected([])}
						className='text-gray-custom m-1 cursor-pointer rounded-md border border-gray-800 p-1 text-center transition-colors hover:bg-gray-300 hover:text-gray-800 active:bg-gray-400 dark:border-gray-200 dark:hover:text-gray-700'
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
									setSelected(packTemplate.packs.slice(0, e.target.value).map((pack) => pack.id))
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
				<div className='divide-y divide-gray-700 overflow-auto overscroll-contain border-t border-b border-gray-500'>
					{packTemplate.packs
						.sort((a, b) => a.id - b.id)
						.map((pack) => (
							<div className='text-gray-custom flex items-center' key={pack.id}>
								<label htmlFor={pack.id} className='cursor-pointer'>
									<span>Mint Date: </span>
									<span>{pack.created} - </span>
									<span>Pack ID: </span>
									<span>{pack.id}</span>
								</label>
								<input
									type='checkbox'
									className='m-2 cursor-pointer'
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
