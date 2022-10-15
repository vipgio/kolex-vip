import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "context/UserContext";
import Meta from "@/components/Meta";
import PlanSelection from "@/components/crafting/PlanSelection";
import LoadingSpin from "@/components/LoadingSpin";
import "react-toastify/dist/ReactToastify.css";

const Crafting = () => {
	const [plans, setPlans] = useState([]);
	const [slots, setSlots] = useState([]);
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
			const freeSlots = slots.data.slots.filter((slot) => !slot.used);
			if (freeSlots.length === 0) {
				toast.error("You have no available slots. Contact me or staff to resolve", {
					toastId: "slots_full",
				});
			} else {
				setSlots(freeSlots);
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getData();
	}, []);

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
				) : (
					<div className='grid grid-cols-1 gap-5 self-start px-5 sm:grid-cols-3'>
						{plans.length > 0 &&
							plans.map((plan) => (
								<PlanSelection plan={plan} slots={slots} key={plan.id} />
							))}
					</div>
				)}
			</div>
		</>
	);
};
export default Crafting;
