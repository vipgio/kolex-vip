import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import Tooltip from "../Tooltip";

const SpinLimit = ({
	spinActive,
	info,
	spinLimit,
	setSpinLimit,
	defMax,
	funds,
	fundsLimit,
	setFundsLimit,
}) => {
	const [limitTypeSpins, setLimitTypeSpins] = useState(true);

	const handleLimit = (e) => {
		const value = e.target.value;
		value > 10000 ? setSpinLimit(10000) : value < 1 ? setSpinLimit(1) : setSpinLimit(value);
	};

	useEffect(() => {
		if (limitTypeSpins) {
			setSpinLimit(defMax);
			setFundsLimit(0);
		} else {
			setFundsLimit(funds.silvercoins);
			setSpinLimit(10000);
		}
	}, [limitTypeSpins]);

	// useEffect(() => {
	// 	console.log(
	// 		"spinCount.current",
	// 		spinCount.current,
	// 		"spinLimit",
	// 		spinLimit,
	// 		"fundRef.current",
	// 		fundRef.current,
	// 		"fundsLimit",
	// 		Number(fundsLimit)
	// 	);
	// });

	return (
		<>
			<div className='mr-2 inline-flex items-center rounded-md align-middle'>
				<Switch.Group>
					<Switch
						checked={limitTypeSpins}
						onChange={setLimitTypeSpins}
						className='relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 enabled:ui-checked:bg-primary-500 enabled:ui-not-checked:bg-primary-500'
					>
						<span className='inline-block h-4 w-4 transform rounded-full bg-white transition ui-checked:translate-x-6 ui-not-checked:translate-x-1' />
					</Switch>
					<Switch.Label className='ml-2 cursor-pointer text-gray-700 dark:text-gray-300'>
						{limitTypeSpins ? <span>Spin Limit</span> : <span>Fund Limit</span>}
					</Switch.Label>
				</Switch.Group>
			</div>
			<div className='flex items-center text-gray-700 dark:text-gray-300'>
				{limitTypeSpins === true ? (
					<>
						<span className='sm:hidden'>
							<Tooltip
								direction='right'
								text={`Number of spins before it stops. Default is ${defMax.toLocaleString()} times.`}
							/>
						</span>
						<span className='hidden sm:block'>
							<Tooltip
								direction='left'
								text={`Number of spins before it stops. Default is ${defMax.toLocaleString()} times.`}
							/>
						</span>
						<span>Spin limit:</span>
						<input
							type='number'
							name='counter'
							id='counter'
							disabled={spinActive || !info.id}
							min={1}
							max={10000}
							value={spinLimit}
							onChange={handleLimit}
							className='input-field mr-3 ml-1 w-28'
						/>
					</>
				) : (
					<>
						<span className='sm:hidden'>
							<Tooltip direction='right' text={`Spins until you reach a certain amount of funds.`} />
						</span>
						<span className='hidden sm:block'>
							<Tooltip direction='left' text={`Spins until you reach a certain amount of funds.`} />
						</span>
						<span>Fund limit:</span>
						<input
							type='number'
							name='fundLimit'
							id='fundLimit'
							disabled={spinActive || !info.id}
							min={1000}
							max={funds.silvercoins}
							value={fundsLimit}
							onChange={(e) => setFundsLimit(e.target.value)}
							className='input-field mr-3 ml-1 w-28'
						/>
					</>
				)}
			</div>
		</>
	);
};
export default SpinLimit;
