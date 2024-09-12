import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAxios } from "@/hooks/useAxios";
import Meta from "@/components/Meta";
import PlanSelection from "@/components/crafting/PlanSelection";
import LoadingSpin from "@/components/LoadingSpin";

const Crafting = () => {
	const [plans, setPlans] = useState([]);
	const [loading, setLoading] = useState(true);
	const { fetchData, postData } = useAxios();

	const getPlans = async () => {
		const { result, error } = await fetchData({ endpoint: `/api/crafting/plans`, forceCategoryId: true });
		if (result) return result;
		if (error) throw new Error(error);
	};

	const getUserSlots = async () => {
		const { result, error } = await fetchData({ endpoint: `/api/crafting/user-slots`, forceCategoryId: true });
		if (result) return result;
		if (error) throw new Error(error);
	};

	const getData = async () => {
		try {
			const data = await getPlans();
			setPlans(data.plans);
			const slots = await getUserSlots();
			const usedSlots = slots.slots.filter((slot) => slot.used);
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
			const { result, error } = await postData(`/api/crafting/open-instant`, { slotId: slot.id });

			if (result) {
				toast.success("All slots cleared!", {
					toastId: "cleared",
				});
			}
			if (error) {
				console.error(error);
				toast.error(error.response.data.error, {
					toastId: error.response.data.errorCode,
				});
			}
			setLoading(false);
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
							.sort((a, b) => b.id - a.id)
							.map((plan) => (
								<PlanSelection plan={plan} key={plan.id} />
							))}
					</div>
				) : (
					<div className='text-gray-custom flex justify-center'>No craft plans available</div>
				)}
			</div>
		</>
	);
};
export default Crafting;
