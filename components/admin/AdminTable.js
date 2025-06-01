import { createClient } from "@supabase/supabase-js";

import { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCheck, FiEdit2, FiPlus, FiSave, FiTrash2, FiX } from "react-icons/fi";

import { supabaseKey, supabaseUrl } from "@/config/config";

import LoadingSpin from "../LoadingSpin";

const supabase = createClient(supabaseUrl, supabaseKey);

const AdminPanel = ({ features, users }) => {
	const [usersLocal, setUsersLocal] = useState([]);
	const [newUser, setNewUser] = useState({ username: "", info: { allowed: [] }, ends: new Date() });
	const [editingUser, setEditingUser] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const sortedUsers = users
			.map((user) => ({ ...user, expired: user.ends ? new Date(user.ends) < new Date() : false }))
			.sort((a, b) => {
				// 1. Handle missing 'ends' dates:
				if (!a.ends) return 1; // a comes later if it has no end date
				if (!b.ends) return -1; // b comes later if it has no end date

				// 2. Prioritize banned status:
				if (a.banned && !b.banned) return 1; // a comes later if banned
				if (!a.banned && b.banned) return -1; // b comes later if banned

				// 3. Prioritize expired status:
				if (a.expired && !b.expired) return 1; // a comes later if expired
				if (!a.expired && b.expired) return -1; // b comes later if expired

				// 4. If all else is equal, sort by 'ends' date:
				return a.ends.localeCompare(b.ends);
			});
		setUsersLocal(sortedUsers);
	}, [users]);

	const allFeatures = features.filter((feature) => feature.price > 0 && !feature.info.perUse);

	const kolexDB = supabase.from("KolexDB");

	const handleFeatureToggle = async (username, feature) => {
		try {
			setLoading(true);
			const userToUpdate = usersLocal.find((u) => u.username === username);

			if (!userToUpdate) {
				throw new Error("User not found");
			}

			setUsersLocal((prevUsersLocal) =>
				prevUsersLocal.map((u) =>
					u.username === username
						? {
								...u,
								info: {
									...u.info,
									allowed: u.info.allowed.includes(feature)
										? u.info.allowed.filter((f) => f !== feature)
										: [...u.info.allowed, feature],
								},
							}
						: u,
				),
			);

			const { error: updateError } = await kolexDB
				.update({
					info: {
						...userToUpdate.info,
						allowed: userToUpdate.info.allowed.includes(feature)
							? userToUpdate.info.allowed.filter((f) => f !== feature)
							: [...userToUpdate.info.allowed, feature],
					},
				})
				.eq("username", username);

			if (updateError) {
				// 4. Revert the UI update if the database update fails
				setUsersLocal((prevUsersLocal) =>
					prevUsersLocal.map((u) => (u.username === username ? { ...userToUpdate } : u)),
				);
				throw updateError;
			}
			setLoading(false);

			console.log("User features updated successfully!");
		} catch (error) {
			console.error("Error updating user features:", error);
			setLoading(false);
		}
	};

	const handleNewUserFeatureToggle = (feature) => {
		setNewUser((prev) => ({
			...prev,
			info: {
				...prev.info,
				allowed: prev.info.allowed.includes(feature)
					? prev.info.allowed.filter((f) => f !== feature)
					: [...prev.info.allowed, feature],
			},
		}));
	};

	const handleAddUser = async (user) => {
		if (user.username) {
			try {
				// 1. Optimistically update the UI
				setUsersLocal((prevUsersLocal) => [...prevUsersLocal, user]);

				// 2. Add the user to Supabase
				const { error } = await kolexDB.insert([user]);

				if (error) {
					// 3. Revert the UI update if the database insert fails
					setUsersLocal((prevUsersLocal) =>
						prevUsersLocal.filter((u) => u.username !== user.username),
					);
					throw error;
				}

				setNewUser({ username: "", info: { allowed: [] }, ends: new Date() });
				console.log("User added successfully!");
			} catch (error) {
				console.error("Error adding user:", error);
				// Display an error message to the user
			}
		}
	};

	const handleUpdateEndDate = async (username, date) => {
		if (date) {
			setLoading(true);
			try {
				// 1. Find the user in the existing state
				const userToUpdate = usersLocal.find((u) => u.username === username);

				if (!userToUpdate) {
					throw new Error("User not found");
				}

				// 2. Optimistically update the UI
				setUsersLocal((prevUsersLocal) =>
					prevUsersLocal.map((u) => (u.username === username ? { ...u, ends: date } : u)),
				);

				// 3. Update the user's end date in Supabase
				const { error } = await kolexDB.update({ ends: date }).eq("username", username);

				if (error) {
					// 4. Revert the UI update if the database update fails
					setUsersLocal((prevUsersLocal) =>
						prevUsersLocal.map((u) => (u.username === username ? { ...userToUpdate } : u)),
					);
					throw error;
				}

				console.log("User end date updated successfully!");
				setLoading(false);
			} catch (error) {
				console.error("Error updating user end date:", error);
				setLoading(false);
				// Display an error message to the user
			}
		}
	};

	const handleEditUser = (user) => {
		setEditingUser({ ...user });
	};

	const handleSaveEdit = async () => {
		setLoading(true);
		try {
			setUsersLocal(
				usersLocal.map((user) => (user.username === editingUser.username ? editingUser : user)),
			);

			const userForDB = { ...editingUser };
			delete userForDB.expired;
			const { error } = await kolexDB.update(userForDB).eq("username", editingUser.username);

			if (error) {
				throw error;
			}

			setEditingUser(null);
			console.log("User updated successfully!");
			setLoading(false);
		} catch (error) {
			console.error("Error updating user:", error);
			setLoading(false);
		}
	};

	const handleDeleteUser = async (username) => {
		setLoading(true);
		try {
			setUsersLocal(usersLocal.filter((user) => user.username !== username));

			const { error } = await kolexDB.delete().eq("username", username);

			if (error) {
				throw error;
			}

			console.log("User deleted successfully!");
			setLoading(false);
		} catch (error) {
			console.error("Error deleting user:", error);
			setLoading(false);
			// Display an error message to the user
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<div className='w-full overflow-hidden rounded-lg bg-white shadow-lg'>
				{/* <div className='border-b border-gray-200 bg-gray-50 px-6 py-4'>
					<h2 className='text-2xl font-bold text-gray-800'>Admin Panel</h2>
				</div> */}
				<div className='p-6'>
					<div className='max-h-[70rem] overflow-auto'>
						<table className='w-full table-auto text-left text-sm text-gray-500'>
							<thead className='sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-700'>
								<tr>
									<th className='w-[200px] px-6 py-3'>User</th>
									{allFeatures.map((feature) => (
										<th key={feature.info.name} className='px-6 py-3 text-center'>
											{feature.info.name}
										</th>
									))}
									<th className='w-[200px] px-6 py-3 text-center'>End Date</th>
									<th className='w-[100px] px-6 py-3 text-center'>Days left</th>
									<th className='w-[100px] px-6 py-3 text-center'>Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr className='border-b bg-white'>
									{" "}
									{/* New user row */}
									<td className='px-6 py-4'>
										<input
											type='text'
											placeholder='New username'
											value={newUser.username}
											disabled={loading}
											onChange={(e) =>
												setNewUser((prev) => ({ ...prev, username: e.target.value }))
											}
											className='input-field'
										/>
									</td>
									{allFeatures.map((feature) => (
										<td key={feature.info.name} className='px-6 py-4 text-center'>
											<button
												disabled={loading}
												className={`h-5 w-5 rounded ${
													newUser.info.allowed.includes(feature.name)
														? "bg-blue-500 text-white"
														: "bg-gray-200"
												} mx-auto flex items-center justify-center`}
												onClick={() => handleNewUserFeatureToggle(feature.name)}
											>
												{newUser.info.allowed.includes(feature.name) ? (
													<FiCheck className='h-4 w-4' />
												) : (
													<FiX className='h-4 w-4' />
												)}
											</button>
										</td>
									))}
									<td className='px-6 py-4 text-right'>
										<DatePicker
											selected={newUser.ends}
											disabled={loading}
											onChange={(date) =>
												setNewUser((prev) => ({ ...prev, ends: date }))
											}
											dateFormat='dd-MM-yyyy'
											className='w-36 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50'
										/>
									</td>
									<td></td>
									<td className='px-6 py-4 text-center'>
										<button
											onClick={() => handleAddUser(newUser)}
											className='submit-button flex items-center justify-center'
											disabled={!newUser.username || loading}
										>
											{loading ? (
												<LoadingSpin size={4} />
											) : (
												<>
													<FiPlus className='h-4 w-4' /> Add
												</>
											)}
										</button>
									</td>
								</tr>
								{usersLocal.map((user) => (
									<tr
										key={user.username}
										className={`border-b ${user.expired ? "bg-red-100" : "bg-gray-100"}`}
									>
										<td className='whitespace-nowrap px-6 py-4 font-medium text-gray-900'>
											{editingUser && editingUser.username === user.username ? (
												<input
													type='text'
													value={editingUser.username}
													onChange={(e) =>
														setEditingUser({
															...editingUser,
															name: e.target.value,
														})
													}
													className='w-full rounded-md border border-gray-300 px-2 py-1'
												/>
											) : (
												<div className={`${user.info.banned ? "text-red-500" : ""}`}>
													{user.username}
												</div>
											)}
										</td>
										{allFeatures.map((feature) => (
											<td key={feature.info.name} className={` px-6 py-4 text-center`}>
												<button
													className={`h-5 w-5 rounded ${
														user.info?.allowed?.includes(feature.name)
															? "bg-blue-500 text-white"
															: "bg-gray-200"
													} mx-auto flex items-center justify-center`}
													onClick={() =>
														handleFeatureToggle(user.username, feature.name)
													}
												>
													{user.info?.allowed?.includes(feature.name) ? (
														<FiCheck className='h-4 w-4' />
													) : (
														<FiX className='h-4 w-4' />
													)}
												</button>
											</td>
										))}
										<td className='flex items-center px-6 py-4 text-right'>
											<DatePicker
												selected={
													user.ends ? new Date(user.ends) : new Date("2028-12-25")
												}
												onChange={(date) => handleUpdateEndDate(user.username, date)}
												dateFormat='dd-MM-yyyy'
												disabled={loading}
												className='w-36 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50'
											/>
										</td>
										<td className='px-6 py-4 text-center'>
											{getDaysDifference(user.ends)}
										</td>
										<td className='px-6 py-4 text-center'>
											{editingUser && editingUser.username === user.username ? (
												<button
													onClick={handleSaveEdit}
													className='mr-2 h-5 w-5 text-green-600 hover:text-green-900'
													disabled={loading}
												>
													{loading ? (
														<LoadingSpin size={4} />
													) : (
														<FiSave className='h-5 w-5' />
													)}
												</button>
											) : loading ? (
												<span></span>
											) : (
												<button
													onClick={() => handleEditUser(user)}
													className='mr-2 h-5 w-5 text-blue-600 hover:text-blue-900'
												>
													<FiEdit2 className='h-5 w-5' />
												</button>
											)}
											<button
												onClick={() => handleDeleteUser(user.username)}
												className='h-5 w-5 text-red-600 hover:text-red-900'
												disabled={loading}
											>
												{loading ? (
													<LoadingSpin size={4} />
												) : (
													<FiTrash2 className='h-5 w-5' />
												)}
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

AdminPanel.getInitialProps = async () => {
	try {
		const [{ data: features, error: featureError }] = await supabase
			.from("kolexFeatures")
			.select("*")
			.order("id");
		console.log(features, featureError);

		if (featureError) throw featureError;

		return {
			features: features,
		};
	} catch (err) {
		console.error("Failed to fetch data:", err);
		return { error: "Failed to load page data" };
	}
};

export default AdminPanel;

function getDaysDifference(endDateString) {
	const endDate = new Date(endDateString);
	const currentDate = new Date();

	// Calculate the difference in milliseconds
	const diffInMs = endDate.getTime() - currentDate.getTime();

	// Convert milliseconds to days
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	return diffInDays;
}
