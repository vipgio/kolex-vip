import { createContext, useState } from "react";

export const RushContext = createContext();

const RushContextProvider = (props) => {
	const [maps, setMaps] = useState([]);
	const [selectedRoster, setSelectedRoster] = useState(null);
	const [locked, setLocked] = useState(false);

	return (
		<RushContext.Provider
			value={{
				maps,
				setMaps,
				selectedRoster,
				setSelectedRoster,
				locked,
				setLocked,
			}}
		>
			{props.children}
		</RushContext.Provider>
	);
};

export default RushContextProvider;
