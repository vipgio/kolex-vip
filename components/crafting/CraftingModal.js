import React, { useEffect, useContext, useState, useRef } from "react";
import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
import isEqual from "lodash/isEqual";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
import { toast, ToastContainer } from "react-toastify";
import { UserContext } from "context/UserContext";
import CraftResultModal from "./CraftResultModal";
import BigModal from "../BigModal";
import "react-toastify/dist/ReactToastify.css";

const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

const CraftingModal = React.memo(
	({ showModal, setShowModal, plan }) => {
		const { user, categoryId } = useContext(UserContext);
		const totalCards = useRef(0);
		const [loading, setLoading] = useState(true);
		const [dupeOnly, setDupeOnly] = useState("dupe");
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
			const min = Number(target.min);
			const max = Number(target.max);
			const value = Number(target.value);
			if (value > max) {
				setCraftCount(max);
			} else if (value < min) {
				setCraftCount(min);
			} else {
				setCraftCount(value);
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
				const cards = data.data.cards.map((card) => {
					const item = templates.data?.find((o) => o.id === card.cardTemplateId);
					return {
						...card,
						title: item ? item.title : "Something, but kolex is buggy so can't find the card",
					};
				});
				setCraftResult((prev) => [...prev, ...cards]);
			} else {
				toast.error(`There was an error with your request. Opening the slot: ${id}`, {
					toastId: "error",
				});
			}
		};

		const doCraft = async () => {
			setCraftResult([]);
			setLoading(true);
			setShowResult(true);
			for (let i = 0; i < craftCount; i++) {
				try {
					const payload = {
						silvercoins: plan.silvercoinCost,
						requirements: dataToShow.map((req) => ({
							requirementId: req.id,
							entityIds: req.items.slice(i * req.count, (i + 1) * req.count).map((item) => item.id),
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
						// open the full slot
						await openSlot(data.data.slots.filter((slot) => slot.used)[0].id);
					} else {
						toast.error(`There was an error with your request. Crafting: ${plan.id}`, {
							toastId: "error",
						});
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

					for (const collection of data.data.cardTemplatesByCollection) {
						if (collection.collection.id === 11518) {
							continue;
							// ignore the duplicate collection for now
						}
						for (const template of collection.cardTemplates) {
							if (isApiSubscribed) {
								if (template.userCount) {
									totalCards.current += template.userCount;
									// foundAny = true;
									try {
										const { data: cards } = await http(
											`${API}/crafting/user-cards/${template.id}?categoryId=${categoryId}`,
											{
												method: "GET",
												headers: {
													"Content-Type": "application/json",
													"x-user-jwt": user.jwt,
												},
											}
										);
										// console.log(cards);
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
						}
					}
					// if (!foundAny) setLoading(false);
				};

				for (const item of plan.requirements) {
					await getCounts(item.id);
				}

				setLoading(false);
			};
			setup();
			return () => {
				controller.abort();
				isApiSubscribed = false;
			};
		}, []);

		useEffect(() => {
			setCraftCount(0);
		}, [dupeOnly]);

		const dataToShow =
			dupeOnly === "dupe"
				? ownedCards.map((req) => ({
						...req,
						items: uniqBy(req.items, "id")
							.slice()
							.reverse()
							.filter(
								// don't show the best set
								(item, index, self) => index !== self.findIndex((t) => t.templateId === item.templateId)
							)
							.slice()
							.reverse(),
				  }))
				: uniqBy(ownedCards, "id");

		// useEffect(() => {
		// 	if (ownedCards[0]) {
		// 		const owned = ownedCards.reduce((total, req) => total + req.items.length, 0);
		// if (owned === totalCards.current && owned > 0) setLoading(false);
		// 	}
		// }, [ownedCards]);

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
				<>
					<BigModal
						header={plan.name}
						loading={loading}
						showModal={showModal}
						setShowModal={setShowModal}
						extraStyle='h-fit my-auto'
					>
						<div className='h-fit max-h-96 overflow-auto rounded p-2 text-gray-800 dark:text-gray-300'>
							{dataToShow.map((requirement) => (
								<div key={requirement.id} className='text-gray-800 dark:text-gray-300'>
									You own {requirement.items.length} available items from {requirement.count}{" "}
									{requirement.name} items needed for this craft.
								</div>
							))}
							<>
								Total crafts possible:{" "}
								<span className='text-orange-500' onClick={() => console.log(ownedCards)}>
									{Math.min(
										...dataToShow.map((requirement) =>
											Math.floor(requirement.items.length / requirement.count)
										)
									)}
								</span>
							</>
							<div className='mt-1 flex flex-col border-t border-gray-800 pt-2 dark:border-gray-300'>
								<div className='flex items-center'>
									<div>
										<label htmlFor='craftCount' className='mr-1'>
											Number of crafts to do:{" "}
										</label>
										<input
											type='number'
											name='craftCount'
											id='craftCount'
											min={0}
											max={Math.min(
												...dataToShow.map((requirement) =>
													Math.floor(requirement.items.length / requirement.count)
												)
											)}
											disabled={loading}
											value={craftCount}
											onChange={(e) => handleCount(e.target)}
											className='input-field'
										/>
									</div>
									<div className='ml-5 flex flex-col'>
										<div className='flex'>
											<label htmlFor='dupe' className='mr-1 hover:cursor-pointer'>
												Only use dupe items
											</label>
											<input
												type='radio'
												name='dupe'
												id='dupe'
												checked={dupeOnly === "dupe"}
												onChange={(e) => setDupeOnly(e.target.id)}
												className='hover:cursor-pointer'
											/>
										</div>
										<div className='flex'>
											<label htmlFor='any' className='mr-1 hover:cursor-pointer'>
												Use any worst mint
											</label>
											<input
												type='radio'
												name='dupe'
												id='any'
												checked={dupeOnly === "any"}
												onChange={(e) => setDupeOnly(e.target.id)}
												className='hover:cursor-pointer'
											/>
										</div>
									</div>
								</div>
								<div className='mt-2 flex items-center border-t border-gray-800 pt-2 dark:border-gray-300'>
									<div>Crafting recipe mint range:</div>
									{dataToShow.length > 0 && dataToShow[0].items.length > 0 && (
										<div className='my-1 ml-1 mr-5 flex flex-col divide-y divide-gray-700 dark:divide-gray-500'>
											{craftCount > 0 &&
												dataToShow.map((req) => {
													const best = req.items
														.slice(0, craftCount * req.count)
														.slice(-1)
														.pop();
													return (
														<div key={req.id} className=''>
															{req.name}: {req.items[0].mintBatch}
															{req.items[0].mintNumber}
															{" - "}
															<span
																className={`${
																	best.mintBatch === "A" && best.mintNumber < 200 ? "text-red-500" : ""
																}`}
																title={
																	best.mintBatch === "A" && best.mintNumber < 200 ? "SUB 200, BE CAREFUL" : ""
																}
															>
																{best.mintBatch}
																{best.mintNumber}
															</span>
														</div>
													);
												})}
										</div>
									)}

									<button className='button ml-auto mt-auto' onClick={doCraft} disabled={craftCount === 0}>
										Craft
									</button>
								</div>
							</div>
						</div>
					</BigModal>
					{showResult && (
						<CraftResultModal
							data={craftResult}
							showResult={showResult}
							setShowResult={setShowResult}
							craftCount={craftCount}
							loading={loading}
						/>
					)}
				</>
			</>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
CraftingModal.displayName = "CraftingModal";
export default CraftingModal;
