import { createContext, useState } from "react";

export const CardListerContext = createContext();

const CardListerContextProvider = (props) => {
	const [loadedState, setLoadedState] = useState([]);

	return (
		<CardListerContext.Provider value={{ loadedState, setLoadedState }}>
			{props.children}
		</CardListerContext.Provider>
	);
};

export default CardListerContextProvider;
