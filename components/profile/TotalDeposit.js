const TotalDeposit = ({ total }) => {
	return (
		<>
			<div>
				Total Deposited:{" "}
				<span
					className={`inline-block w-20 animate-pulse cursor-default rounded bg-gray-500 font-semibold text-gray-500 hover:animate-none hover:bg-inherit ${
						total >= 5000
							? "hover:text-red-500"
							: total >= 1000
							? "hover:text-amber-500"
							: total >= 100
							? "hover:text-green-500"
							: "hover:text-blue-500"
					}`}
				>
					${total}
				</span>
			</div>
		</>
	);
};
export default TotalDeposit;
