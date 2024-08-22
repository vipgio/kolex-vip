import { useEffect, useRef, useState } from "react";

const PackOdds = ({ odds }) => {
	const [isScrollable, setIsScrollable] = useState(false);
	const containerRef = useRef(null);

	useEffect(() => {
		const checkScrollable = () => {
			const container = containerRef.current;
			if (container) {
				// Check if the content height exceeds the container height
				setIsScrollable(container.scrollHeight > container.clientHeight);
			}
		};

		checkScrollable();

		// Add a resize observer to handle window resizing or dynamic content
		const resizeObserver = new ResizeObserver(checkScrollable);
		resizeObserver.observe(containerRef.current);

		// Clean up the observer
		return () => resizeObserver.disconnect();
	}, []);

	return (
		<div
			ref={containerRef}
			className={`max-h-52 divide-y divide-gray-500 overflow-auto py-1 ${
				isScrollable ? "rounded border" : "" // Add border if scrollable
			}`}
		>
			{odds
				.sort((a, b) => b.chance - a.chance)
				.map((odd) => (
					<div className='flex px-1 hover:bg-gray-300 dark:hover:bg-gray-500' key={odd.treatmentId}>
						{odd.name} ({odd.tier})
						<div
							className='ml-auto'
							title={`1 in ${Number(
								(100 / odd.chance).toFixed(2).replace(/0+$/, "").replace(/\.$/, "")
							).toLocaleString()}`}
						>
							{odd.chance}%
						</div>
					</div>
				))}
		</div>
	);
};
export default PackOdds;
