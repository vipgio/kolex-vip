import { useContext, useEffect, useState } from "react";
import { UserContext } from "context/UserContext";
import Meta from "@/components/Meta";
import SpinArea from "@/components/SpinArea";
import axios from "axios";

const Spinner = () => {
	const { user } = useContext(UserContext);
	const [spinnerInfo, setSpinnerInfo] = useState({});

	useEffect(() => {
		const getInitialInfo = async () => {
			const { data } = await axios.get("/api/spinner/info", {
				headers: {
					jwt: user.jwt,
				},
			});
			if (data.success) {
				setSpinnerInfo(data.data);
			}
		};
		user && getInitialInfo();
	}, [user.jwt]);

	return (
		<>
			<Meta title='Spinner | Kolex VIP' />
			<div className='mx-3 pt-10 pb-5 sm:mx-0 sm:pb-3'>
				{/* <div>
					Spin cost: {spinnerInfo.cost} {spinnerInfo.costType}
				</div> */}
				<div className='flex flex-col sm:flex-row'>
					{spinnerInfo.items && (
						<table className='text-gray-700 dark:text-gray-300'>
							<thead className='border border-gray-700 dark:border-gray-300'>
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
};
export default Spinner;
