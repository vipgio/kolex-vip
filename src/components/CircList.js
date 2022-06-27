import { useState } from "react";
export const CircList = ({ data }) => {
	const [packCount, setPackCount] = useState("");
	return (
		<div className='flex justify-center px-2'>
			<div className='mt-3 mb-2 grid divide-y divide-indigo-400 border border-indigo-400'>
				<div className='flex items-center'>
					<div className='p-3 text-center text-lg font-semibold text-gray-200'>
						Total : {data.reduce((cur, acc) => cur + acc.inCirculation, 0)}
					</div>
					<input
						type='number'
						name='packCards'
						placeholder='Pack Cards'
						value={packCount}
						onChange={(e) => setPackCount(e.target.value)}
						decimal='false'
						className='m-3 w-28 rounded-md border border-gray-300 bg-gray-200 p-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
					/>
					<div>
						{packCount > 0 && (
							<span className='mr-2 text-gray-300'>
								Packs opened:{" "}
								{Math.ceil(
									data.reduce((cur, acc) => cur + acc.inCirculation, 0) / packCount
								)}
							</span>
						)}
					</div>
				</div>
				{data
					.sort((a, b) => a.inCirculation - b.inCirculation)
					.map((item) => (
						<div className='flex w-full p-2 text-gray-300' key={item.id}>
							<div className='mr-8'>{item.title}</div>
							<div className='ml-auto text-indigo-400'>{item.inCirculation}</div>
						</div>
					))}
			</div>
		</div>
	);
};
