import { useContext } from "react";
import axios from "axios";
import http from "@/utils/httpClient";
import { UserContext } from "context/UserContext";

const useAxios = () => {
	const { user, categoryId } = useContext(UserContext);

	const fetchData = async (endpoint, params, controller) => {
		let result, error;
		try {
			const { data } = await http.get(endpoint, {
				params: { ...params, categoryId: categoryId },
				headers: { jwt: user.jwt },
				signal: controller && controller.signal,
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

	const postData = async (endpoint, payload, controller) => {
		let result, error, info;
		try {
			const config = {
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
			const { data } = await axios.patch(
				endpoint,
				{
					data: payload,
				},
				{
					headers: { jwt: user.jwt },
				}
			);
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
