import { useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "context/UserContext";
import CoolButton from "./CoolButton";
import sortBy from "lodash/sortBy";
import remove from "lodash/remove";
import findIndex from "lodash/findIndex";

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
						minOffer: offerEnabled ? minOffer : null,
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
				}
			} catch (err) {
				console.log(err.response.data);
				toast.error(err.response.data.error, {
					toastId: err.response.data.errorCode,
				});
				// alert(err.response.data.error);
				setLoading(false);
			}
		});
		updateLocal();
	};

	const open = async () => {
		setLoading(true);
		selected.forEach(async (packId, index) => {
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
				} else {
					console.log(data);
					alert(data);
				}
			} catch (err) {
				console.log(err.response.data);
				toast.error(err.response.data.error, {
					toastId: err.response.data.errorCode,
				});
			}
		});
		setLoading(false);
		updateLocal();
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
								min={1}
								max={200000}
								onChange={(e) =>
									setPrice(e.target.value.replace(/^0+(?=\d)/, "").replace(/\D/g, ""))
								} // remove leading zeros and non-numeric characters
								onFocus={(e) => e.target.select()}
								/*step={0.01}
							min={0.5}*/
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
								name='minOffer'
								id='minOffer'
								value={minOffer}
								disabled={!offerEnabled}
								className='input-field w-28 disabled:cursor-not-allowed'
								min={1}
								max={price - 1}
								onChange={(e) => setMinOffer(e.target.value.replace(/^0+(?=\d)/, ""))} // remove leading zeros and non-numeric characters
								onBlur={(e) => {
									if (Number(e.target.value) > Number(price)) {
										console.log("bigger than price");
										setMinOffer(price - 1);
									}
								}}
								onFocus={(e) => e.target.select()}
								/*step={0.01}
								min={0.5}*/
							/>

							<button
								onClick={list}
								className='big-button mt-2 disabled:cursor-not-allowed disabled:opacity-50'
								disabled={loading}
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
							Open all Packs
						</button>
						{/* <div className='text-gray-300'>
							{loading ? (
								<div className='h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-gray-700'></div>
							) : (
								"Open all Packs"
							)}
						</div> */}
					</div>
					<div className='m-2 flex flex-1 flex-col overflow-auto'>
						{openedCards.length > 0 && (
							<div className='my-4 w-full overflow-auto border border-gray-500 px-2 text-gray-300'>
								{sortBy(openedCards, ["mintBatch", "mintNumber"]).map((card) => (
									<div key={card.uuid} className='flex'>
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
