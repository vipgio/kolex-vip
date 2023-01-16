import { useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "context/UserContext";

const useAxios = () => {
	const { user } = useContext(UserContext);

	const fetchData = async (endpoint, params) => {
		let result, error;
		try {
			const { data } = await axios.get(endpoint, {
				params: params,
				headers: { jwt: user.jwt },
			});
			if (data.success) {
				result = data.data;
			}
		} catch (err) {
			error = err;
		}
		return { result, error };
	};

	const postData = async (endpoint, payload, controller) => {
		let result, error, info;
		try {
			const { data } = await axios.post(
				endpoint,
				{
					data: payload,
					signal: controller?.signal,
				},
				{
					headers: { jwt: user.jwt },
				}
			);
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

	useEffect(() => {
		fetchData();
	});
	return { fetchData, postData, patchData, deleteData };
};
export { useAxios };
