import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import sortBy from "lodash/sortBy";
import isEqual from "lodash/isEqual";
import sumBy from "lodash/sumBy";
import uniqBy from "lodash/uniqBy";
import countBy from "lodash/countBy";
import sortedIndexBy from "lodash/sortedIndexBy";
import { FaLock } from "react-icons/fa";
import { useAxios } from "@/hooks/useAxios";
import ExportToCSV from "@/components/ExportToCSV";
import CompactList from "./CompactList";
import FullList from "./FullList";
import Tooltip from "../Tooltip";
import fixDecimal from "@/utils/NumberUtils";

const ScanResult = React.memo(
	({
		scanResults,
		user,
		collection,
		templates,
		ownedItems,
		isSelfScan,
		singleUserSearch,
		isHistoryAllowed,
	}) => {
		const { fetchData } = useAxios();
		const userList = user
			.map((usr) => usr["username"])
			.join(", ")
			.toString();
		const [filterMethod, setFilterMethod] = useState("all");
		const [leaderboardPoints, setLeaderboardPoints] = useState([]);

		const strippedResults = useMemo(
			() =>
				scanResults.map((result) => {
					const ownedItem = sortBy(ownedItems, ["mintBatch", "mintNumber"]).find(
						(own) => own.templateId === result.templateId
					);
					const ownedRating = ownedItem?.rating || 0;

					const template = templates.find((template) => template.id === result.templateId);

					return {
						...result,
						signatureImage: !!result.signatureImage,
						rating: Number(result.rating),
						title: template?.title || result.title,
						inCirculation: template?.inCirculation || result.inCirculation,
						type: result.type === "card" ? "card" : "sticker",
						delta: !isSelfScan && fixDecimal((result.rating - ownedRating) * 10),
						need: ownedRating === 0,
						minted: result.type === "card" && template?.minted,
					};
				}),
			[scanResults, ownedItems, templates, isSelfScan, fixDecimal]
		);

		const sortedInc = sortBy(strippedResults, ["mintBatch", "mintNumber", (o) => -o.signatureImage]);
		const sorted = useMemo(() => {
			return sortedInc.map((item, index, self) => {
				const firstPosition = self.findIndex((o) => o.templateId === item.templateId);
				if (firstPosition === index) {
					const nextPosition = sortedInc.slice(index + 1).find((o) => o.templateId === item.templateId);
					return {
						...item,
						pointsToLose: nextPosition ? fixDecimal(item.rating - nextPosition.rating) : item.rating,
					};
				} else {
					return {
						...item,
						pointsToLose: 0,
					};
				}
			});
		}, [sortedInc]);

		const filteredResults = useMemo(() => {
			const uniqueByTemplateId = (data) => uniqBy(data, "templateId");
			const removeBest = (data) =>
				data.filter((item, index, self) => index !== self.findIndex((o) => o.templateId === item.templateId));

			switch (filterMethod) {
				case "all":
					return sorted;
				case "best":
					return uniqueByTemplateId(sorted);
				case "worst":
					return uniqueByTemplateId(sorted.toReversed()).toReversed();
				case "dupes":
					return removeBest(sorted);
				case "second":
					const withoutBest = removeBest(sorted);
					return uniqueByTemplateId(withoutBest);
				default:
					// Handle the "compact" case or other filters here
					return sorted.map((item) => ({
						...item,
						owned: countBy(sorted, (o) => o.templateId)[item.templateId],
					}));
			}
		}, [sorted, filterMethod]);

		const getLeaderboard = async (collectionId, page) => {
			const { result, error } = await fetchData(`/api/leaderboard/${collectionId}?page=${page}`);
			if (error) {
				console.error(error);
			}
			return result;
		};

		const getLeaderboardData = async (page = 1) => {
			if (page > 6) return;
			// Get leaderboard data for the current page
			const leaderboardData = await getLeaderboard(collection.collection.id, page);
			setLeaderboardPoints((prev) => [...prev, ...leaderboardData.map((item) => item.score)]);
			await getLeaderboardData(page + 1);
		};

		useEffect(() => {
			setLeaderboardPoints([]);
			getLeaderboardData();
		}, []);

		const handleFilter = (e) => {
			setFilterMethod(e.target.value);
		};

		const rank = useMemo(() => sortedIndexBy(leaderboardPoints, sumBy(filteredResults, "rating"), (o) => -o));

		return (
			<>
				<div className='my-5 overflow-hidden'>
					<div className='flex items-end pb-3'>
						<div className='flex flex-col justify-start sm:flex-row'>
							<label htmlFor='filter' className='text-gray-custom my-1 sm:m-2'>
								Select a filter method:{" "}
							</label>
							<select id='filter' className='dropdown' onChange={handleFilter}>
								<option value='all'>All items</option>
								<option value='best'>Best set</option>
								<option value='dupes'>All duplicates</option>
								<option value='second'>Second set</option>
								<option value='worst'>Worst set</option>
								<option value='compact'>Compact</option>
							</select>
						</div>
						{user && filteredResults.length > 0 && (
							<div className='ml-auto inline-flex gap-4'>
								<div className='flex items-center'>
									{isHistoryAllowed ? (
										<>
											<Tooltip text="Don't use it on like a million cards all at once." direction='left' />
											<Link
												href={{
													pathname: "/history",
													query: {
														href: JSON.stringify(
															filteredResults.filter((item) => item.type === "card").map((item) => item.id)
														),
													},
												}}
												as='/history'
												passHref
											>
												<button className='button' disabled={!isHistoryAllowed}>
													History
												</button>
											</Link>
										</>
									) : (
										<>
											<Tooltip text='You need access to the history feature for this.' direction='left' />
											<button className='button' disabled title='No Access'>
												History
												<FaLock />
											</button>
										</>
									)}
								</div>
								<ExportToCSV
									type={filterMethod === "compact" ? "compact" : "full"}
									filename={`${userList} - ${collection.collection.properties.seasons[0]} - ${
										collection.collection.properties.tiers[0]
									} - ${collection.collection.name} - ${
										filterMethod[0].toUpperCase() + filterMethod.slice(1)
									}`}
									data={filteredResults}
								/>
							</div>
						)}
					</div>

					<>
						{(filterMethod === "best" || filterMethod === "second" || filterMethod === "worst") &&
							filteredResults.length > 0 && (
								<div className='text-gray-custom mb-1 ml-1 font-semibold'>
									<div>Items: {filteredResults.length}</div>
									<div>Total points: {(sumBy(filteredResults, "rating") * 10).toFixed(2)}</div>
									<div>Rank: {rank > 120 ? "120+" : rank}</div>
								</div>
							)}
						<div className='relative mb-1 flex flex-col justify-center overflow-hidden rounded-md border border-gray-300'>
							{filterMethod !== "compact" ? (
								<FullList
									results={filteredResults}
									owner={user}
									isSelfScan={isSelfScan}
									ownedItems={isSelfScan ? ownedItems : uniqBy(ownedItems, "templateId")}
									filterMethod={filterMethod}
									singleUserSearch={singleUserSearch}
								/>
							) : (
								<CompactList results={filteredResults} owner={user} />
							)}
						</div>
					</>
				</div>
			</>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
ScanResult.displayName = "ScanResult";
export default ScanResult;
