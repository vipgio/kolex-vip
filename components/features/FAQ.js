import { useState } from "react";
import { LuArrowDown } from "react-icons/lu";
import { GoLinkExternal } from "react-icons/go";
import { FaGithub } from "react-icons/fa";
import { github, discord } from "@/config/config";
import Tooltip from "../Tooltip";

const FAQ = ({ paymentMethods }) => {
	const faqData = [
		{
			question: "What is this site?",
			answer: (
				<p>
					This is a website that provides tools and services for Kolex and Kings League Collectibles. It is not
					affiliated with Kolex or Kings League/Hro.
				</p>
			),
		},
		{
			question: "Is it safe to use?",
			answer: (
				<p>
					Yes, this site is safe to use. It does not store any user data, and the only place that your token is
					sent to is Kolex. If you have any concerns, you can check the source code on{" "}
					<a
						href={github}
						target='_blank'
						rel='noopener noreferrer'
						title='Source Code'
						className='inline-flex items-center hover:cursor-pointer hover:text-primary-500'
					>
						Github <FaGithub className='ml-1' />
					</a>
				</p>
			),
		},
		{
			question: "Do I need to pay for features to use this site?",
			answer:
				"No, some parts of the site (such as spinner, crafting, etc.) are free. However, if you need advanced features, you can purchase them individually or in bundles.",
		},
		{
			question: "How do I pay for features?",
			answer: (
				<>
					<span className='inline-flex items-center'>
						You can send the price for the features that you want, then send me the screenshot of your payment
						and your exact account name.{" "}
						<span className='ml-1'>
							<Tooltip text='Please make sure to send the exact amount, as the payment is not automated.' />
						</span>
					</span>
					{paymentMethods.map((method, index) => (
						<div key={index}>
							<span className='font-semibold text-primary-500'>{method.name}</span>:{" "}
							<span>
								{method.value.includes("http") ? (
									<a
										href={method.value}
										target='_blank'
										rel='noopener noreferrer'
										title={method.name}
										className='inline-flex items-center hover:cursor-pointer hover:text-primary-500'
									>
										Click to pay with {method.name} <GoLinkExternal className='ml-1' />
									</a>
								) : (
									method.value
								)}
							</span>
							{method.name === "Stripe" && (
								<span className='ml-1 inline-flex items-center text-sm'>
									<span>(Only Brazilian customers)</span>

									<span className='ml-1'>
										<Tooltip text="If you're not in Brazil and want to use Stripe, please let me know so that I can enable it for others too." />
									</span>
								</span>
							)}
							{method.name === "PayPal" && <span className='ml-1 text-sm'>(Only Friends and Family)</span>}
						</div>
					))}

					<div className='mt-2 inline-flex'>
						Discord:
						<a
							href={discord}
							target='_blank'
							rel='noreferrer'
							title='Contact me on Discord'
							className='ml-1 inline-flex items-center hover:cursor-pointer hover:text-orange-500'
						>
							Click <GoLinkExternal className='ml-1' />
						</a>
					</div>
				</>
			),
		},
		{
			question: "Is it safe to pay?",
			answer:
				"Yes. I don't store or process any payments nor do I have access to your payment information. The links will redirect you to the payment processor.",
		},
		{
			question: "What is BRL?",
			answer: "It's Brazilian Real. Only Brazilian customers can pay in BRL.",
		},
		{
			question: "Why is there a specific BRL price list?",
			answer:
				"This is due to the high number of Brazilian visitors, economic considerations, and to mitigate the impact of currency fluctuations.",
		},
		{
			question: "Why are the prices so weird?",
			answer:
				"The prices are calculated based on the USD price and the current exchange rate. It can be a bit weird due to the exchange rate.",
		},
	];

	const [openItems, setOpenItems] = useState([]);

	const toggleItem = (index) => {
		setOpenItems((prevOpenItems) =>
			prevOpenItems.includes(index) ? prevOpenItems.filter((i) => i !== index) : [...prevOpenItems, index]
		);
	};

	return (
		<div className='mx-auto mb-10 mt-4 w-full rounded border border-gray-600 p-4 pb-0 dark:border-gray-400'>
			<h2 className='mb-4 text-2xl font-bold'>Frequently Asked Questions</h2>
			<div className='divide-y divide-gray-200'>
				{faqData.map((item, index) => (
					<FAQItem
						key={index}
						item={item}
						isOpen={openItems.includes(index)}
						onToggle={() => toggleItem(index)}
					/>
				))}
			</div>
		</div>
	);
};
export default FAQ;

const FAQItem = ({ item, isOpen, onToggle }) => {
	return (
		<div className='py-4'>
			<button
				className='flex w-full items-center justify-between text-left'
				onClick={onToggle}
				aria-expanded={isOpen}
			>
				<span className='text-lg font-medium'>{item.question}</span>
				<LuArrowDown
					className={`h-5 w-5 transform transition-all duration-300 ${
						isOpen ? "rotate-180 text-primary-500" : ""
					}`}
				/>
			</button>
			<div
				className={`mt-1 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
					isOpen ? "max-h-96" : "max-h-0"
				}`}
			>
				<div className='py-2'>{item.answer}</div>
			</div>
		</div>
	);
};
