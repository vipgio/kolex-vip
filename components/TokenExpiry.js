import { useEffect, useState } from "react";

const TokenExpiry = ({ expires }) => {
	const [timeLeft, setTimeLeft] = useState(0);
	const now = new Date().getTime();
	const expiry = new Date(expires).getTime() * 1000;
	const diff = expiry - now;
	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date().getTime();
			const diff = expiry - now;
			setTimeLeft(diff);
			// Update the state or do any other logic with the updated time
		}, 60 * 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);
	return (
		<>
			<div>
				<div>
					<p>
						Your login token will expire in{" "}
						<span className='font-semibold text-primary-500'>
							{Math.floor(timeLeft / (60 * 60 * 1000)) > 2 ? ( // If more than 2 hours left
								<span>{Math.floor(timeLeft / (60 * 60 * 1000))}</span>
							) : Math.floor(timeLeft / (60 * 1000)) > 0 ? ( // If more than 1 minutes left
								<span>{Math.floor(timeLeft / (60 * 1000))}</span>
							) : (
								<span>{Math.floor(timeLeft / 1000)}</span> // If less than 1 minute left
							)}
						</span>
						{Math.floor(timeLeft / (60 * 60 * 1000)) > 2
							? " hours"
							: Math.floor(timeLeft / (60 * 1000)) > 0
							? " minutes"
							: " minutes"}
					</p>
				</div>
			</div>
		</>
	);
};
export default TokenExpiry;
