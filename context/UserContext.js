import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useLocalStorage from "@/hooks/useLocalStorage";
import isMobile from "@/utils/isMobile";

export const UserContext = createContext();

const UserContextProvider = (props) => {
	// const [user, setUser] = useState(null); // user object
	const [user, setUser] = useLocalStorage("user", null);
	const [initialLoading, setInitialLoading] = useState(true); // used to show loading screen on first load and redirect
	// const [categoryId, setCategoryId] = useState(null);
	const [categoryId, setCategoryId] = useLocalStorage("categoryId", null);
	// const [categories, setCategories] = useState([]);
	const [categories, setCategories] = useLocalStorage("categories", []);
	// const [packGalleryColumns, setPackGalleryColumns] = useState(null);
	const [packGalleryColumns, setPackGalleryColumns] = useLocalStorage("packGalleryColumns", null);
	const router = useRouter();

	useEffect(() => {
		const localUser = localStorage.getItem("user");
		if (localUser) {
			if (JSON.parse(localUser)?.expires < Date.now() / 1000) {
				setUser(null);
			} else {
				setUser(JSON.parse(localUser));
			}
		}
		setInitialLoading(false);
	}, [router.asPath]);

	// useEffect(() => {
	// 	if (user) {
	// 		localStorage.setItem("user", JSON.stringify(user));
	// 	} else {
	// 		localStorage.removeItem("user");
	// 	}
	// 	setInitialLoading(false);
	// }, [user]);

	// useEffect(() => {
	// 	const localCategory = localStorage.getItem("categoryId");
	// 	if (localCategory) {
	// 		setCategoryId(localCategory);
	// 	} else {
	// 		setCategoryId("1");
	// 	}
	// }, []);

	// useEffect(() => {
	// 	const localPackGalleryColumns = JSON.parse(localStorage.getItem("packGalleryColumns"));
	// 	if (localPackGalleryColumns) {
	// 		setPackGalleryColumns(localPackGalleryColumns);
	// 	} else {
	// 		if (isMobile()) {
	// 			localStorage.setItem("packGalleryColumns", "2");
	// 			setPackGalleryColumns("2");
	// 		} else {
	// 			localStorage.setItem("packGalleryColumns", "4");
	// 			setPackGalleryColumns("4");
	// 		}
	// 	}
	// }, []);
	// useEffect(() => {
	// 	localStorage.setItem("packGalleryColumns", packGalleryColumns);
	// }, [packGalleryColumns]);

	useEffect(() => {
		if (packGalleryColumns === null) {
			const newValue = isMobile() ? "2" : "4";
			setPackGalleryColumns(newValue);
		}
	}, [packGalleryColumns, setPackGalleryColumns]);

	const themeMapping = {
		1: "theme-csgo",
		2: "theme-streamers",
		4: "theme-pubg",
		40: "theme-skgaming",
		73: "theme-kingsleague",
		106: "theme-hiroquest",
		107: "theme-csc",
	};
	useEffect(() => {
		const themeClass = themeMapping[categoryId] || "theme-csgo";
		document.documentElement.classList.add(themeClass);
		if (categoryId) {
			localStorage.setItem("categoryId", categoryId);
			setCategoryId(categoryId.toString());
			console.log("Category ID: ", categoryId);
		} else {
			localStorage.removeItem("categoryId");
		}
	}, [categoryId]);

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				initialLoading,
				categoryId,
				setCategoryId,
				packGalleryColumns,
				setPackGalleryColumns,
				categories,
				setCategories,
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserContextProvider;
