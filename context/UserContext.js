import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

export const UserContext = createContext();

const UserContextProvider = (props) => {
	const [user, setUser] = useState(null); // user object
	const [initialLoading, setInitialLoading] = useState(true); // used to show loading screen on first load and redirect
	const [categoryId, setCategoryId] = useState(null);
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
		if (categoryId) {
			localStorage.setItem("categoryId", categoryId);
			setCategoryId(categoryId);
			console.log("Category ID: ", categoryId);
			if (categoryId == "1") {
				document.documentElement.classList.add("theme-cs");
			} else if (categoryId == "2") {
				document.documentElement.classList.add("theme-streamers");
			} else if (categoryId == "4") {
				document.documentElement.classList.add("theme-pubg");
			} else {
				document.documentElement.classList.add("theme-skgaming");
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
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserContextProvider;
