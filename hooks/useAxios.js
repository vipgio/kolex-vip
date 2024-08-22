import { useContext } from "react";
import axios from "axios";
import http from "@/utils/httpClient";
import { UserContext } from "context/UserContext";

const useAxios = () => {
	const { user, categoryId } = useContext(UserContext);

	const fetchData = async (endpoint, params, controller, direct = false, forceCategoryId = false) => {
		let result, error;

		if (typeof endpoint === "object" && endpoint !== null) {
			// Destructure properties from the object into the existing variables
			({
				endpoint = endpoint, // Defaults to the existing variable if not present
				params = params,
				controller = controller,
				direct = direct,
				forceCategoryId = forceCategoryId,
			} = endpoint);
		}

		const config = {
			headers: direct //for calls directly to the kolex api instead of nextjs api
				? {
						"Content-Type": "application/json",
						"x-user-jwt": user.jwt,
				  }
				: {
						jwt: user.jwt,
				  },
		};
		if (controller) {
			config.signal = controller.signal;
		}
		try {
			const requestParams = forceCategoryId ? { ...params, categoryId } : params;

			const { data } = await http.get(endpoint, {
				params: requestParams,
				...config,
			});

			if (data.success) {
				result = data.data;
			}
		} catch (err) {
			error = err;
		}
		if (error) {
			console.error(error);
		}
		return { result, error };
	};

	const postData = async (endpoint, payload, controller, direct = false) => {
		let result, error, info;
		try {
			const config = direct
				? {
						headers: {
							"Content-Type": "application/json",
							"x-user-jwt": user.jwt,
						},
				  }
				: {
						headers: { jwt: user.jwt },
				  };
			if (controller) {
				config.signal = controller.signal;
			}

			const { data } = await axios.post(endpoint, payload, config);
			info = data;
			if (data.success) {
				result = data.data;
			}
		} catch (err) {
			error = err;
		}
		return { result, error, info };
	};

	const patchData = async (endpoint, payload) => {
		let result, error;
		try {
			const config = {
				headers: { jwt: user.jwt },
			};
			const { data } = await axios.patch(endpoint, payload, config);
			if (data.success) {
				result = data;
			}
		} catch (err) {
			error = err;
		}
		return { result, error };
	};

	const deleteData = async (endpoint) => {
		let result, error;
		try {
			const { data } = await axios.delete(endpoint, {
				headers: { jwt: user.jwt },
			});
			if (data.success) {
				result = data;
			}
		} catch (err) {
			error = err;
		}
		return { result, error };
	};

	return { fetchData, postData, patchData, deleteData };
};
export { useAxios };
