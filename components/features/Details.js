import Link from "next/link";
import { FaLock } from "react-icons/fa";
import ImageWrapper from "HOC/ImageWrapper";
const Details = ({ features }) => {
	return (
		<>
			<div className='mt-8 flex justify-center'>
				<h1 className='text-5xl font-semibold text-gray-800 dark:text-gray-200'>
					Features
				</h1>
			</div>
			<div className='my-10 grid grid-cols-1 place-items-center gap-10 px-2 lg:grid-cols-2'>
				{features.map((feature) => (
					<div
						className={`relative flex h-fit min-w-min flex-col rounded-lg border border-gray-700 text-gray-700 outline outline-4 outline-transparent transition-all dark:border-gray-300 dark:text-gray-300 sm:h-80 sm:w-[30rem] sm:hover:scale-110`}
						key={feature.name}
					>
						<div className='relative flex justify-center border-b border-gray-700 text-center text-gray-700 dark:border-gray-300 dark:text-gray-300'>
							{feature.locked && (
								<div className='absolute left-1 top-[6px] flex items-center justify-center'>
									<FaLock title='Paid only' />
								</div>
							)}
							<h2 className='text-center text-lg font-semibold text-orange-400 hover:underline'>
								<Link href={feature.link}>
									<a title={feature.name}>{feature.name}</a>
								</Link>
							</h2>
						</div>
						<div className='h-2/3 w-auto overflow-hidden p-1'>
							<ImageWrapper
								src={feature.image}
								quality={100}
								width={500}
								height={500}
								className='object-cover'
								alt={feature.name}
							/>
						</div>
						<p className='p-1 text-gray-700 dark:text-gray-300'>{feature.description}</p>
					</div>
				))}
			</div>
		</>
	);
};
export default Details;
