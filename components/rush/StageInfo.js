import { useEffect, useState, useContext, useRef, useMemo } from "react";
import Bottleneck from "bottleneck";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAxios } from "@/hooks/useAxios";
import { UserContext } from "@/context/UserContext";
import { RushContext } from "@/context/RushContext";
import BigModal from "@/components/BigModal";
import Tooltip from "@/components/Tooltip";
import StageInfoRoster from "./StageInfoRoster";
import LoadingSpin from "../LoadingSpin";
import { LockIcon } from "@/components/Icons";

const limiter = new Bottleneck({
	maxConcurrent: 1,
	minTime: 9000,
});

const StageInfo = ({ stage, circuit, showModal, setShowModal }) => {
	const { fetchData, postData } = useAxios();
	const { user } = useContext(UserContext);
	const { selectedRoster } = useContext(RushContext);
	const counter = useRef(0);
	const isMountedRef = useRef(true);
	const [rosters, setRosters] = useState([]);
	const [locked, setLocked] = useState(false);
	const [loading, setLoading] = useState(false);
	const isUserVIP = user.info.allowed.length > 0;

	const thisStage = useMemo(() => circuit.stages.find((s) => s.id === stage.id), [circuit, stage]);

	const isAllButtonDisabled = () =>
		thisStage.rosters.reduce(
			(acc, r) =>
				acc +
				Math.max(
					0,
					r.wins -
						(thisStage.rosterProgress.find((p) => p.ut_pve_roster_id === r.ut_pve_roster_id)
							?.wins || 0)
				),
			0
		) === 0;

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
					wins: thisStage.rosterProgress.find((pr) => pr.ut_pve_roster_id === roster.id)?.wins || 0,
				}))
			);
		error &&
			toast.error(error.response.data.error, {
				toastId: error.response.data.errorCode,
			});
		setLoading(false);
	};

	useEffect(() => {
		isMountedRef.current = true;
		getRosters();

		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const repeatGame = async (remaining, totalWinsNeeded, opponent, thisStage) => {
		//play against opponent until [remaining] wins
		if (remaining === 0 || !isMountedRef.current) return;
		const payload = {
			rosterId: selectedRoster.id,
			enemyRosterId: opponent.id,
			bannedMapIds: opponent.mapBans,
			id: circuit.id,
			stageId: thisStage.id,
		};
		const result = await limiter.schedule({ id: `${opponent.id} - ${counter.current}` }, () =>
			playGame(payload)
		);
		if (result) {
			++counter.current;
			(counter.current === totalWinsNeeded || !isMountedRef.current) && setLoading(false); //if total won games = wins needed to clear the stage, loading => false
			repeatGame(--remaining, totalWinsNeeded, opponent, thisStage);
		} else if (isMountedRef.current) {
			repeatGame(remaining, totalWinsNeeded, opponent, thisStage); //if lost, play the same game
		}
	};

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
					{ toastId: result.game.id, autoClose: 4000, position: "top-left" }
				);
			} else {
				toast.warning(
					`Lost the game against ${
						rosters.find((roster) => roster.id === payload.enemyRosterId).name
					} with a ${result.game.user1.winChance.toFixed(3)}% chance. You lost ${
						result.game.user1.points
					} points.`,
					{ toastId: result.game.id, autoClose: 4000, position: "top-left" }
				);
			}
			return result.game.user1.winner;
		}
		if (error) {
			console.error(error);
			toast.error(error.response.data.error, {
				toastId: error.response.data.errorCode,
			});
		}
	};

	const winAll = async () => {
		setLoading(true);
		const remainingRosters = thisStage.rosters
			.map((roster) => {
				const winsNeeded =
					thisStage.rosterProgress.find((rstr) => rstr.ut_pve_roster_id === roster.ut_pve_roster_id)
						?.wins || 0;
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

		const totalWinsNeeded = remainingRosters.reduce((acc, cur) => acc + cur.winsNeeded - cur.won, 0);
		if (totalWinsNeeded === 0) {
			setLoading(false);
			toast.info(`This stage is completed.`, { toastId: "done" });
			return;
		}

		for await (const opponent of remainingRosters) {
			let winsLeft = opponent.winsNeeded - opponent.won;
			repeatGame(winsLeft, totalWinsNeeded, opponent, thisStage);
		}
	};

	const win20 = async () => {
		setLoading(true);
		const remainingRosters = thisStage.rosters
			.map((roster) => {
				const winsNeeded =
					thisStage.rosterProgress.find((rstr) => rstr.ut_pve_roster_id === roster.ut_pve_roster_id)
						?.wins || 0;
				const rosterInfo = rosters.find((rstr) => rstr.id === roster.ut_pve_roster_id);
				return {
					won: winsNeeded,
					id: roster.ut_pve_roster_id,
					winsNeeded: roster.wins,
					mapBans: getBestMaps(rosterInfo.stats.maps, selectedRoster.stats.maps),
					rating: rosterInfo.rating,
				};
			})
			.sort((a, b) => a.rating - b.rating);

		let winsLeft = 20;
		repeatGame(winsLeft, 20, remainingRosters[0], thisStage);
	};

	const claimReward = async () => {
		setLoading(true);
		const { result, error } = await postData(`/api/rush/claim`, {
			circuitId: circuit.id,
			stageId: stage.id,
		});
		if (!error) {
			toast.success("Claimed the reward!");
		}
		if (error) {
			console.error(error);
			toast.error(error.response.data.error, {
				toastId: error.response.data.errorCode,
			});
		}
		setLoading(false);
	};

	return (
		<>
			<BigModal
				showModal={showModal}
				setShowModal={setShowModal}
				loading={loading}
				header={`${circuit.name} - ${stage.name}`}
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
									circuit={circuit}
									stage={stage}
									locked={locked}
									setLocked={setLocked}
									loading={loading}
									setLoading={setLoading}
								/>
							))}
				</div>

				<div className='flex border-t border-gray-600 py-2 dark:border-gray-400'>
					<div className='ml-2 inline-flex items-center'>
						<button
							className='button !rounded-r-none !border-r-2'
							onClick={win20}
							disabled={loading || !isUserVIP}
						>
							{!isUserVIP && (
								<span className='mr-1.5'>
									<LockIcon />
								</span>
							)}
							<span>Win 20</span>
						</button>
						<button
							className='button !rounded-l-none'
							onClick={winAll}
							disabled={loading || !isUserVIP || isAllButtonDisabled()}
							title={
								!isUserVIP
									? "You need to have any VIP feature to unlock this"
									: isAllButtonDisabled()
									? "All rosters are already won"
									: "Win all games"
							}
						>
							{!isUserVIP && (
								<span className='mr-1.5'>
									<LockIcon />
								</span>
							)}
							<span>Complete all</span>
						</button>
						<Tooltip
							direction='right'
							text={
								!isUserVIP
									? "You need to have any VIP feature to unlock this"
									: "You are a lovely VIP user, so these features are added automatically"
							}
						/>
					</div>
					<div className='ml-auto mr-2 inline-flex items-center'>
						<button className='button' onClick={claimReward} disabled={loading || stage.isClaimed}>
							{loading ? (
								<LoadingSpin size={4} />
							) : !stage.isClaimed ? (
								<span>Claim reward</span>
							) : (
								<span>Reward already claimed</span>
							)}
						</button>
					</div>
				</div>
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
