import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Login from "./Login";
import Profile from "./profile";

const Index = () => {
	const { user } = useContext(UserContext);
	console.log(user);
	return (
		<>
			{user && (
				<div className='container relative mx-auto h-screen bg-gray-700'>
					<Profile />
				</div>
			)}
			{!user && (
				<div className='h-screen w-full overflow-auto bg-gray-700'>
					<Login />
				</div>
			)}
		</>
	);
};
export default Index;
