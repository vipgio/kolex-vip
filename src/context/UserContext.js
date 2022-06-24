import { createContext, useEffect, useState } from "react";
import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });

export const UserContext = createContext();

const UserContextProvider = (props) => {
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const localUser = localStorage.getItem("user");
		if (localUser) {
			if (localUser.expires < Date.now() / 1000) {
				setUser(null);
			} else {
				setUser(JSON.parse(localUser));
			}
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("user", JSON.stringify(user));
	}, [user]);

	const login = (auth) => {
		return http("https://api.epics.gg/api/v1/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			data: JSON.stringify(auth),
		});
	};

	const getCirc = (collectionId) => {
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

	const getCollections = () => {
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

	const getPacks = (page) => {
		return http(`https://api.epics.gg/api/v1/packs?page=${page}&categoryId=1`, {
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
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserContextProvider;
