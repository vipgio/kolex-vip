import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "@/context/UserContext";
import Meta from "@/components/Meta";
import SpinArea from "@/components/spinner/SpinArea";
import SpinnerOdds from "@/components/spinner/SpinnerOdds";

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
				<div className='relative flex h-full flex-col sm:h-[75vh] sm:flex-row'>
					{loading ? (
						<div className='h-full w-full animate-pulse bg-gray-300 dark:bg-gray-600'></div>
					) : spinnerInfo.items ? (
						<SpinnerOdds spinnerInfo={spinnerInfo} />
					) : (
						<div className='text-gray-custom flex h-full items-center justify-center font-semibold'>
							Spinner not available
						</div>
					)}

					<SpinArea info={spinnerInfo} />
				</div>
			</div>
		</>
	);
};
export default Spinner;
