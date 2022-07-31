import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });

export const UserContext = createContext();

const UserContextProvider = (props) => {
	const [loading, setLoading] = useState(false); // loading state for fetchig data
	const [user, setUser] = useState(null); // user object
	const [active, setActive] = useState(0); // navbar active state
	const [initialLoading, setInitialLoading] = useState(true); // used to show loading screen on first load and redirect
	const router = useRouter();

	useEffect(() => {
		const localUser = localStorage.getItem("user");
		if (localUser) {
			console.log("expires in", JSON.parse(localUser).expires);
			console.log("now", Date.now() / 1000);
			console.log("diff", JSON.parse(localUser).expires - Date.now() / 1000);
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

	const login = async (auth) => {
		return http("https://api.epics.gg/api/v1/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			data: JSON.stringify(auth),
		});
	};

	const getCirc = async (collectionId) => {
		return http(
			`https://api.epics.gg/api/v1/collections/${collectionId}/card-templates?categoryId=1`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": user.jwt,
				},
			}
		);
	};

	const getCollections = async () => {
		return http(
			`https://api.epics.gg/api/v1/collections/users/${user.user.id}/user-summary?categoryId=1`,
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
		return http(`https://api.epics.gg/api/v1/packs?page=${page}&categoryId=1`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-user-jwt": user.jwt,
			},
		});
	};

	const userPacks = async (page) => {
		return http(`https://api.epics.gg/api/v1/packs/user?page=${page}&categoryId=1`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-user-jwt": user.jwt,
			},
		});
	};

	const spinnerOdds = async () => {
		return http(`https://api.epics.gg/api/v1/spinner?categoryId=1`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-user-jwt": user.jwt,
			},
		});
	};

	const buySpin = async () => {
		return http(`https://api.epics.gg/api/v1/spinner/buy-spin?categoryId=1`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-user-jwt": user.jwt,
			},
			data: JSON.stringify({
				amount: 1,
			}),
		});
	};

	const spin = async (id) => {
		return http(`https://api.epics.gg/api/v1/spinner/spin?categoryId=1`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-user-jwt": user.jwt,
			},
			data: JSON.stringify({
				spinnerId: id,
			}),
		});
	};

	const getFunds = async () => {
		return http(`https://api.epics.gg/api/v1/user/funds?categoryId=1`, {
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
				login,
				getCirc,
				getCollections,
				getPacks,
				spinnerOdds,
				active,
				setActive,
				buySpin,
				spin,
				getFunds,
				userPacks,
				initialLoading,
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserContextProvider;
