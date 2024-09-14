import React, { useState, useEffect } from "react";
import isEqual from "lodash/isEqual";
import { maxPrice, minPrice } from "@/config/config";
import MintSelectorModal from "./MintSelectorModal";
import fixDecimal from "@/utils/NumberUtils";

const ItemBox = React.memo(
	({ template, insertFloor, setListingDetails }) => {
		const [showMintModal, setShowMintModal] = useState(false);
		const [selectedCards, setSelectedCards] = useState([]);
		const [price, setPrice] = useState("");

		useEffect(() => {
			if (price > 0)
				setListingDetails((prev) => ({
					...prev,
					[template.id]: selectedCards.map((card) => ({
						price: price,
						id: card.id,
						type: card.type,
					})),
				}));
		}, [price, selectedCards]);

		useEffect(() => {
			if (insertFloor && template.floor)
				setPrice(
					fixDecimal(
						(template.floor * 100 - 0.01 * 100) / 100 >= minPrice
							? ((template.floor * 100 - 0.01 * 100) / 100).toString()
							: template.floor.toString()
					)
				);
		}, [insertFloor]);

		return (
			template.cards.length > 0 && (
				<div
					key={template.uuid}
					className='m-1 flex h-56 max-h-56 flex-col justify-between overflow-auto rounded border border-gray-500 p-2 text-gray-800 dark:text-gray-200'
				>
					<div className='text-center font-semibold text-orange-500'>
						{template.title} <span className='text-xs'>x</span>
						<span className='text-base'>{template.cards.length}</span>
					</div>
					<div className='my-auto flex flex-col'>
						<div className='flex items-center'>
							<span className='mr-1'>Floor price:</span>
							<span>{template.floor ? `$${template.floor}` : "-"}</span>
						</div>
						<div>
							<label htmlFor='price'>Price: </label>
							<input
								type='number'
								name='price'
								id='price'
								min={minPrice}
								step={0.01}
								max={maxPrice}
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								className='input-field mt-1'
							/>
						</div>
						<div>
							<label htmlFor='count'>Count: </label>
							<input
								type='number'
								name='count'
								id='count'
								min={0}
								max={template.count}
								value={selectedCards.length || ""}
								onChange={(e) =>
									setSelectedCards(
										template.cards
											.toReversed()
											.slice(0, e.target.value)
											.map((card) => ({ id: card.id, type: card.type }))
									)
								}
								className='input-field my-2'
							/>
						</div>
					</div>
					<button className='submit-button mt-auto w-32' onClick={() => setShowMintModal(true)}>
						Mint details
					</button>
					<div>
						{showMintModal && (
							<MintSelectorModal
								data={template}
								isOpen={showMintModal}
								setIsOpen={setShowMintModal}
								selectedCards={selectedCards}
								setSelectedCards={setSelectedCards}
							/>
						)}
					</div>
				</div>
			)
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
ItemBox.displayName = "ItemBox";
export default ItemBox;
