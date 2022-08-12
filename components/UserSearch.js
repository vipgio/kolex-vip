import { useState, useCallback } from "react";
import axios from "axios";
import Image from "next/future/image";
import { CDN } from "@/config/config";
import { useEffect } from "react";
const UserSearch = ({
	jwt,
	setSelectedUser,
	selectedUser,
	setShowSearchSection,
	disabled,
}) => {
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [results, setResults] = useState([]);
	const [showResults, setShowResults] = useState(false);

	useEffect(() => {
		searchQuery.length === 0 && setResults([]);
	}, [searchQuery]);

	const searchUser = async (username) => {
		const { data } = await axios.get(`/api/users/search?username=${username}`, {
			headers: {
				jwt: jwt,
			},
		});
		return data;
	};

	const handleDebounce = async (input) => {
		if (input.length > 2) {
			setLoading(true);
			const { data } = await searchUser(input);
			setResults(data);
			setLoading(false);
		}
	};

	const debounceSearch = useCallback(_.debounce(handleDebounce, 1000), []);

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
					// disabled={loading}
					placeholder='Search for a user'
					tabIndex={disabled ? -1 : 0}
				/>
			</form>
			{searchQuery.length > 2 && (
				<div className='flex overflow-auto'>
					{results.slice(0, 15).map((result) => (
						<button
							className={`${
								result.id === selectedUser?.id ? "bg-gray-500" : "hover:bg-gray-600"
							} mx-4 my-2 flex w-fit min-w-[8rem] flex-col items-center rounded-md border border-gray-400 p-2 transition-transform hover:cursor-pointer active:scale-110 active:bg-gray-500`}
							key={result.id}
							onClick={() => {
								setSelectedUser(result);
								setShowSearchSection(false);
							}}
						>
							<div className='relative h-16 w-16 overflow-hidden rounded-full border'>
								<Image
									src={`${CDN}${result.avatar}`}
									alt={result.username}
									fill={true}
									quality={80}
									className='object-cover'
									sizes='33vw'
								/>
							</div>
							<span className='mt-2 font-semibold text-gray-300'>{result.username}</span>
						</button>
					))}
					{results.length === 0 && (
						<div className='m-2 w-1/3 rounded-md border p-2'>No results</div>
					)}
				</div>
			)}
		</div>
	);
};
export default UserSearch;
