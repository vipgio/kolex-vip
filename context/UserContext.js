import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });

export const UserContext = createContext();

const UserContextProvider = (props) => {
	const [loading, setLoading] = useState(false); // loading state for fetchig data
	const [user, setUser] = useState(null); // user object
	const [initialLoading, setInitialLoading] = useState(true); // used to show loading screen on first load and redirect
	const [owned, setOwned] = useState([]);
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

	const getCardCirc = async (collectionId, categoryId) => {
		return http(
			`https://api.kolex.gg/api/v1/collections/${collectionId}/card-templates?categoryId=${categoryId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": user.jwt,
				},
			}
		);
	};
	const getStickerCirc = async (collectionId, categoryId) => {
		return http(
			`https://api.kolex.gg/api/v1/collections/${collectionId}/sticker-templates?categoryId=${categoryId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": user.jwt,
				},
			}
		);
	};

	const getPacks = async (page, categoryId) => {
		return http(
			`https://api.kolex.gg/api/v1/packs?page=${page}&categoryId=${categoryId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": user.jwt,
				},
			}
		);
	};

	const userPacks = async (page, categoryId) => {
		return http(
			`https://api.kolex.gg/api/v1/packs/user?page=${page}&categoryId=${categoryId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": user.jwt,
				},
			}
		);
	};

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				loading,
				setLoading,
				getCardCirc,
				getStickerCirc,
				getPacks,
				userPacks,
				initialLoading,
				setOwned,
				owned,
				categoryId,
				setCategoryId,
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserContextProvider;
