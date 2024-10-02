import { useState } from "react";
import { toast } from "react-toastify";
import sortBy from "lodash/sortBy";
import remove from "lodash/remove";
import findIndex from "lodash/findIndex";
import uniq from "lodash/uniq";
import "react-toastify/dist/ReactToastify.css";
import { maxPrice, minPrice } from "@/config/config";
import { useAxios } from "@/hooks/useAxios";
import CoolButton from "./CoolButton";
import LoadingSpin from "../LoadingSpin";
import fixDecimal from "@/utils/NumberUtils";

const ModalPage2 = ({ selected, setSelected, packTemplate, action, setAction }) => {
	const { fetchData, postData } = useAxios();
	const [loading, setLoading] = useState(false);
	const [price, setPrice] = useState(0);
	const [minOffer, setMinOffer] = useState(0);
	const [offerEnabled, setOfferEnabled] = useState(false);
	const [openedCards, setOpenedCards] = useState([]);
	const [openedPacksCount, setOpenedPacksCount] = useState([0, selected.length]);

	const updateLocal = () => {
		const allLocalPacks = JSON.parse(localStorage.getItem("userPacks"));
		const localPacks = allLocalPacks.find(
			(o) => o.categoryId === packTemplate.categoryId.toString()
		).packTemplates;
		remove(packTemplate.packs, (o) => selected.includes(o.id));
		const idx = findIndex(localPacks, (o) => o.id === packTemplate.id);
		localPacks[idx] = packTemplate;

		const categoryPacks = { packTemplates: localPacks, categoryId: packTemplate.categoryId.toString() };
		const newLocalPacks = allLocalPacks.filter((o) => o.categoryId !== packTemplate.categoryId.toString());
		newLocalPacks.push(categoryPacks);
		localStorage.setItem("userPacks", JSON.stringify(newLocalPacks));
		// localPacks.push(categoryPacks); // Add the new category
		setSelected([]);
	};

	const list = async (e) => {
		e.preventDefault();
		setLoading(true);
		let counter = 0;
		for (const packId of selected) {
			const payload = {
				price: price,
				minOffer: offerEnabled ? minOffer.toString() : null,
				type: "pack",
			};
			const { result, error } = await postData(`/api/market/list/${packId}`, payload);
			if (result) {
				updateLocal();
				counter++;
				toast.isActive("success")
					? toast.update("success", {
							render: `Listed ${counter}x ${packTemplate.name} ${
								counter === 1 ? "pack" : "packs"
							} on the market for $${price}!`,
					  })
					: toast.success(
							`Listed ${counter}x ${packTemplate.name} ${
								counter === 1 ? "pack" : "packs"
							} on the market for $${price}!`,
							{
								toastId: "success",
							}
					  );
			}
			if (error) {
				toast.error(error.response.data.error, {
					toastId: error.response.data.errorCode,
				});
				setLoading(false);
			}
		}
		setLoading(false);
	};

	const open = async () => {
		setLoading(true);
		for (const packId of selected) {
			const { result, error } = await postData(`/api/pack/open/${packId}`);
			if (result) {
				if (result.cards.length > 0) {
					const { result: templates, error } = await fetchData(`/api/cards/templates`, {
						cardIds: uniq(result.cards.map((card) => card.cardTemplateId)).toString(),
					});
					const cards = result.cards.map((card) => ({
						...card,
						title: templates.find((o) => o.id === card.cardTemplateId).title,
					}));
					setOpenedCards((prev) => [...prev, ...cards, ...result.stickers]);
				} else {
					setOpenedCards((prev) => [...prev, ...result.stickers]);
				}
				setOpenedPacksCount((prev) => [prev[0] + 1, prev[1]]);
				updateLocal();
			}
			if (error) {
				toast.error(error.response.data.error, {
					toastId: error.response.data.errorCode,
				});
			}
		}
		setLoading(false);
	};

	return (
		<>
			{selected.length > 0 && (
				<div className='text-gray-custom mt-3 flex items-center justify-center text-xl font-semibold'>
					x{selected.length} {selected.length > 1 ? "Packs" : "Pack"} selected from {packTemplate.name}
				</div>
			)}
			<div className='mt-4'>
				<CoolButton action={action} setAction={setAction} />
			</div>
			{action === "list" ? (
				<div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							list();
						}}
						className='flex flex-col items-center justify-center'
					>
						<label htmlFor='price' className='text-gray-custom'>
							Price:
						</label>
						<input
							type='number'
							name='price'
							id='price'
							value={price}
							className='input-field w-28'
							min={minPrice}
							step={0.01}
							max={maxPrice}
							onChange={(e) => setPrice(e.target.value)} // remove leading zeros and non-numeric characters
							onFocus={(e) => e.target.select()}
						/>
						<div className='flex items-center justify-center'>
							<label htmlFor='minOffer' className='text-gray-custom'>
								Min Offer:
							</label>
							<input
								type='checkbox'
								name='minOffer'
								id='minOffer'
								className='checkbox ml-2'
								onChange={(e) => setOfferEnabled(e.target.checked)}
							/>
						</div>
						<input
							type='number'
							name='minOfferPrice'
							id='minOfferPrice'
							value={minOffer}
							disabled={!offerEnabled}
							className='input-field w-28'
							min={0.1}
							max={Math.max(fixDecimal(price - 0.01), 0.1)}
							onChange={(e) => setMinOffer(e.target.value)}
							// onBlur={(e) => {
							// 	if (Number(e.target.value) >= Number(price)) {
							// 		setMinOffer(fixDecimal((price * 100 - 0.01 * 100) / 100));
							// 	}
							// }}
							onFocus={(e) => e.target.select()}
							step={0.01}
						/>

						<button onClick={list} className='submit-button mt-2' disabled={loading || selected.length === 0}>
							{loading ? <LoadingSpin /> : "List"}
						</button>
					</form>
				</div>
			) : (
				<>
					<div className='flex flex-col items-center justify-center'>
						<button className='submit-button mt-6' onClick={open} disabled={loading || selected.length === 0}>
							{loading ? <LoadingSpin /> : "Open selected Packs"}
						</button>
						<div className='mt-1 text-gray-300'>
							{openedPacksCount[0]} / {openedPacksCount[1]} Packs opened
						</div>
					</div>
					<div className='m-2 flex flex-1 flex-col overflow-auto'>
						{openedCards.length > 0 && (
							<div className='text-gray-custom my-4 w-full overflow-auto border border-gray-500 px-2 py-1'>
								{sortBy(openedCards, ["mintBatch", "mintNumber"]).map((card) => (
									<div className='flex' key={card.uuid}>
										<span className='mr-2 text-primary-400'>
											{card.mintBatch}
											{card.mintNumber}
										</span>
										<span>{card.title ? card.title : card.stickerTemplate.title}</span>
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
