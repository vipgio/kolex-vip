import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

export const UserContext = createContext();

const UserContextProvider = (props) => {
	const [user, setUser] = useState(null); // user object
	const [initialLoading, setInitialLoading] = useState(true); // used to show loading screen on first load and redirect
	const [categoryId, setCategoryId] = useState(null);
	const [categories, setCategories] = useState([]);
	const [packGalleryColumns, setPackGalleryColumns] = useState(null);
	const router = useRouter();

	useEffect(() => {
		const localUser = localStorage.getItem("user");
		if (localUser) {
			if (JSON.parse(localUser).expires < Date.now() / 1000) {
				setUser(null);
			} else {
				setUser(JSON.parse(localUser));
			}
		}
		setInitialLoading(false);
	}, [router.asPath]);

	useEffect(() => {
		if (user) {
			localStorage.setItem("user", JSON.stringify(user));
		} else {
			localStorage.removeItem("user");
		}
		setInitialLoading(false);
	}, [user]);

	useEffect(() => {
		const localCategory = localStorage.getItem("categoryId");
		if (localCategory) {
			setCategoryId(localCategory);
		} else {
			setCategoryId("1");
		}
	}, []);

	useEffect(() => {
		const localPackGalleryColumns = JSON.parse(localStorage.getItem("packGalleryColumns"));
		if (localPackGalleryColumns) {
			setPackGalleryColumns(localPackGalleryColumns);
		} else {
			localStorage.setItem("packGalleryColumns", "4");
			setPackGalleryColumns("4");
		}
	}, []);
	useEffect(() => {
		localStorage.setItem("packGalleryColumns", packGalleryColumns);
	}, [packGalleryColumns]);

	useEffect(() => {
		if (categoryId) {
			localStorage.setItem("categoryId", categoryId);
			setCategoryId(categoryId);
			console.log("Category ID: ", categoryId);
			switch (categoryId) {
				case "1":
					document.documentElement.classList.add("theme-csgo");
					break;
				case "2":
					document.documentElement.classList.add("theme-streamers");
					break;
				case "4":
					document.documentElement.classList.add("theme-pubg");
					break;
				case "40":
					document.documentElement.classList.add("theme-skgaming");
					break;
				case "73":
					document.documentElement.classList.add("theme-kingsleague");
					break;
				case "106":
					document.documentElement.classList.add("theme-hiroquest");
					break;
				case "107":
					document.documentElement.classList.add("theme-csc");
					break;
				default:
					document.documentElement.classList.add("theme-csgo");
					break;
			}
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
