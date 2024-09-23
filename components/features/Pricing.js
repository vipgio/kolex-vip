import { useState } from "react";
import { Switch } from "@headlessui/react";
import { GoLinkExternal } from "react-icons/go";
import FAQ from "./FAQ";
import fixDecimal from "@/utils/NumberUtils";

let localCurrencies = [];
const findCurrency = (currency) => {
	return localCurrencies.find((cur) => cur.code === currency);
};

const Pricing = ({ features, bundles, currencies, paymentMethods }) => {
	localCurrencies = currencies;
	const [currency, setCurrency] = useState("usd");
	return (
		<div className='text-gray-custom mt-4 flex flex-col justify-center px-2'>
			<h1 className='mb-2 text-center text-4xl font-semibold text-gray-800 dark:text-gray-200'>Pricing</h1>
			<div className='mx-1 flex h-10 max-w-full items-center'>
				{currency === "brl" && (
					<a
						href={paymentMethods.find((method) => method.name === "Stripe").value}
						target='_blank'
						rel='noopener noreferrer'
						title='Stripe'
						className=''
					>
						<button className='submit-button inline-flex items-center'>
							Stripe <GoLinkExternal className='ml-1' />
						</button>
					</a>
				)}
				<span className='ml-auto inline-flex items-center text-right'>
					<CurrencyToggle currency={currency} setCurrency={setCurrency} />
				</span>
			</div>
			<Features features={features} currency={currency} />
			<Bundles bundles={bundles} currency={currency} />
			<Services features={features} currency={currency} />
			<FAQ paymentMethods={paymentMethods} />
		</div>
	);
};
export default Pricing;

const Features = ({ features, currency }) => {
	return (
		<>
			<h2 className='mt-1 p-1 text-xl font-semibold'>Features</h2>
			<div className='overflow-hidden rounded-md border border-gray-600 dark:border-gray-400'>
				<table className='w-full table-auto transition-colors'>
					<thead className='bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-400'>
						<tr>
							<th className='table-cell'>Feature</th>
							<th className='table-cell'>1 Month</th>
							<th className='table-cell'>2 Months</th>
						</tr>
					</thead>
					<tbody className='text-center'>
						{features
							.filter((feature) => feature.price > 0 && !feature.info.perUse && feature.info.locked)
							.map((feature) => (
								<tr
									className='border-t bg-white hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
									key={feature.name}
								>
									<td className='table-cell w-1/3'>{feature.info.name}</td>
									<td className='table-cell'>
										{findCurrency(currency).sign}
										{fixDecimal(feature.price * findCurrency(currency).ratio, 2)}
									</td>
									<td className='table-cell'>
										{findCurrency(currency).sign}
										{fixDecimal(feature.price2 * findCurrency(currency).ratio, 2)}
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</>
	);
};

const Bundles = ({ bundles, currency }) => {
	return (
		<>
			<h2 className='mt-5 p-1 text-xl font-semibold'>Bundles</h2>
			<div className='overflow-hidden rounded-md border border-gray-600 dark:border-gray-400'>
				<table className='w-full table-auto transition-colors'>
					<thead className='bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-400'>
						<tr>
							<th className='table-cell'>Features</th>
							<th className='table-cell'>1 Month</th>
							<th className='table-cell'>2 Months</th>
						</tr>
					</thead>
					<tbody className='text-center'>
						{bundles.map((bundle) => (
							<tr
								className='border-t bg-white hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
								key={bundle.id}
							>
								<td className='table-cell w-1/3'>{bundle.features.join(" + ")}</td>
								<td className='table-cell'>
									<span className='mr-1.5 line-through decoration-red-500'>
										{findCurrency(currency).sign}
										{fixDecimal(bundle.oldPrice * findCurrency(currency).ratio, 2)}
									</span>
									<span>
										{findCurrency(currency).sign}
										{fixDecimal(bundle.price * findCurrency(currency).ratio, 2)}
									</span>
								</td>
								<td className='table-cell'>
									<span className='mr-1.5 line-through decoration-red-500'>
										{findCurrency(currency).sign}
										{fixDecimal(bundle.oldPrice2 * findCurrency(currency).ratio, 2)}
									</span>
									<span>
										{findCurrency(currency).sign}
										{fixDecimal(bundle.price2 * findCurrency(currency).ratio, 2)}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};

const Services = ({ features, currency }) => {
	return (
		<>
			<h2 className='mt-5 p-1 text-xl font-semibold'>Other services</h2>
			<div className='mb-4 overflow-hidden rounded-md border border-gray-600 dark:border-gray-400'>
				<table className='w-full table-auto transition-colors'>
					<thead className='bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-400'>
						<tr>
							<th className='table-cell'>Feature</th>
							<th className='table-cell'>Per Use</th>
						</tr>
					</thead>
					<tbody className='text-center'>
						{features
							.filter((feature) => feature.info.perUse)
							.map((feature) => (
								<tr
									className='border-t bg-white hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
									key={feature.name}
								>
									<td className='table-cell'>{feature.info.name}</td>
									<td className='table-cell'>
										{findCurrency(currency).sign}
										{fixDecimal(feature.price * findCurrency(currency).ratio, 2)}
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</>
	);
};

const CurrencyToggle = ({ currency, setCurrency }) => {
	const switchValues = localCurrencies.map((cur) => cur.code);
	return (
		<Switch.Group>
			<Switch.Label className='text-gray-custom w-fit cursor-pointer pr-2 text-sm'>
				{currency.toUpperCase()}
			</Switch.Label>
			<Switch
				checked={currency === switchValues[1]}
				onChange={() => setCurrency(currency === switchValues[1] ? switchValues[0] : switchValues[1])}
				className='relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 enabled:ui-checked:bg-primary-500 enabled:ui-not-checked:bg-primary-500'
			>
				<span className='inline-block h-4 w-4 transform rounded-full bg-white transition ui-checked:translate-x-6 ui-not-checked:translate-x-1' />
			</Switch>
		</Switch.Group>
	);
};
