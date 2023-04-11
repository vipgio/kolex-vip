import axios from "axios";
import { useEffect, useState } from "react";

const ESLLogin = () => {
	const [eslData, setEslData] = useState({});

	const fetchESL = async () => {
		const { data } = await axios.get(
			"https://api.kolex.gg/api/v1/oauth/url?categoryId=1&provider=esl&isMobile=false"
		);
		let url = "";
		if (data.success) {
			console.log(data);
			const clientId = data.data.url.split("client_id=")[1].split("&")[0];
			url = `https://account.eslgaming.com/login?client_id=${clientId}`;
			console.log(url);
		}
	};

	useEffect(() => {
		fetchESL();
	}, []);

	return (
		<>
			<div className='mb-2 font-semibold text-gray-700 dark:text-gray-300'>
				Or use ESL Account
			</div>
			<div className='text-center'>
				<button className='button' onClick={fetchESL}>
					ESL ID
				</button>
			</div>
		</>
	);
};
export default ESLLogin;
