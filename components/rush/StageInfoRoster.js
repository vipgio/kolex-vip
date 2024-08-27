import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { BiCheck, BiPlayCircle } from "react-icons/bi";
import { FaLock } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { useAxios } from "@/hooks/useAxios";
import { RushContext } from "@/context/RushContext";
import LoadingSpin from "@/components/LoadingSpin";

const StageInfoRoster = ({ roster, circuit, stage, locked, setLocked, loading }) => {
	const { postData } = useAxios();
	const { selectedRoster } = useContext(RushContext);
	const [progress, setProgress] = useState(roster.wins);
	const [localLoading, setLocalLoading] = useState(false);

	const currStage = circuit.stages.find((s) => s.id === stage.id);

	const winsNeeded = currStage.rosters.find((team) => team.ut_pve_roster_id === roster.id).wins;

	useEffect(() => {
		setProgress(roster.wins);
	}, [roster.wins]);

	const playGame = async (payload) => {
		const { result, error } = await postData("/api/rush/play-game", payload);
		if (result) {
			if (result.game.user1.winner) {
				setProgress((prev) => prev + 1);
				toast.success(
					`Won the game with a ${result.game.user1.winChance.toFixed(3)}% chance. You gained ${
						result.game.user1.points
					} points.`,
					{ toastId: result.game.id, autoClose: 7000 }
				);
			} else {
				toast.warning(
					`Lost the game with a ${result.game.user1.winChance.toFixed(3)}% chance. You lost ${
						result.game.user1.points
					} points.`,
					{ toastId: result.game.id, autoClose: 7000 }
				);
			}
		}
		if (error) {
			console.error(error);
			toast.error(error.response.data.error, {
				toastId: error.response.data.errorCode,
			});
		}
	};

	const playRush = async () => {
		setLocked(true);
		setLocalLoading(true);
		const timeBeforeReq = new Date().getTime();
		const enemyMaps = roster.stats.maps;
		const myMaps = selectedRoster.stats.maps;
		const combinedMaps = myMaps
			.map((myMap) => ({
				mapId: myMap.mapId,
				weight: myMap.weight - enemyMaps.find((m) => m.map_id === myMap.mapId).weight,
			}))
			.sort((a, b) => a.weight - b.weight);

		const payload = {
			rosterId: selectedRoster.id,
			enemyRosterId: roster.id,
			bannedMapIds: [combinedMaps[0].mapId, combinedMaps[1].mapId],
			id: circuit.id,
			stageId: currStage.id,
		};
		await playGame(payload);

		setLocalLoading(false);
		const timeAfterReq = new Date().getTime();
		setTimeout(() => {
			setLocked(false);
		}, 7000 + (timeAfterReq - timeBeforeReq)); // 7 seconds + whatever it took for the request to be done (so it aligns with the toast)
	};

	return (
		<>
			<div className='m-2 flex rounded border border-gray-500 p-2'>
				<span className='flex w-2/5 items-center sm:w-2/6'>{roster.name}</span>
				<span className='w-1/5 xs:mr-2 sm:mr-0 sm:w-1/6'>Rating: {roster.rating}</span>
				<span className='hidden w-1/5 items-center sm:inline-flex sm:w-1/6'>Level: {roster.level}</span>
				<span className='flex w-1/5 items-center sm:w-1/6'>
					Wins:{" "}
					<span className='flex items-center'>
						<span className='ml-1'>{progress}</span>
						<span className='mx-1'>/</span>
						<span>{winsNeeded}</span>
					</span>
					{progress >= winsNeeded && (
						<div className='ml-1 mt-1 hidden h-5 w-5 xs:block'>
							<BiCheck className='stroke-1 text-green-500' />
						</div>
					)}
				</span>
				<span className='ml-auto flex w-1/5 items-center  justify-center sm:w-1/6'>
					<button
						onClick={playRush}
						disabled={locked || loading || localLoading}
						className='disabled:cursor-not-allowed disabled:opacity-50'
						title={
							locked ? "Locked due to rush limits" : loading || localLoading ? "In progress..." : "Play a game"
						}
					>
						{loading || localLoading ? (
							<LoadingSpin size={4} />
						) : !locked ? (
							<BiPlayCircle
								size={20}
								className={`stroke-1 ${
									progress >= winsNeeded
										? "text-gray-500 hover:text-gray-300 active:text-gray-400"
										: "text-green-500 hover:text-green-300 active:text-green-400"
								}`}
							/>
						) : (
							<FaLock size={20} />
						)}
					</button>
				</span>
			</div>
		</>
	);
};
export default StageInfoRoster;
