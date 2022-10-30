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
						<div className='rounded-md border border-gray-800 dark:border-gray-400'>
							<table className='h-full table-auto overflow-hidden rounded-md text-gray-700 transition-colors dark:text-gray-300'>
								<thead className='bg-gray-300 uppercase text-gray-800 dark:bg-gray-700 dark:text-gray-400'>
									<tr>
										<th>Item Name</th>
										<th>Chance (%)</th>
									</tr>
								</thead>
								<tbody className='text-center'>
									{spinnerInfo.items
										.sort((a, b) => b.chance - a.chance)
										.map((item) => (
											<tr
												className='border-b bg-white hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
												key={item.id}
											>
												<td>{item.name}</td>
												<th
													title={`1 in ${Number(
														(100 / item.chance)
															.toFixed(2)
															.replace(/0+$/, "")
															.replace(/\.$/, "")
													).toLocaleString()}`}
												>
													{item.chance}
												</th>
											</tr>
										))}
								</tbody>
							</table>
						</div>
					)}

					<SpinArea info={spinnerInfo} />
				</div>
			</div>
		</>
	);
};
export default Spinner;
