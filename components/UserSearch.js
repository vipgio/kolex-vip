import { useState, useCallback, useEffect } from "react";
import debounce from "lodash/debounce";
import uniqBy from "lodash/uniqBy";
import { CDN } from "@/config/config";
import { useAxios } from "@/hooks/useAxios";
import ImageWrapper from "@/HOC/ImageWrapper";

const UserSearch = ({ setSelectedUsers, selectedUsers, allowed = true, method = "username" }) => {
	const { fetchData } = useAxios();
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [results, setResults] = useState([]);

	useEffect(() => {
		searchQuery.length === 0 && setResults([]);
	}, [searchQuery]);

	const searchUser = async (username) => {
		const { result, error } = await fetchData(`/api/users/search?username=${username}`);
		if (result) {
			return result;
		} else {
			console.error(error);
		}
	};

	const getUserInfo = async (userId) => {
		const { result, error } = await fetchData(`/api/users/${userId}`);
		if (result) {
			return result;
		} else {
			console.error(error);
		}
	};

	const handleDebounce = async (input) => {
		if (input.startsWith("@")) {
			//search by ID
			setLoading(true);
			const userId = input.replace("@", "");
			const result = await getUserInfo(userId);
			if (result) {
				setResults([result.user]);
			}
			setLoading(false);
		} else {
			//search by username
			if (input.length > 2) {
				setLoading(true);
				const result = await searchUser(input);
				if (result) {
					setResults(result);
				}
				setLoading(false);
			}
		}
	};

	const debounceSearch = useCallback(debounce(handleDebounce, 1000), []);

	return (
		<div>
			<form onSubmit={(e) => e.preventDefault()} className='px-2'>
				<input
					type='text'
					onChange={(e) => {
						debounceSearch(e.target.value);
						setSearchQuery(e.target.value);
					}}
					value={searchQuery}
					className='input-field m-2'
					disabled={loading || !allowed}
					placeholder='Search for a user'
				/>
			</form>
			{searchQuery.length > 1 && (
				<div className='flex overflow-auto'>
					{results?.slice(0, 15).map((result) => (
						<button
							className={`${
								selectedUsers.find((user) => user.id === result.id) ? "bg-gray-500" : "hover:bg-gray-600"
							} text-gray-custom group mx-4 my-2 flex w-fit min-w-[8rem] flex-col items-center rounded-md border border-gray-400 p-2 transition-all hover:cursor-pointer active:scale-110 active:bg-gray-500`}
							key={result.id}
							onClick={() => {
								setSelectedUsers((prev) => uniqBy([...prev, result], "id"));
								setSearchQuery("");
								setResults([]);
							}}
						>
							<div className='relative flex h-16 w-16 overflow-hidden rounded-full border'>
								<ImageWrapper
									src={`${CDN}${result.avatar}`}
									alt={result.username}
									width={64}
									height={64}
									quality={80}
									className='object-cover'
									unoptimized={true}
								/>
							</div>
							<span className='text-gray-custom mt-2 font-semibold group-hover:text-gray-300'>
								{result.username}
							</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
};
export default UserSearch;
