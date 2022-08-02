import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Meta from "../components/Meta";
import SpinArea from "../components/SpinArea";

export default function Spinner() {
	const { spinnerOdds, setActive, user } = useContext(UserContext);
	const [spinnerInfo, setSpinnerInfo] = useState({});

	useEffect(() => {
		setActive(4);
		const stuff = async () => {
			const data = await spinnerOdds();
			if (data.data.success) {
				setSpinnerInfo(data.data.data);
			}
		};
		user && stuff();
	}, [user, setActive, spinnerOdds]);

	return (
		<>
			<Meta title='Spinner | Kolex VIP' />
			<div className='mx-3 pt-10 pb-3 sm:mx-0'>
				{/* <div>
					Spin cost: {spinnerInfo.cost} {spinnerInfo.costType}
				</div> */}
				<div className='flex'>
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
			</div>
		</>
	);
}
