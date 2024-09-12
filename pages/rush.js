import { useContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAxios } from "@/hooks/useAxios";
import { UserContext } from "@/context/UserContext";
import { RushContext } from "@/context/RushContext";
import Meta from "@/components/Meta";
import RushRostersDropdown from "@/components/rush/RushRostersDropdown";
import RosterDetail from "@/components/rush/RosterDetail";
import Circuits from "@/components/rush/Circuits";
import LoadingSpin from "@/components/LoadingSpin";
import RefreshButton from "@/components/RefreshButton";

const Rush = () => {
	const { fetchData } = useAxios();
	const { user } = useContext(UserContext);
	const { maps, setMaps, selectedRoster, setSelectedRoster } = useContext(RushContext);
	const [rosters, setRosters] = useState([]);
	const [circuits, setCircuits] = useState(null);
	const [loading, setLoading] = useState(false);

	const fetchInfo = useCallback(async () => {
		setLoading(true);
		setSelectedRoster(null);
		await getRosters();
		await getMaps();
		await getCircuit();
		setLoading(false);
	}, [getRosters, getMaps, getCircuit]);

	useEffect(() => {
		fetchInfo();
		return () => {
			setSelectedRoster(null);
		};
	}, [fetchInfo]);

	const getRosters = async () => {
		const { result, error } = await fetchData({
			endpoint: "/api/rush/userRosters",
			params: { userId: user.user.id },
			forceCategoryId: true,
		});
		result && setRosters(result.rosters.filter((roster) => roster.cards.length === 5));
		error &&
			toast.error(error.response.data.error, {
				toastId: error.response.data.errorCode,
			});
	};

	const getMaps = async () => {
		const { result, error } = await fetchData({
			endpoint: "/api/rush/maps",
			forceCategoryId: true,
		});
		result && setMaps(result.maps);
		error &&
			toast.error(error.response.data.error, {
				toastId: error.response.data.errorCode,
			});
	};

	const getCircuit = async () => {
		const { result, error } = await fetchData({
			endpoint: "/api/rush/circuits",
			forceCategoryId: true,
		});
		result && result.circuits.length > 0 && setCircuits(result.circuits);
		error &&
			toast.error(error.response.data.error, {
				toastId: error.response.data.errorCode,
			});
	};

	return (
		<>
			<Meta
				title='RUSH | Kolex VIP'
				description='Play RUSH on web, with optimized map bans and automated features'
			/>
			<div className='mt-5 flex'>
				<div className='relative mb-10 px-2'>
					<RushRostersDropdown
						items={rosters}
						loading={loading}
						setSelected={setSelectedRoster}
						selected={selectedRoster}
					/>
				</div>

				<RefreshButton title='Refresh Data' style='ml-auto mr-2 mt-3' func={fetchInfo} loading={loading} />
			</div>
			<div>{maps && selectedRoster && <RosterDetail roster={selectedRoster} maps={maps} />}</div>
			<div className='mx-2 mt-6'>
				<div className='text-gray-custom mt-5 mb-1 text-lg font-bold'>Active Circuits:</div>
				{loading ? (
					<LoadingSpin />
				) : !circuits ? (
					<div className='text-gray-custom'>No active circuits</div>
				) : (
					<Circuits circuits={circuits} isRosterSelected={selectedRoster?.id ? true : false} />
				)}
			</div>
		</>
	);
};
export default Rush;
