import { useEffect, useState, useContext, useRef } from "react";
import Bottleneck from "bottleneck";
import { toast } from "react-toastify";
import { FaLock } from "react-icons/fa";
import { useAxios } from "hooks/useAxios";
import { UserContext } from "context/UserContext";
import { RushContext } from "context/RushContext";
import BigModal from "@/components/BigModal";
import StageInfoRoster from "./StageInfoRoster";
import Tooltip from "../Tooltip";
import "react-toastify/dist/ReactToastify.css";

const limiter = new Bottleneck({
	maxConcurrent: 1,
	minTime: 7000,
});

const StageInfo = ({ selectedCircuit, stage, thisCircuit, showModal, setShowModal }) => {
	const { fetchData, postData } = useAxios();
	const { user } = useContext(UserContext);
	const { selectedRoster } = useContext(RushContext);
	const counter = useRef(0);
	const [rosters, setRosters] = useState([]);
	const [locked, setLocked] = useState(false);
	const [loading, setLoading] = useState(false);
	const isUserVIP = user.info.allowed.length > 0;

	const getRosters = async () => {
		setLoading(true);
		const { result, error } = await fetchData("/api/rush/PVERosters", {
			rosterIds: stage.rosters.map((roster) => roster.ut_pve_roster_id).toString(),
		});
		result &&
			setRosters(
				result.rosters.map((roster) => ({
					name: roster.name,
					rating: roster.rating,
					stats: roster.stats,
					id: roster.id,
					level: roster.level,
					wins:
						thisCircuit.stages
							.find((s) => s.id === stage.id)
							.rosterProgress.find((pr) => pr.ut_pve_roster_id === roster.id)?.wins || 0,
				}))
			);
		error &&
			toast.error(error.response.data.error, {
				toastId: error.response.data.errorCode,
			});
		setLoading(false);
	};

	useEffect(() => {
		getRosters();
	}, []);

	const playGame = async (payload) => {
		const { result, error } = await postData("/api/rush/play-game", payload);
		if (result) {
			if (result.game.user1.winner) {
				setRosters((prev) => {
					const targetRoster = prev.find((roster) => roster.id === payload.enemyRosterId);
					return [
						...prev.filter((roster) => roster.id !== payload.enemyRosterId),
						{
							...targetRoster,
							wins: targetRoster.wins + 1,
						},
					];
				});

				toast.success(
					`Won the game against ${
						rosters.find((roster) => roster.id === payload.enemyRosterId).name
					} with a ${result.game.user1.winChance.toFixed(3)}% chance. You gained ${
						result.game.user1.points
					} points.`,
					{ toastId: result.game.id }
				);
			} else {
				toast.warning(
					`Lost the game against ${
						rosters.find((roster) => roster.id === payload.enemyRosterId).name
					} with a ${result.game.user1.winChance.toFixed(3)}% chance. You lost ${
						result.game.user1.points
					} points.`,
					{ toastId: result.game.id }
				);
			}
			return result.game.user1.winner;
		}
		if (error) {
			console.log(error);
			toast.error(error.response.data.error, {
				toastId: error.response.data.errorCode,
			});
		}
	};

	const winAll = async () => {
		setLoading(true);
		const thisStage = thisCircuit.stages.find((infoStage) => infoStage.id === stage.id);
		const remainingRosters = thisStage.rosters
			.map((roster) => {
				const winsNeeded =
					thisStage.rosterProgress.find(
						(rstr) => rstr.ut_pve_roster_id === roster.ut_pve_roster_id
					)?.wins || 0;
				return {
					won: winsNeeded,
					id: roster.ut_pve_roster_id,
					winsNeeded: roster.wins,
					mapBans: getBestMaps(
						rosters.find((rstr) => rstr.id === roster.ut_pve_roster_id).stats.maps,
						selectedRoster.stats.maps
					),
				};
			})
			.filter((roster) => roster.won < roster.winsNeeded);

		const totalWinsNeeded = remainingRosters.reduce(
			(acc, cur) => acc + cur.winsNeeded - cur.won,
			0
		);
		for await (const opponent of remainingRosters) {
			let winsLeft = opponent.winsNeeded - opponent.won;
			const repeatGame = async (remaining) => {
				if (remaining === 0) return;
				const payload = {
					rosterId: selectedRoster.id,
					enemyRosterId: opponent.id,
					bannedMapIds: opponent.mapBans,
					id: thisCircuit.id,
					stageId: thisStage.id,
				};
				const result = await limiter.schedule(
					{ id: `${opponent.id} - ${counter.current}` },
					() => playGame(payload)
				);
				if (result) {
					++counter.current;
					counter.current === totalWinsNeeded && setLoading(false); //if total won games = wins needed to clear the stage, loading => false
					repeatGame(--winsLeft);
				} else {
					repeatGame(winsLeft); //if lost, play the same game
				}
			};
			repeatGame(winsLeft);
		}
	};

	return (
		<>
			<BigModal
				showModal={showModal}
				setShowModal={setShowModal}
				loading={loading}
				header={`${selectedCircuit.name} - ${stage.name}`}
				extraStyle='h-fit my-auto'
				hasToast={true}
				closeOnClick={true}
			>
				<div className='my-2 mx-1 grid max-h-full grid-cols-1 overflow-auto lg:grid-cols-2'>
					{rosters.length > 0 &&
						rosters
							.sort((a, b) => a.id - b.id)
							.map((roster) => (
								<StageInfoRoster
									key={roster.id}
									roster={roster}
									thisCircuit={thisCircuit}
									stage={stage}
									locked={locked}
									setLocked={setLocked}
									loading={loading}
									setLoading={setLoading}
								/>
							))}
				</div>
				{user.user.username === "vipgio" && (
					<div className='flex border-t border-gray-600 py-2 dark:border-gray-400'>
						<div className='ml-auto mr-2 inline-flex items-center'>
							<Tooltip
								direction='left'
								text={
									!isUserVIP
										? "You need to have any VIP feature to unlock this"
										: "You are a lovely VIP user, so this feature is added automatically"
								}
							/>
							<button
								className='button'
								onClick={winAll}
								disabled={loading || !isUserVIP}
							>
								{!isUserVIP && (
									<span className='mr-1.5'>
										<FaLock />
									</span>
								)}
								<span>Complete all</span>
							</button>
						</div>
					</div>
				)}
			</BigModal>
		</>
	);
};
export default StageInfo;

const getBestMaps = (enemyMaps, myMaps) => {
	const combinedMaps = myMaps
		.map((myMap) => ({
			mapId: myMap.mapId,
			weight: myMap.weight - enemyMaps.find((m) => m.map_id === myMap.mapId).weight,
		}))
		.sort((a, b) => a.weight - b.weight);
	return [combinedMaps[0].mapId, combinedMaps[1].mapId];
};
