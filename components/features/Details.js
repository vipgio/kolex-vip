import Link from "next/link";
import { FaLock } from "react-icons/fa";
import ImageWrapper from "@/HOC/ImageWrapper";
const Details = ({ features }) => {
	return (
		<>
			<div className='mt-8 flex justify-center'>
				<h1 className='text-5xl font-semibold text-gray-800 dark:text-gray-200'>Features</h1>
			</div>
			<div className='my-10 grid grid-cols-1 place-items-center gap-5 px-2 sm:gap-10 lg:grid-cols-2'>
				{features.map((feature) => (
					<div
						className={`text-gray-custom relative flex h-fit min-w-min flex-col rounded-md border border-gray-600 outline outline-4 outline-transparent transition-all dark:border-gray-400 sm:h-96 sm:w-[30rem] sm:hover:scale-110 xl:w-[36rem]`}
						key={feature.name}
					>
						<div className='relative flex justify-center border-b border-gray-700 text-center dark:border-gray-300'>
							{feature.info.locked && (
								<div className='absolute left-1 top-[6px] flex items-center justify-center'>
									<FaLock title='Paid only' />
								</div>
							)}
							<h2 className='text-center text-lg font-semibold text-primary-400 hover:underline'>
								<Link href={feature.info.link}>
									<a title={feature.info.name}>{feature.info.name}</a>
								</Link>
							</h2>
						</div>
						<div className='overflow-hidden p-1'>
							<ImageWrapper
								src={feature.info.image}
								quality={100}
								width={500}
								height={500}
								className='w-full object-cover'
								alt={feature.info.name}
								unoptimized={false}
							/>
						</div>
						<p className='px-2 py-1'>{feature.info.description}</p>
					</div>
				))}
			</div>
		</>
	);
};
export default Details;
