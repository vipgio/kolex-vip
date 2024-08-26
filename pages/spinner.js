import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "context/UserContext";
import Meta from "@/components/Meta";
import SpinArea from "@/components/spinner/SpinArea";

const Spinner = () => {
	const { user, categoryId } = useContext(UserContext);
	const [spinnerInfo, setSpinnerInfo] = useState({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getInitialInfo = async () => {
			setLoading(true);
			try {
				const { data } = await axios.get("/api/spinner/info", {
					headers: {
						jwt: user.jwt,
					},
					params: {
						categoryId: categoryId,
					},
				});
				if (data.success) {
					setSpinnerInfo(data.data);
					setLoading(false);
				}
			} catch (err) {
				setLoading(false);
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
				<div className='relative flex h-[75vh] flex-col sm:flex-row'>
					<div className='h-full w-full rounded-md border border-gray-800 dark:border-gray-400 sm:w-96'>
						{loading ? (
							<div className='h-full w-full animate-pulse bg-gray-300 dark:bg-gray-600'></div>
						) : spinnerInfo.items ? (
							<table className='h-full w-full table-auto overflow-hidden rounded-md text-gray-700 transition-colors dark:text-gray-300'>
								<thead className='bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-400'>
									<tr>
										<th>Item</th>
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
												<td className='py-0.5 px-1'>{item.name}</td>
												<th
													className='pr-1'
													title={`1 in ${Number(
														(100 / item.chance).toFixed(2).replace(/0+$/, "").replace(/\.$/, "")
													).toLocaleString()}`}
												>
													{item.chance}
												</th>
											</tr>
										))}
									<tr className='border-t-2 border-gray-500 bg-white hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600'>
										<td className='font-semibold'>Total</td>
										<th>
											{spinnerInfo.items.reduce((prev, curr) => prev + Number(curr.chance), 0).toFixed(4)}
										</th>
									</tr>
									<tr className='border-t border-gray-500 bg-white hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600'>
										<td className='font-semibold'>Silver return per 100 spins</td>
										<th>
											{(
												spinnerInfo.items.reduce(
													(prev, curr) => prev + (Number(curr.chance) / 100) * curr.properties.silvercoins,
													0
												) * 100
											).toLocaleString()}
										</th>
									</tr>
								</tbody>
							</table>
						) : (
							<div className='flex h-full items-center justify-center font-semibold text-gray-700 dark:text-gray-300'>
								Spinner not available
							</div>
						)}
					</div>

					<SpinArea info={spinnerInfo} />
				</div>
			</div>
		</>
	);
};
export default Spinner;
