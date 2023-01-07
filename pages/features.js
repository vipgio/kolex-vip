import { useState } from "react";
import Meta from "@/components/Meta";
import Toggle from "@/components/features/Toggle";
import Details from "@/components/features/Details";
import Pricing from "@/components/features/Pricing";

const features = [
	{
		name: "Custom Feed",
		price: 3,
		price2: 6,
		id: 0,
		description:
			"Custom Discord feed server with mint and price filter for market and packs opened.",
		locked: true,
		image: "/features/feed.png",
		link: "",
	},
	{
		name: "Circulation",
		price: 0,
		id: 1,
		description:
			"You can use this feature to get the circulations of all items in a specific set. This can be helpful to find rarer cards in a set and also count unopened packs using the total circulation.",
		locked: false,
		image: "/features/circ.png",
		link: "/circulation",
	},
	{
		name: "Pack Search",
		price: 0,
		id: 2,
		description:
			"This feature can be used to search for store packs(old or new) and get some information about them including release date, inventory count and pack odds.",
		locked: false,
		image: "/features/packs.png",
		link: "/packs",
	},
	{
		name: "Spinner",
		price: 0,
		id: 3,
		description:
			"You can see the spinner odds and have the option to use an auto-spinner that spins every 8 seconds for you until you stop it.",
		locked: false,
		image: "/features/spinner.png",
		link: "/spinner",
	},
	{
		name: "Collection Scanner",
		price: 0,
		id: 4,
		description:
			"Scans an account for a specific collection, with the ability to show results with different filter methods such as 'All items', 'Only dupes' and 'Best set'.",
		locked: false,
		image: "/features/scan.png",
		link: "/scanner",
	},
	{
		name: "Crafting",
		price: 0,
		id: 5,
		description:
			"Allows you to automate multiple crafts and picks the worst mints overall.",
		locked: false,
		image: "/features/crafting.png",
		link: "/crafting",
	},
	{
		name: "RUSH",
		price: 0,
		id: 6,
		description: "Play rush on web, with optimized map bans and automation features.",
		locked: false,
		image: "/features/rush.png",
		link: "/rush",
	},
	{
		name: "Pack Manager",
		price: 3,
		price2: 5,
		id: 9,
		description:
			"Gives you the ability to mass list or mass open packs. Pack data is stored locally so you don't need to wait for your packs to be loaded every time.",
		locked: true,
		image: "/features/masslist.png",
		link: "/packmanager",
	},
	{
		name: "Mint Search",
		price: 4,
		price2: 7,
		id: 7,
		description:
			"Scans accounts and marketplace to find the cards selected by you with specified mints and price.",
		locked: true,
		image: "/features/mint.png",
		link: "/mintsearch",
	},
	{
		name: "History Check",
		price: 2,
		price2: 3,
		id: 8,
		description:
			"Shows the history of any card using its ID. Can also be used in the scanner and mint search sections.",
		locked: true,
		image: "/features/history.png",
		link: "/history",
	},
	{
		name: "Card Lister",
		price: 4,
		price2: 7,
		id: 10,
		description:
			"Allows you to mass list cards, with automatic floor price input and advanced options of selecting the mints.",
		locked: true,
		image: "/features/cardlister.png",
		link: "/cardlister",
	},
	{
		name: "Account Transfer",
		perUse: true,
		price: 30,
		id: 11,
		description: "Send or accept mass trades for transfering accounts.",
		locked: true,
		image: "/features/transfer.png",
		link: "/transfer",
	},
	{
		name: "Full Account Scan",
		perUse: true,
		price: 10,
		id: 12,
		description: "Get a complete list of all of your cards and stickers.",
		locked: true,
		image: "/features/full_scan.png",
		link: "",
	},
];

const Prices = () => {
	const [show, setShow] = useState("features");
	return (
		<>
			<Meta title='Features | Kolex VIP' />
			<div className='mt-5 flex justify-center'>
				<Toggle action={show} setAction={setShow} />
			</div>
			{show === "features" ? (
				<Details features={features} />
			) : (
				<Pricing features={features} />
			)}
		</>
	);
};
export default Prices;
