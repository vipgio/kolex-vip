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
	const [tradeList, setTradeList] = useState({
		// send: {
		// 	items: [],
		// 	bestOwned: [],
		// },
		// receive: [{ user: "", id: "", items: [], bestOwned: [] }],
	});
	const [owned, setOwned] = useState([]);
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
		const localTrade = localStorage.getItem("tradeList");
		if (localTrade) {
			setTradeList(JSON.parse(localTrade));
		}
	}, [router.asPath]);

	useEffect(() => {
		if (tradeList) {
			localStorage.setItem("tradeList", JSON.stringify(tradeList));
		} else {
			localStorage.removeItem("tradeList");
		}
	}, [tradeList]);

	const getCardCirc = async (collectionId) => {
		return http(
			`https://api.kolex.gg/api/v1/collections/${collectionId}/card-templates?categoryId=1`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": user.jwt,
				},
			}
		);
	};
	const getStickerCirc = async (collectionId) => {
		return http(
			`https://api.kolex.gg/api/v1/collections/${collectionId}/sticker-templates?categoryId=1`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": user.jwt,
				},
			}
		);
	};

	const getPacks = async (page) => {
		return http(`https://api.kolex.gg/api/v1/packs?page=${page}&categoryId=1`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-user-jwt": user.jwt,
			},
		});
	};

	const userPacks = async (page) => {
		return http(`https://api.kolex.gg/api/v1/packs/user?page=${page}&categoryId=1`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-user-jwt": user.jwt,
			},
		});
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
				tradeList,
				setTradeList,
				setOwned,
				owned,
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserContextProvider;
