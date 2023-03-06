import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "context/UserContext";
import { useAxios } from "hooks/useAxios";
import Meta from "@/components/Meta";
import PlanSelection from "@/components/crafting/PlanSelection";
import LoadingSpin from "@/components/LoadingSpin";
import "react-toastify/dist/ReactToastify.css";

const Crafting = () => {
	const [plans, setPlans] = useState([]);
	const [loading, setLoading] = useState(true);
	const { user } = useContext(UserContext);

	const getPlans = async () => {
		const { data } = await axios.get(`/api/crafting/plans`, {
			headers: {
				jwt: user.jwt,
			},
		});
		return data;
	};

	const getUserSlots = async () => {
		const { data } = await axios.get(`/api/crafting/user-slots`, {
			headers: {
				jwt: user.jwt,
			},
		});
		return data;
	};

	const getData = async () => {
		try {
			const data = await getPlans();
			setPlans(data.data.plans);
			const slots = await getUserSlots();
			const usedSlots = slots.data.slots.filter((slot) => slot.used);
			if (usedSlots.length > 0) {
				await clearSlots(usedSlots);
			} else {
				setLoading(false);
			}
		} catch (err) {
			setLoading(false);
			toast.error(err.message, {
				toastId: err.code,
			});
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const clearSlots = async (slots) => {
		slots.map(async (slot) => {
			try {
				const { data } = await axios.post(
					`/api/crafting/open-instant`,
					{
						slotId: slot.id,
					},
					{
						headers: {
							jwt: user.jwt,
						},
					}
				);
				if (data.success) {
					toast.success("All slots cleared!", {
						toastId: "cleared",
					});
				}
				setLoading(false);
			} catch (err) {
				toast.error(err.response.data.error, {
					toastId: err.response.data.errorCode,
				});
				setLoading(false);
			}
		});
	};

	return (
		<>
			<Meta title='Crafting | Kolex VIP' />
			<ToastContainer
				position='top-right'
				autoClose={3500}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<div className='my-10 flex justify-center'>
				{loading ? (
					<LoadingSpin />
				) : plans.length > 0 ? (
					<div className='grid grid-cols-1 gap-5 self-start px-5 sm:grid-cols-3'>
						{plans
							.sort((a, b) => a.id - b.id)
							.map((plan) => (
								<PlanSelection plan={plan} key={plan.id} />
							))}
					</div>
				) : (
					<div className='flex justify-center text-gray-700 dark:text-gray-300 '>
						No craft plans available
					</div>
				)}
			</div>
		</>
	);
};
export default Crafting;
