import { useState, useEffect } from "react";
import Dialog from "HOC/Dialog";
import Tooltip from "../Tooltip";
import { EditIcon } from "@/components/Icons";

const SpinnerLimit = ({ info, funds, limit, setLimit, spinActive }) => {
	const [isOpen, setIsOpen] = useState(false);
	const defMax = 500; //default max spins

	const closeModal = () => {
		setLimit((prev) => ({ ...prev, isSet: true }));
		setIsOpen(false);
	};
	const openModal = () => setIsOpen(true);

	const handleChange = (e) => {
		if (e.target.value === "spins") setLimit((prev) => ({ ...prev, type: "spins", value: defMax }));
		else if (e.target.value === "fund")
			setLimit((prev) => ({ ...prev, type: "fund", value: funds[info.costType] }));
		else
			setLimit((prev) => ({
				...prev,
				type: "target",
				value: { item: info.items[0].id.toString(), count: 1 },
			}));
	};

	return (
		<>
			{limit.isSet ? (
				<div className='text-gray-custom mr-3 flex items-center gap-2'>
					<div className='flex items-center rounded border border-gray-500/80 p-1'>
						Limit:
						<div className='ml-2 flex flex-col text-sm'>
							<span className='text-center'>
								{limit.type === "fund" &&
									limit.value.toLocaleString() + " " + info.costType[0].toUpperCase() + info.costType.slice(1)}
								{limit.type === "spins" && limit.value.toLocaleString() + " spins"}
								{limit.type === "target" &&
									limit.value.count.toLocaleString() +
										"x " +
										info.items.find((item) => item.id.toString() === limit.value.item)?.name}
							</span>
						</div>
					</div>
					<button
						title={spinActive ? "Cannot edit while spinning" : "Edit limit"}
						onClick={() => setIsOpen(true)}
						disabled={spinActive}
					>
						<EditIcon size={14} />
					</button>
				</div>
			) : (
				<button className='button mr-3 !py-1 !px-2' onClick={openModal}>
					Set limit
				</button>
			)}
			<Dialog title='Limit' isOpen={isOpen} setIsOpen={setIsOpen} closeFunction={closeModal}>
				<div className='mb-3 flex items-center'>
					<label htmlFor='type'>Type: </label>
					<select
						id='type'
						className='input-field mb-2 ml-1 w-24 p-0 sm:mb-0'
						onChange={handleChange}
						value={limit.type}
					>
						<option value='spins'>Spins</option>
						<option value='fund'>Fund</option>
						<option value='target'>Target</option>
					</select>
					<Tooltip
						direction='right'
						text={
							limit.type === "spins"
								? "Spins for a certain amount of times."
								: limit.type === "fund"
								? "Spins until you reach a certain amount of funds."
								: "Spins until you get the selected item for x times."
						}
					/>
				</div>
				{limit.type === "spins" ? (
					<SpinLimit info={info} limit={limit} setLimit={setLimit} defMax={defMax} />
				) : limit.type === "fund" ? (
					<FundLimit info={info} funds={funds} limit={limit} setLimit={setLimit} />
				) : (
					<TargetLimit info={info} setLimit={setLimit} limit={limit} />
				)}
				<div className='mt-4 flex'>
					<button
						type='button'
						className='button ml-auto'
						onClick={() => {
							setLimit((prev) => ({ ...prev, isSet: true }));
							closeModal();
						}}
					>
						Save
					</button>
				</div>
			</Dialog>
		</>
	);
};
export default SpinnerLimit;

const SpinLimit = ({ info, defMax, limit, setLimit }) => {
	useEffect(() => {
		setLimit((prev) => {
			if (prev.type !== "spins") {
				return { ...prev, type: "spins", value: defMax };
			}
			return { ...prev, value: prev.value };
		});
	}, []);

	const costPerSpin =
		1000 -
		info.items.reduce((prev, curr) => prev + (Number(curr.chance) / 100) * curr.properties.silvercoins, 0);

	return (
		<div className='flex flex-col gap-3 rounded border border-gray-400/50 p-2'>
			<div className=''>
				<label htmlFor='counter'>Spins: </label>
				<input
					type='number'
					name='counter'
					id='counter'
					min={1}
					max={10000}
					value={limit.value}
					onChange={(e) => setLimit((prev) => ({ ...prev, value: Number(e.target.value) }))}
					className='input-field mr-3 ml-1 w-28'
				/>
			</div>
			<div className='flex items-center gap-2'>
				<div className='w-fit'>
					<Tooltip
						direction='right'
						text='This is an estimate based on the odds, the real number could drastically differ.'
					/>
				</div>
				<div>
					Estimated cost: {Math.ceil(costPerSpin * limit.value).toLocaleString()}{" "}
					{info.costType[0].toUpperCase() + info.costType.slice(1)}
				</div>
			</div>
		</div>
	);
};

const FundLimit = ({ info, funds, limit, setLimit }) => {
	useEffect(() => {
		setLimit((prev) => {
			if (prev.type !== "fund") {
				return { ...prev, type: "fund", value: funds[info.costType] };
			}
			return { ...prev, value: prev.value };
		});
	}, []);

	const costPerSpin =
		1000 -
		info.items.reduce((prev, curr) => prev + (Number(curr.chance) / 100) * curr.properties.silvercoins, 0);
	const spendAmount = funds.silvercoins - limit.value;
	const spins = Math.floor(spendAmount / costPerSpin);

	return (
		<div className='flex flex-col gap-2 rounded border border-gray-400/50 p-2'>
			<div>
				<label htmlFor='fund'>Funds left after spinning: </label>
				<input
					type='number'
					name='fund'
					id='fund'
					min={0}
					max={funds.silvercoins}
					step={1000}
					value={limit.value}
					onChange={(e) => setLimit((prev) => ({ ...prev, value: Number(e.target.value) }))}
					className='input-field mr-3 ml-1 w-28'
				/>
			</div>
			<div className='flex gap-1'>
				<button
					type='button'
					className='simple-button !p-1'
					onClick={() => setLimit((prev) => ({ ...prev, value: funds.silvercoins - 50 * 1000 }))}
				>
					Use 50K
				</button>
				<button
					type='button'
					className='simple-button !p-1'
					onClick={() => setLimit((prev) => ({ ...prev, value: funds.silvercoins - 100 * 1000 }))}
				>
					Use 100K
				</button>
				<button
					type='button'
					className='simple-button !p-1'
					onClick={() => setLimit((prev) => ({ ...prev, value: funds.silvercoins - 200 * 1000 }))}
				>
					Use 200K
				</button>
				<button
					type='button'
					className='simple-button !p-1'
					onClick={() => setLimit((prev) => ({ ...prev, value: funds.silvercoins - 500 * 1000 }))}
				>
					Use 500K
				</button>
				<button
					type='button'
					className='simple-button !p-1'
					onClick={() => setLimit((prev) => ({ ...prev, value: funds.silvercoins - 1000 * 1000 }))}
				>
					Use 1M
				</button>
				<button
					type='button'
					className='simple-button !p-1'
					onClick={() => setLimit((prev) => ({ ...prev, value: 0 }))}
				>
					Use All
				</button>
			</div>
			<div className='flex items-center gap-2'>
				<div className='w-fit'>
					<Tooltip
						direction='right'
						text='This is an estimate based on the odds, the real number could drastically differ.'
					/>
				</div>
				Estimated spins: {spins} spins
			</div>
		</div>
	);
};

const TargetLimit = ({ info, setLimit, limit }) => {
	useEffect(() => {
		setLimit((prev) => {
			if (prev.type !== "target") {
				return { ...prev, type: "target", value: { item: info.items[0].id.toString(), count: 1 } };
			}
			return { ...prev, value: prev.value };
		});
	}, []);

	const costPerSpin =
		1000 -
		info.items.reduce((prev, curr) => prev + (Number(curr.chance) / 100) * curr.properties.silvercoins, 0);

	return (
		<div className='flex flex-col gap-3 rounded border border-gray-400/50 p-2'>
			<div className=''>
				<label htmlFor='item'>Target item: </label>
				<select
					id='item'
					className='input-field mr-3 w-48'
					onChange={(e) =>
						setLimit((prev) => ({ ...prev, value: { item: e.target.value, count: prev.value.count } }))
					}
					value={limit.value.item || ""}
				>
					{info.items.map((item) => (
						<option value={item.id} key={item.id}>
							{item.name}
						</option>
					))}
				</select>
			</div>
			<div>
				<label htmlFor='count'>Number of wins: </label>
				<input
					type='number'
					name='count'
					id='count'
					className='input-field ml-1 w-28'
					min={1}
					max={10000}
					value={limit.value.count || 1}
					onChange={(e) =>
						setLimit((prev) => ({
							...prev,
							value: { item: prev.value.item, count: Math.max(1, Number(e.target.value)) }, //prevent zero value
						}))
					}
				/>{" "}
				times
			</div>
			<div className='flex items-center gap-2'>
				<div className='w-fit'>
					<Tooltip
						direction='right'
						text='This is an estimate based on the odds, the real number could drastically differ.'
					/>
				</div>
				<div>
					Estimated spins:{" "}
					<span className='font-semibold'>
						{Math.ceil(
							(100 / info?.items.find((item) => item.id.toString() === limit.value.item)?.chance) * //get the chance of the selected item
								limit.value.count
						).toLocaleString()}{" "}
					</span>
					spins to win {info.items.find((item) => item.id.toString() === limit.value.item)?.name}{" "}
					{limit.value.count > 1 ? `${limit.value.count} times` : `${limit.value.count} time`}
					<span className='ml-1'>
						(
						{Math.ceil(
							costPerSpin *
								(100 / info?.items.find((item) => item.id.toString() === limit.value.item)?.chance) *
								limit.value.count
						).toLocaleString()}{" "}
						{info.costType[0].toUpperCase() + info.costType.slice(1)})
					</span>
				</div>
			</div>
		</div>
	);
};
