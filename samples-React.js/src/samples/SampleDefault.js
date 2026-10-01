import { useEffect, useRef, useId } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
import axios from 'axios';

const PUBLIC_URL = process.env.PUBLIC_URL;

const numericEditRenderer = {
	type: 'InputEditRenderer',
	onlyNumeric: true,
	textAlign: 'right',
	autoThousandSeparator: true
};

const columnLayout = [
	{ dataField: 'id', headerText: 'ID', width: 120 },
	{ dataField: 'name', headerText: 'Name', width: 140 },
	{ dataField: 'country', headerText: 'Country', width: 140 },
	{
		dataField: 'flag',
		headerText: 'Flag IMG',
		editable: false,
		prefix: PUBLIC_URL + '/assets/',
		renderer: { type: 'ImageRenderer', imgHeight: 24, altField: 'country' },
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
		formatString: 'yyyy년 mm월 dd일'
	}
];

const gridProps = {
	width: '100%',
	height: 480,
	editable: true,
	enableCellMerge: true,
	enterKeyColumnBase: true,
	selectionMode: 'multipleCells',
	useContextMenu: true,
	enableFilter: true,
	useGroupingPanel: true,
	showStateColumn: true,
	displayTreeOpen: true,
	noDataMessage: '출력할 데이터가 없습니다.',
	groupingMessage: '여기에 칼럼을 드래그하면 그룹핑이 됩니다.'
};

const SampleDefault = () => {
	const myGrid = useRef();
	const uid = useId();

	useEffect(() => {
		setupGridEvents();
		requestGridData();
	}, []);

	const setupGridEvents = () => {
		const grid = myGrid.current;

		grid.bind(['cellClick', 'selectionChange', 'headerClick'], (event) => {
			console.log(event.type);
		});

		grid.bind(['cellEditBegin', 'cellEditEnd'], (event) => {
			console.log(event.type);
		});
	};

	const requestGridData = () => {
		const grid = myGrid.current;
		grid.showAjaxLoader();
		axios.get('./data/normal_100.json').then((result) => {
			grid.setGridData(result.data);
			grid.removeAjaxLoader();
		});
	};

	const isCreatedGrid = () => myGrid.current.isCreated();

	const destroy = () => {
		myGrid.current.destroy();
	};

	const recreate = () => {
		if (isCreatedGrid()) return;

		gridProps.useGroupingPanel = false;
		myGrid.current.create(columnLayout, gridProps);
		setupGridEvents();
		requestGridData();
	};

	return (
		<div>
			<p>기본적인 그리드 생성 화면. 동적으로 제거와 생성을 위한 가이드</p>
			<button className="btn" onClick={destroy}>
				그리드 제거
			</button>
			<button className="btn" onClick={recreate}>
				그리드 다시 생성
			</button>
			<AUIGrid ref={myGrid} name={uid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default SampleDefault;
