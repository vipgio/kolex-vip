import { useEffect, useState } from "react";
import Image from "next/future/image";
import { toast } from "react-toastify";
import { BiCheck } from "react-icons/bi";
import { useAxios } from "hooks/useAxios";
import { CDN } from "@/config/config";
import LoadingSpin from "../LoadingSpin";
import StageInfo from "./StageInfo";

const Circuits = ({ circuits, isRosterSelected }) => {
	const { fetchData } = useAxios();
	const [selectedCircuit, setSelectedCircuit] = useState(null);
	const [circuitInfo, setCircuitInfo] = useState([]);
	const [selectedStage, setSelectedStage] = useState(null);
	const [showStageModal, setShowStageModal] = useState(false);

	const handleSelect = async (id) => {
		if (selectedCircuit?.id === id) {
			setSelectedCircuit(null);
		} else {
			setSelectedCircuit(circuitInfo.find((circuit) => circuit.id === id));
		}
	};

	useEffect(() => {
		const fetchCircuitInfo = async () => {
			circuits.map(async (circuit) => {
				const { result, error } = await fetchData("/api/rush/circuit", {
					circuitId: circuit.id,
				});
				// result && setCircuitInfo(result.circuit);
				result && setCircuitInfo((prev) => [...prev, result.circuit]);
				error &&
					toast.error(error.response.data.error, {
						toastId: error.response.data.errorCode,
					});
			});
		};
		fetchCircuitInfo();
	}, []);

	return (
		<>
			{circuitInfo.length === 0 ? (
				<LoadingSpin />
			) : (
				circuitInfo.map((circuit) => (
					<div
						key={circuit.id}
						className={`mb-10 h-fit rounded border text-gray-700 dark:text-gray-300`}
					>
						{showStageModal && (
							<StageInfo
								selectedCircuit={selectedCircuit}
								stage={selectedStage}
								thisCircuit={circuitInfo.find(
									(circuit) => circuit.id === selectedCircuit.id
								)}
								setCircuitInfo={setCircuitInfo}
								showModal={showStageModal}
								setShowModal={setShowStageModal}
							/>
						)}
						<button
							style={{ backgroundColor: circuit.properties.accent_color }}
							className='w-full rounded p-2 text-center text-lg font-semibold disabled:cursor-not-allowed disabled:opacity-50'
							onClick={() => handleSelect(circuit.id)}
							disabled={!isRosterSelected}
							title={isRosterSelected ? "Select the circuit" : "Select a roster"}
						>
							<span>{circuit.name}</span>
						</button>
						{selectedCircuit?.id === circuit.id && (
							<div className='grid grid-cols-2 gap-y-3 gap-x-5 p-2 sm:grid-cols-4'>
								{circuitInfo
									.find((c) => c.id === circuit.id)
									.stages.map((stage) => (
										<div key={stage.id} className='flex items-center justify-center p-1'>
											<span
												className='flex w-fit cursor-pointer items-center justify-center'
												onClick={() => {
													setShowStageModal(true);
													setSelectedStage(stage);
												}}
												title={stage.name}
											>
												<div className='relative mr-2 h-12 w-12'>
													<Image
														src={`${CDN}${stage.images[0].url}`}
														alt={stage.name}
														width={50}
														height={50}
														unoptimized={true}
														className='h-full w-full object-contain'
													/>
												</div>
												<span>{stage.name}</span>
												{stage.completed && (
													<BiCheck size={20} className='stroke-1 text-green-500' />
												)}
											</span>
										</div>
									))}
							</div>
						)}
					</div>
				))
			)}
		</>
	);
};
export default Circuits;
