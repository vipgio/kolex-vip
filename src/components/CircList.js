import { useState } from "react";
export const CircList = ({ data }) => {
	const [packCount, setPackCount] = useState("");
	return (
		<div className='justify-center flex'>
			<div className='grid border mt-3 border-indigo-400 mb-10 divide-y divide-indigo-400'>
				<div className='flex items-center'>
					<div className='text-gray-200 font-semibold text-lg p-3 text-center'>
						Total : {data.reduce((cur, acc) => cur + acc.inCirculation, 0)}
					</div>
					<input
						type='number'
						name='packCards'
						placeholder='Pack Cards'
						value={packCount}
						onChange={(e) => setPackCount(e.target.value)}
						decimal='false'
						className='rounded-md border w-28 border-gray-300 m-3 p-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 bg-gray-200'
					/>
					<div>
						{packCount > 0 && (
							<span className='text-gray-300 mr-2'>
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
