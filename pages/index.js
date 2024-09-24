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
				<div className='bg-main container relative mx-auto h-full'>
					<Profile />
				</div>
			)}
			{!user && (
				<div className='bg-main h-screen w-full overflow-auto'>
					<Login />
				</div>
			)}
		</>
	);
};
export default Index;
