import React from "react";
import { useContext } from "react";
import { Login } from "./Login";
import { UserContext } from "../context/UserContext";
import { Profile } from "./profile";
import Layout from "../components/Layout";

export default function index() {
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
}
