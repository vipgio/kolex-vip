import { useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import sortBy from "lodash/sortBy";
import remove from "lodash/remove";
import findIndex from "lodash/findIndex";
import { UserContext } from "context/UserContext";
import CoolButton from "./CoolButton";
import "react-toastify/dist/ReactToastify.css";

const ModalPage2 = ({ selected, setSelected, packTemplate, action, setAction }) => {
	const { user, setLoading, loading } = useContext(UserContext);
	const [price, setPrice] = useState(0);
	const [minOffer, setMinOffer] = useState(0);
	const [offerEnabled, setOfferEnabled] = useState(false);
	const [openedCards, setOpenedCards] = useState([]);

	const updateLocal = () => {
		const localPacks = JSON.parse(localStorage.getItem("userPacks"));
		remove(packTemplate.packs, (o) => selected.includes(o.id));
		const idx = findIndex(localPacks, (o) => o.id === packTemplate.id);
		localPacks[idx] = packTemplate;
		localStorage.setItem("userPacks", JSON.stringify(localPacks));
		setSelected([]);
	};

	const list = async (e) => {
		e.preventDefault();
		setLoading(true);
		selected.forEach(async (packId) => {
			try {
				const payload = {
					data: {
						price: price,
						minOffer: offerEnabled ? minOffer.toString() : null,
					},
				};
				const headers = {
					headers: {
						jwt: user.jwt,
					},
				};
				const { data } = await axios.post(`/api/market/list/${packId}`, payload, headers);
				setLoading(false);
				if (data.success) {
					toast.success("Listed items on the market!", {
						toastId: "success",
					});
					updateLocal();
				}
			} catch (err) {
				toast.error(err.response.data.error, {
					toastId: err.response.data.errorCode,
				});
				setLoading(false);
			}
		});
	};

	const open = async () => {
		setLoading(true);
		selected.forEach(async (packId) => {
			try {
				const headers = {
					headers: {
						jwt: user.jwt,
					},
				};
				const { data } = await axios.post(`/api/pack/open/${packId}`, null, headers);
				setLoading(false);
				if (data.success) {
					setOpenedCards((prev) => [...prev, ...data.data.cards, ...data.data.stickers]);
					updateLocal();
				}
			} catch (err) {
				toast.error(err.response.data.error, {
					toastId: err.response.data.errorCode,
				});
			}
		});
		setLoading(false);
	};

	return (
		<>
			<ToastContainer
				position='top-right'
				autoClose={3500}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			{selected.length > 0 && (
				<div className='mt-3 flex items-center justify-center text-xl font-semibold text-gray-300'>
					x{selected.length} {selected.length > 1 ? "Packs" : "Pack"} selected from{" "}
					{packTemplate.name}
				</div>
			)}
			<div className='mt-4'>
				<CoolButton action={action} setAction={setAction} />
			</div>
			{action === "list" ? (
				<>
					<div>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								list();
							}}
							className='flex flex-col items-center justify-center'
						>
							<label htmlFor='price' className='text-gray-300'>
								Price:
							</label>
							<input
								type='number'
								name='price'
								id='price'
								value={price}
								className='input-field w-28'
								max={200000}
								onChange={(e) => setPrice(e.target.value)} // remove leading zeros and non-numeric characters
								onFocus={(e) => e.target.select()}
								step={0.01}
								min={0.1}
							/>
							<div className='flex justify-center'>
								<label htmlFor='minOffer' className='text-gray-300'>
									Min Offer:
								</label>
								<input
									type='checkbox'
									name='minOffer'
									id='minOffer'
									className='ml-2'
									onChange={(e) => setOfferEnabled(e.target.checked)}
								/>
							</div>
							<input
								type='number'
								name='minOfferPrice'
								id='minOfferPrice'
								value={minOffer}
								disabled={!offerEnabled}
								className='input-field w-28 disabled:cursor-not-allowed'
								min={0.1}
								max={price - 0.01}
								onChange={(e) => setMinOffer(e.target.value)} // remove leading zeros and non-numeric characters
								onBlur={(e) => {
									if (Number(e.target.value) >= Number(price)) {
										setMinOffer(price - 0.01);
									}
								}}
								onFocus={(e) => e.target.select()}
								step={0.01}
							/>

							<button
								onClick={list}
								className='big-button mt-2 disabled:cursor-not-allowed disabled:opacity-50'
								disabled={loading || selected.length === 0}
							>
								{loading ? (
									<div className='h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-gray-700'></div>
								) : (
									"List"
								)}
							</button>
						</form>
					</div>
				</>
			) : (
				<>
					<div className='flex flex-col items-center justify-center'>
						<button
							className='mt-6 rounded-md border bg-indigo-600 p-2 text-gray-300 enabled:hover:bg-gray-300 enabled:hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50'
							onClick={open}
							disabled={loading || selected.length === 0}
						>
							Open selected Packs
						</button>
					</div>
					<div className='m-2 flex flex-1 flex-col overflow-auto'>
						{openedCards.length > 0 && (
							<div className='my-4 w-full overflow-auto border border-gray-500 px-2 text-gray-300'>
								{sortBy(openedCards, ["mintBatch", "mintNumber"]).map((card) => (
									<div className='flex' key={card.uuid}>
										<span className='text-orange-400'>
											{card.mintBatch}
											{card.mintNumber}
										</span>
										<span className='ml-5'>{card.cardTemplate.title}</span>
									</div>
								))}
							</div>
						)}
					</div>
				</>
			)}
		</>
	);
};
export default ModalPage2;
