import { useEffect, useState } from "react";
import axios from "axios";

const ListingModal = ({ selectedCards, setShowListingModal, user }) => {
	// console.log(selectedCards);
	const [loading, setLoading] = useState(false);
	const [cardDetailes, setCardDetails] = useState([]);
	useEffect(() => {
		setCardDetails([]);
		for (const card of selectedCards) {
			const fetchData = async () => {
				const data = await getCardTemplates(
					user.user.id,
					card.id,
					card.cardType ? "card" : "sticker"
				);
				if (data.success) setCardDetails((prev) => [...prev, ...data.data]);
				console.log(data);
			};
			fetchData();
		}
	}, []);

	const getCardTemplates = async (userId, templateId, type) => {
		const { data } = await axios.get(`/api/collections/users/${userId}/card-templates`, {
			params: {
				templateId: templateId,
				type: type,
			},
			headers: {
				jwt: user.jwt,
			},
		});
		return data;
	};

	return (
		<div className='fixed inset-0 z-20 flex flex-col items-center justify-center overscroll-none bg-black/90'>
			<div className='absolute inset-0 z-20 my-auto mx-8 flex h-fit max-h-[80vh] flex-col overflow-hidden overscroll-none rounded-md bg-gray-900 sm:mx-24'>
				<div
					className='relative flex h-12 w-full items-center border-b border-b-white/10 bg-gray-800' /*modal header*/
				>
					<h1
						className='mx-auto py-2 text-3xl text-gray-200'
						onClick={() => console.log(cardDetailes)}
					>
						List items
					</h1>
					<button
						className='absolute right-0 top-0 h-12 w-12 p-1 text-gray-300 transition-colors duration-300 hover:cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300 active:bg-indigo-300 active:text-orange-400'
						onClick={() => {
							setShowListingModal(false);
						}}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							strokeWidth={2}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>
				<div className='border'>
					{cardDetailes.map((card) => (
						<div key={card.uuid}>
							{card.mintBatch}
							{card.mintNumber}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
export default ListingModal;
