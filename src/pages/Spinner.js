import { useContext, useEffect, useState } from "react";
import { SpinArea } from "../components/SpinArea";
import { UserContext } from "../context/UserContext";

export const Spinner = () => {
	const { spinnerOdds, setActive } = useContext(UserContext);
	const [spinnerInfo, setSpinnerInfo] = useState({});
	const stuff = async () => {
		const data = await spinnerOdds();
		if (data.data.success) {
			setSpinnerInfo(data.data.data);
		}
	};
	useEffect(() => {
		stuff();
		setActive(4);
		document.title = "Kolex VIP | Spinner";
	}, []);
	return (
		<div className='mx-3 pt-10 sm:mx-0'>
			<div>
				Spin cost: {spinnerInfo.cost} {spinnerInfo.costType}
			</div>

			{spinnerInfo.items && (
				<table className='text-gray-300'>
					<thead className='border'>
						<tr>
							<th>Item Name</th>
							<th>Chance (%)</th>
						</tr>
					</thead>
					<tbody>
						{spinnerInfo.items
							.sort((a, b) => b.chance - a.chance)
							.map((item) => (
								<tr key={item.id} className='border-b border-b-gray-500'>
									<td>{item.name}</td>
									<th>{item.chance}</th>
								</tr>
							))}
					</tbody>
				</table>
			)}
			<SpinArea info={spinnerInfo} />
		</div>
	);
};
