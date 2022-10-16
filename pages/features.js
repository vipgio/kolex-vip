import Image from "next/future/image";
import Link from "next/link";
import Meta from "@/components/Meta";
import { FaLock } from "react-icons/fa";

const options = [
	{
		name: "Circulation",
		price: 0,
		id: 1,
		description:
			"You can use this feature to get the circulations of all items in a specific set. This can be helpful to find rarer cards in a set and also count unopened packs using the total circulation.",
		locked: false,
		image: "/circ.png",
		link: "/circulation",
	},
	{
		name: "Pack Search",
		price: 0,
		id: 2,
		description:
			"This feature can be used to search for store packs(old or new) and get some information about them including release date, inventory count and pack odds.",
		locked: false,
		image: "/packs.png",
		link: "/packs",
	},
	{
		name: "Spinner",
		price: 0,
		id: 3,
		description:
			"You can see the spinner odds and have the option to use an auto-spinner that spins every 8 seconds for you until you stop it.",
		locked: false,
		image: "/spinner.png",
		link: "/spinner",
	},
	{
		name: "Collection Scanner",
		price: 0,
		id: 4,
		description:
			"Scans an account for a specific collection, with the ability to show results with different filter methods such as 'All items', 'Only dupes' and 'Best set'.",
		locked: false,
		image: "/scan.png",
		link: "/scanner",
	},
	{
		name: "Crafting",
		price: 0,
		id: 4,
		description:
			"Allows you to automate multiple crafts and picks the worst mints overall.",
		locked: false,
		image: "/crafting.png",
		link: "/crafting",
	},
	{
		name: "Mint Search",
		price: 3,
		id: 5,
		description:
			"Scans accounts and marketplace to find the cards selected by you with specified mints and price.",
		locked: true,
		image: "/mint.png",
		link: "/mintsearch",
	},
	{
		name: "History Check",
		price: 2,
		id: 6,
		description:
			"Shows the history of any card using its ID. Can also be used in the scanner and mint search sections.",
		locked: true,
		image: "/history.png",
		link: "/history",
	},
	{
		name: "Pack Manager",
		price: 3,
		id: 7,
		description:
			"Gives you the ability to mass list or mass open packs. Pack data is stored locally so you don't need to wait for your packs to be loaded every time.",
		locked: true,
		image: "/masslist.png",
		link: "/masslist",
	},
	{
		name: "Card Lister",
		price: 4,
		id: 8,
		description:
			"Allows you to mass list cards, with automatic floor price input and advanced options of selecting the mints.",
		locked: true,
		image: "/cardlister.png",
		link: "/cardlister",
	},
];
const Prices = () => {
	return (
		<>
			<Meta title='Features | Kolex VIP' />
			<div className='mt-8 flex justify-center'>
				<h1 className='text-5xl font-semibold text-gray-800 dark:text-gray-200'>
					FEATURES
				</h1>
			</div>
			<div className='my-10 grid grid-cols-1 place-items-center gap-10 px-2 lg:grid-cols-2'>
				{options.map((feature) => (
					<div
						className={`relative h-fit min-w-min rounded-lg border border-gray-700 outline outline-4 outline-transparent transition-all dark:border-gray-300 sm:h-80 sm:w-[30rem] sm:hover:scale-110`}
						key={feature.name}
					>
						<div className='relative flex justify-center border-b border-gray-700 text-center text-gray-700 dark:border-gray-300 dark:text-gray-300'>
							{feature.locked && (
								<>
									<div className='absolute left-1 top-[6px] flex items-center justify-center'>
										<FaLock title='Paid only' />
									</div>
									<div className='absolute right-1 top-0'>
										<span className='ml-1'>${feature.price}/month</span>
									</div>
								</>
							)}
							<h2 className='text-center text-lg font-semibold text-orange-400 hover:underline'>
								<Link href={feature.link}>
									<a>{feature.name}</a>
								</Link>
							</h2>
						</div>
						<div className='h-2/3 w-auto overflow-hidden p-1'>
							<Image
								src={feature.image}
								width={500}
								height={500}
								className='object-cover'
							/>
						</div>
						<p className='p-1 text-gray-700 dark:text-gray-300'>{feature.description}</p>
					</div>
				))}
			</div>
		</>
	);
};
export default Prices;
