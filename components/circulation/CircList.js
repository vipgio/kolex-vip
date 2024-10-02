import { useMemo, useState } from "react";
import GridComp from "./GridComp";

const CircList = ({ data, prices }) => {
	const opened = data.reduce((cur, acc) => cur + acc.inCirculation, 0);
	const minted =
		data.reduce((cur, acc) => cur + (acc.minted || 0), 0) ||
		data.reduce((cur, acc) => cur + (acc.mintCount || 0), 0);
	const setValue = prices.reduce((cur, acc) => (acc.lowestPrice ? cur + Number(acc.lowestPrice) : cur), 0);

	const [columnDefs, setColumnDefs] = useState([
		{
			headerName: "Title",
			field: "title",
			filter: "agTextColumnFilter",
			width: "100%",
			wrapText: true,
		},
		{
			headerName: "Circulation",
			field: "inCirculation",
			filter: "agNumberColumnFilter",
			width: "20%",
		},
		{
			headerName: "Edition of",
			valueGetter: (p) => p.data.minted || p.data.mintCount || "-",
			filter: "agNumberColumnFilter",
			width: "20%",
		},
		{
			headerName: "Floor",
			valueGetter: (p) => {
				const price = prices.find((price) => price.entityTemplateId === p.data.templateId);
				return price ? Number(price.lowestPrice) : null; // Return numeric value or null for filtering
			},
			valueFormatter: (params) => {
				const value = params.value;
				return value !== null && value !== undefined ? `$${value}` : `-`; // Format for display
			},
			filter: "agNumberColumnFilter",
			filterParams: {
				comparator: (filterValue, cellValue) => {
					if (cellValue === null || cellValue === undefined || cellValue === "-") {
						return 1; // Treat blank or non-numeric values as greater than any number
					}
					return cellValue - filterValue; // Standard number comparison
				},
			},
			width: "10%",
		},
	]);

	const [rowData, setRowData] = useState(data.sort((a, b) => a.inCirculation - b.inCirculation));

	const defaultColDef = useMemo(() => ({
		// flex: 1,
		suppressMovable: true,
		resizable: false,
		suppressMovable: true,
		filterParams: {
			buttons: ["reset"],
		},
		initialWidth: 200, // Optional: Set a default size
		autoHeight: true, // Adjust Cell Height to Fit Wrapped Text
	}));
	const gridOptions = {
		columnDefs: columnDefs,
		defaultColDef: defaultColDef,
		rowData: rowData,
		onGridReady: (event) => event.api.sizeColumnsToFit(),
		suppressCellFocus: true,
		enableCellTextSelection: true,
	};

	return (
		<div className='mb-5 flex justify-center px-2 md:w-5/6'>
			<div className='grid w-full divide-y divide-primary-500 overflow-hidden rounded border border-primary-500 md:w-2/3'>
				<div className='text-gray-custom flex justify-around p-1 text-center font-semibold'>
					<div>
						<>
							Total Circulation:{" "}
							<span>
								{opened}{" "}
								<span className='text-primary-500'>
									{minted > 0 ? `(${((opened / minted) * 100).toFixed(2)}%)` : null}
								</span>
							</span>
						</>
						<>{minted > 0 ? <div>Total Minted: {minted}</div> : null}</>
					</div>
					<div>
						<div>
							Set market total: <span className='text-primary-500'> ${setValue.toFixed(2)}</span>
						</div>
						<>
							Total items: <span className='text-primary-500'> {data.length}</span>
						</>
					</div>
				</div>
				<div>
					<GridComp gridOptions={gridOptions} />
				</div>
			</div>
		</div>
	);
};
export default CircList;
