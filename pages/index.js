import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import Login from "./login";
import Profile from "./profile";
import Meta from "@/components/Meta";

const Index = () => {
	const { user } = useContext(UserContext);
	return (
		<>
			<Meta title='Kolex VIP - Toolkit for Kolex.gg' />
			{user && (
				<div className='container relative mx-auto h-full bg-gray-100 dark:bg-gray-700'>
					<Profile />
				</div>
			)}
			{!user && (
				<div className='h-screen w-full overflow-auto bg-gray-100 dark:bg-gray-700'>
					<Login />
				</div>
			)}
		</>
	);
};
export default Index;
