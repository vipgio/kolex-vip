import React, { useEffect, useContext, useState, useRef } from "react";
import axios from "axios";
import isEqual from "lodash/isEqual";
import sortBy from "lodash/sortBy";
import { toast, ToastContainer } from "react-toastify";
import { UserContext } from "context/UserContext";
import LoadingSpin from "../LoadingSpin";
import CraftResultModal from "./CraftResultModal";

const CraftingModal = React.memo(
	({ setShowModal, plan }) => {
		const { user } = useContext(UserContext);
		const totalCards = useRef(0);
		const [loading, setLoading] = useState(true);
		const [craftResult, setCraftResult] = useState([]);
		const [showResult, setShowResult] = useState(false);
		const [craftCount, setCraftCount] = useState(0);
		const [ownedCards, setOwnedCards] = useState(() =>
			plan.requirements.map((requirement) => ({
				id: requirement.id,
				count: requirement.count,
				name: requirement.name,
				cost: plan.silvercoinCost,
				items: [],
			}))
		);

		const handleCount = (target) => {
			if (target.value > target.max) {
				setCraftCount(target.max);
			} else if (target.value < target.min) {
				setCraftCount(target.min);
			} else {
				setCraftCount(target.value);
			}
		};

		const openSlot = async (id) => {
			const { data } = await axios.post(
				`/api/crafting/open-instant`,
				{
					slotId: id,
				},
				{
					headers: {
						jwt: user.jwt,
					},
				}
			);
			if (data.success) {
				const { data: templates } = await axios.get(`/api/cards/templates`, {
					params: {
						cardIds: data.data.cards.map((card) => card.cardTemplateId).toString(),
					},
					headers: {
						jwt: user.jwt,
					},
				});
				const cards = data.data.cards.map((card) => ({
					...card,
					title: templates.data.find((o) => o.id === card.cardTemplateId).title,
				}));
				setCraftResult((prev) => [...prev, ...cards]);
			}
		};

		const doCraft = async () => {
			setLoading(true);
			setShowResult(true);
			for (let i = 0; i < craftCount; i++) {
				try {
					const payload = {
						silvercoins: plan.silvercoinCost,
						requirements: ownedCards.map((req) => ({
							requirementId: req.id,
							entityIds: req.items
								.slice(i * req.count, (i + 1) * req.count)
								.map((item) => item.id),
						})),
					};
					const { data } = await axios.post(
						`/api/crafting/${plan.id}`,
						{
							data: payload,
						},
						{
							headers: {
								jwt: user.jwt,
							},
						}
					);
					if (data.success) {
						//open the full slot
						await openSlot(data.data.slots.filter((slot) => slot.used)[0].id);
					}
				} catch (err) {
					console.log(err);
					toast.error(err.response.data.error, {
						toastId: err.response.data.errorCode,
					});
				}
			}
			setLoading(false);
		};

		useEffect(() => {
			let isApiSubscribed = true;
			const controller = new AbortController();
			const setup = async () => {
				const getCounts = async (reqId) => {
					const { data } = await axios.get(`/api/crafting/user-counts`, {
						signal: controller.signal,
						params: {
							planId: plan.id,
							reqId: reqId,
						},
						headers: {
							jwt: user.jwt,
						},
					});
					let foundAny = false;
					data.data.cardTemplatesByCollection[0].cardTemplates.map(async (template) => {
						if (isApiSubscribed) {
							if (template.userCount) {
								totalCards.current += template.userCount;
								foundAny = true;
							}
							if (template.userCount) {
								try {
									const { data: cards } = await axios.get(`/api/crafting/user-cards`, {
										signal: controller.signal,
										params: {
											templateId: template.id,
										},
										headers: {
											jwt: user.jwt,
										},
									});
									cards.data.cards.map((item) => {
										setOwnedCards((prev) => {
											const oldItems = prev.filter((o) => o.id === reqId)[0];
											return [
												...prev.filter((o) => o.id !== reqId),
												{
													...oldItems,
													items: sortBy(
														[
															...oldItems.items,
															{
																templateId: item.cardTemplateId,
																mintBatch: item.mintBatch,
																mintNumber: item.mintNumber,
																id: item.id,
															},
														],
														["mintBatch", "mintNumber"]
													).reverse(),
												},
											];
										});
									});
								} catch (err) {
									if (err.code !== "ERR_CANCELED") {
										console.log(err);
										toast.error(err.response.data.error, {
											toastId: err.response.data.errorCode,
										});
									}
								}
							}
						}
					});
					if (!foundAny) setLoading(false);
				};
				for await (const item of plan.requirements) {
					getCounts(item.id);
				}
			};
			setup();
			return () => {
				controller.abort();
				isApiSubscribed = false;
			};
		}, []);

		useEffect(() => {
			if (ownedCards[0]) {
				let owned = 0;
				ownedCards.forEach((req) => {
					owned += req.items.length;
				});
				if (owned === totalCards.current && owned > 0) setLoading(false);
			}
		}, [ownedCards]);

		return (
			<div className='fixed inset-0 z-30 flex flex-col items-center justify-center overscroll-none bg-black/90'>
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
				<div className='absolute inset-0 z-20 my-auto mx-8 flex h-fit max-h-[90vh] flex-col overflow-hidden overscroll-none rounded-md bg-gray-200 dark:bg-gray-900 sm:mx-48'>
					<div
						className='relative flex h-12 w-full items-center border-b border-b-white/10 bg-gray-300 dark:bg-gray-800' /*modal header*/
					>
						<h1 className='mx-auto py-2 text-2xl text-gray-800 dark:text-gray-200'>
							{loading ? <LoadingSpin /> : <>{plan.name}</>}
						</h1>
						<button
							className='absolute right-0 top-0 h-12 w-12 p-1 text-gray-900 transition-colors duration-300 hover:cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300 active:bg-indigo-300 active:text-orange-400 dark:text-gray-200 dark:hover:bg-gray-700'
							onClick={() => {
								setShowModal(false);
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
					<div className='h-fit max-h-96 overflow-auto rounded p-2 text-gray-800 dark:text-gray-300'>
						{ownedCards.map((requirement) => (
							<div key={requirement.id} className='text-gray-800 dark:text-gray-300'>
								You own {requirement.items.length} available items from{" "}
								{requirement.count} {requirement.name} items needed for this craft.
							</div>
						))}
						<>
							Total crafts possible:{" "}
							<span className='text-orange-500'>
								{Math.min(
									...ownedCards.map((requirement) =>
										Math.floor(requirement.items.length / requirement.count)
									)
								)}
							</span>
						</>
						<div className='mt-1 flex flex-col border-t border-gray-800 pt-2 dark:border-gray-300'>
							<div className='flex items-center'>
								<label htmlFor='craftCount' className='mr-1'>
									Number of crafts to do:{" "}
								</label>
								<input
									type='number'
									name='craftCount'
									id='craftCount'
									min={0}
									max={Math.min(
										...ownedCards.map((requirement) =>
											Math.floor(requirement.items.length / requirement.count)
										)
									)}
									disabled={loading}
									value={craftCount}
									onChange={(e) => handleCount(e.target)}
									className='input-field'
								/>
							</div>
							<div className='mt-2 flex items-center border-t border-gray-800 pt-2 dark:border-gray-300'>
								<div>Crafting recipe mint range:</div>
								{ownedCards.length > 0 && ownedCards[0].items.length > 0 && (
									<div className='my-1 ml-1 mr-5 flex flex-col divide-y divide-gray-700 dark:divide-gray-500'>
										{craftCount > 0 &&
											ownedCards.map((req) => {
												return (
													<div key={req.id} className=''>
														{req.name}: {req.items[0].mintBatch}
														{req.items[0].mintNumber}
														{" - "}
														{
															req.items
																.slice(0, craftCount * req.count)
																.slice(-1)
																.pop().mintBatch
														}
														{
															req.items
																.slice(0, craftCount * req.count)
																.slice(-1)
																.pop().mintNumber
														}
													</div>
												);
											})}
									</div>
								)}

								<button
									className='button ml-auto mt-auto'
									onClick={doCraft}
									disabled={craftCount == 0}
								>
									Craft
								</button>
							</div>
						</div>
					</div>
					{showResult && (
						<CraftResultModal
							data={craftResult}
							showResult={showResult}
							setShowResult={setShowResult}
							loading={loading}
						/>
					)}
				</div>
			</div>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
CraftingModal.displayName = "CraftingModal";
export default CraftingModal;
