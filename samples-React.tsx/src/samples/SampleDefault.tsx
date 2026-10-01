import { useEffect, useId, useRef } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import axios from 'axios';
import ExportGridDataView from './ExportGridDataView';

const PUBLIC_URL = process.env.PUBLIC_URL;

const numericEditRenderer: IGrid.Column['editRenderer'] = {
	type: IGrid.EditRendererKind.InputEditRenderer,
	onlyNumeric: true,
	textAlign: 'right',
	autoThousandSeparator: true
};

const columnLayout: IGrid.Column[] = [
	{ dataField: 'id', headerText: 'ID', width: 120 },
	{ dataField: 'name', headerText: 'Name', width: 140 },
	{ dataField: 'country', headerText: 'Country', width: 140 },
	{
		dataField: 'flag',
		headerText: 'Flag IMG',
		editable: false,
		prefix: PUBLIC_URL + '/assets/',
		renderer: { type: IGrid.RendererKind.ImageRenderer, imgHeight: 24, altField: 'country' },
		width: 100
	},
	{ dataField: 'product', headerText: 'Product', width: 140 },
	{ dataField: 'color', headerText: 'Color', width: 100 },
	{ dataField: 'price', headerText: 'Price', dataType: 'numeric', style: 'my-column', width: 120, editRenderer: numericEditRenderer },
	{ dataField: 'quantity', headerText: 'Quantity', dataType: 'numeric', style: 'my-column', width: 100, editRenderer: numericEditRenderer },
	{
		dataField: 'date',
		headerText: 'Date',
		dataType: 'date',
		dateInputFormat: 'yyyy-mm-dd',
		formatString: 'yyyy. mm. dd.',
		editRenderer: {
			type: IGrid.EditRendererKind.CalendarRenderer,
			defaultFormat: 'yyyy-mm-dd',
			showEditorBtnOver: true,
			showConfirmBtn: true
		}
	}
];

const gridProps: IGrid.Props = {
	width: '100%',
	height: 480,
	editable: true,
	enableCellMerge: true,
	enterKeyColumnBase: true,
	selectionMode: 'multipleCells',
	useContextMenu: true,
	enableFilter: true,
	displayTreeOpen: true,
	noDataMessage: '출력할 데이터가 없습니다.',
	groupingMessage: '여기에 칼럼을 드래그하면 그룹핑이 됩니다.'
};

const SampleDefault = () => {
	const myGrid = useRef<AUIGrid>(null);
	const uid = useId();

	useEffect(() => {
		const grid = myGrid.current as AUIGrid;

		grid.bind(IGrid.EventKind.SelectionChange, (event: IGrid.SelectionChangeEvent) => {
			console.log(event);
		});

		grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
			console.log(event);
		});

		grid.bind([IGrid.EventKind.CellClick, IGrid.EventKind.HeaderClick], (event: IGrid.CellClickEvent | IGrid.HeaderClickEvent) => {
			switch (event.type) {
				case IGrid.EventKind.CellClick:
					console.log((event as IGrid.CellClickEvent).value);
					break;
				case IGrid.EventKind.HeaderClick:
					console.log(event.headerText);
					break;
			}
		});

		grid.bind(IGrid.EventKind.CellDoubleClick, (event: IGrid.CellDoubleClickEvent) => {
			console.log(event);
		});

		grid.showAjaxLoader();
		axios.get('./data/normal_100.json').then((result) => {
			grid.setGridData(result.data);
			grid.removeAjaxLoader();
		});
	}, []);

	return (
		<div>
			<div className="desc">
				<ExportGridDataView myGrid={myGrid} />
			</div>
			<AUIGrid ref={myGrid} name={uid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default SampleDefault;
