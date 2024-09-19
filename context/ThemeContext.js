import { createContext, useEffect } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";

export const ThemeContext = createContext();

const ThemeContextProvider = (props) => {
	const [theme, setTheme] = useLocalStorage("theme", "dark");
	const ISSERVER = typeof window === "undefined";

	useEffect(() => {
		localStorage.setItem("theme", JSON.stringify(theme));
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme]);

	return <ThemeContext.Provider value={{ theme, setTheme }}>{props.children}</ThemeContext.Provider>;
};

export default ThemeContextProvider;
