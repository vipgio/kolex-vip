import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const GridComp = ({ gridOptions }) => {
	return (
		<div className='ag-theme-quartz ag-custom-quartz' style={{ height: "500px" }}>
			<AgGridReact gridOptions={gridOptions} />
		</div>
	);
};

export default GridComp;
