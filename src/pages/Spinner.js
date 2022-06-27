import { useContext, useEffect, useState } from "react";
import { CoolButton } from "../components/CoolButton";
import { SpinArea } from "../components/SpinArea";
import { UserContext } from "../context/UserContext";

export const Spinner = () => {
	const { spinnerOdds, setActive } = useContext(UserContext);
	const [spinnerInfo, setSpinnerInfo] = useState([]);
	const stuff = async () => {
		const data = await spinnerOdds();
		if (data.data.success) {
			setSpinnerInfo(data.data.data);
		}
		console.log(spinnerInfo);
	};
	useEffect(() => {
		stuff();
		setActive(4);
	}, []);
	return (
		<>
			<div>
				Spinner here
				<button onClick={stuff}>Click</button>
				<button onClick={() => console.log(spinnerInfo)}>ITEMS</button>
			</div>
			<div>Spinner ID: {spinnerInfo.id}</div>
			<div>
				Spin cost: {spinnerInfo.cost} {spinnerInfo.costType}
			</div>

			{spinnerInfo.items && (
				<table style={{ width: 500 }} className='text-gray-300'>
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
								<tr key={item.id}>
									<td>{item.name}</td>
									<th>{item.chance}</th>
								</tr>
							))}
					</tbody>
				</table>
			)}
			<SpinArea />
		</>
	);
};
