import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAxios } from "@/hooks/useAxios";
import LoadingSpin from "../LoadingSpin";
import StageInfo from "./StageInfo";
import StageSelectionCard from "./StageSelectionCard";

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
		setCircuitInfo([]);
		fetchCircuitInfo();
	}, []);

	return (
		<>
			{circuitInfo.length === 0 ? (
				<LoadingSpin />
			) : (
				<>
					{circuitInfo.map((circuit) => (
						<div
							key={circuit.id}
							className={`text-gray-custom mb-10 overflow-hidden rounded border`}
						>
							<button
								style={{ backgroundColor: circuit.properties.accent_color }}
								className='my-outline w-full rounded p-2 text-center text-lg font-semibold'
								onClick={() => handleSelect(circuit.id)}
								disabled={!isRosterSelected}
								title={isRosterSelected ? "Select the circuit" : "Select a roster"}
							>
								<span>{circuit.name}</span>
							</button>

							<div
								className={`grid grid-cols-2 gap-y-3 gap-x-5 sm:grid-cols-4 ${
									selectedCircuit?.id === circuit.id ? "max-h-96 p-2" : "max-h-0"
								} transition-all duration-300 ease-in-out`}
							>
								{circuitInfo
									.find((c) => c.id === circuit.id)
									.stages.map((stage) => (
										<StageSelectionCard
											key={stage.id}
											stage={stage}
											setShowStageModal={setShowStageModal}
											setSelectedStage={setSelectedStage}
										/>
									))}
							</div>
						</div>
					))}
					{showStageModal && (
						<StageInfo
							stage={selectedStage}
							circuit={circuitInfo.find((circuit) => circuit.id === selectedCircuit.id)}
							setCircuitInfo={setCircuitInfo}
							showModal={showStageModal}
							setShowModal={setShowStageModal}
						/>
					)}
				</>
			)}
		</>
	);
};
export default Circuits;
