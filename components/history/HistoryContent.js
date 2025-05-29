import { Fragment } from "react";

import { historyEvents } from "@/config/config";

const getDate = (event) => event.created.replace("T", " ").split(".")[0];

const HistoryContent = ({ item }) => {
	return item.history.toReversed().map((event) => (
		<Fragment key={`${item.id}-${event.created}`}>
			{event.type === "mint" && <div>Minted on {getDate(event)}</div>}
			{event.type in historyEvents && (
				<div>
					<p>
						<span className='font-medium text-green-600 dark:text-green-400'>
							{event.receiver?.username || event.sender?.username || "?"}{" "}
						</span>
						{historyEvents[event.type](event)}{" "}
						<span className='block text-gray-500'>{getDate(event)}</span>
					</p>
				</div>
			)}
		</Fragment>
	));
};
export default HistoryContent;
