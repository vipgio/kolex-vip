import { memo } from "react";

import { webApp } from "@/config/config";

import { HistoryIcon, LockIcon, SignatureIcon } from "@/components/Icons";

const MintResultRow = memo(({ item, allowed, openModal }) => {
	return (
		<tr className='text-gray-custom border-b border-gray-300 bg-gray-100 text-center hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'>
			<td
				className={`table-cell ${item.signatureImage ? "text-yellow-500" : ""}`}
				title={item.signatureImage && "Signed"}
			>
				<div className='flex items-center justify-center'>
					{item.signatureImage && <SignatureIcon className='mr-2' />}
					{item.mintBatch}
					{item.mintNumber}
				</div>
			</td>

			<td className='table-cell min-w-[10rem]'>{item.title}</td>
			<td className='table-cell'>{item.id}</td>
			<td className='table-cell'>{item.delta > 0 ? `+${item.delta}` : 0}</td>

			<td className='table-cell'>
				<a
					target='_blank'
					href={`${webApp}/user/${item.owner.username}`}
					rel='noopener noreferrer'
					className='hover:text-primary-500 hover:underline hover:underline-offset-2'
					title={item.owner.id}
				>
					{item.owner.username}
				</a>
			</td>
			<td className='table-cell'>
				<a
					href={`${webApp}/${item.type}/${item.templateUUID}/${item.uuid}`}
					target='_blank'
					rel='noopener noreferrer'
					className='text-primary-500 underline'
				>
					Click
				</a>
			</td>
			<td className='table-cell'>
				<span className='relative flex h-8 items-center justify-center'>
					{allowed ? (
						<button onClick={() => openModal(item)}>
							<HistoryIcon />
						</button>
					) : (
						<LockIcon
							className='cursor-not-allowed'
							title='You need the "history" access for this feature'
						/>
					)}
				</span>
			</td>
		</tr>
	);
});
MintResultRow.displayName = "MintResultRow";
export default MintResultRow;
