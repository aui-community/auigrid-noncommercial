import { useEffect, useRef } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
import axios from 'axios';
import ExportGridDataView from './ExportGridDataView';
import './Styling.css';

const columnLayout = [
	{ dataField: 'orderId', headerText: 'Order ID', width: 140 },
	{ dataField: 'country', headerText: 'Country', style: 'my-column-style2' },
	{ dataField: 'name', headerText: 'Name' },
	{
		dataField: 'product',
		headerText: 'Product',
		style: 'my-column-style',
		styleFunction: (rowIndex, columnIndex, value) => {
			if (value === 'Galaxy S25') return 'my-cell-style';
		}
	},
	{ dataField: 'price', headerText: 'Price', dataType: 'numeric', style: 'my-right-column' },
	{ dataField: 'phone', headerText: 'Phone' },
	{ dataField: 'date', headerText: 'Date' }
];

const footerLayout = [
	{ dataField: 'price', positionField: 'price', operation: 'SUM', dataType: 'numeric', formatString: '#,##0', style: 'aui-grid-my-footer-sum-total2' },
	{ dataField: 'price', positionField: 'date', operation: 'COUNT', style: 'aui-grid-my-footer-sum-total2' },
	{ labelText: 'Count=>', positionField: 'phone', style: 'aui-grid-my-footer-sum-total2' }
];

const gridProps = {
	width: '100%',
	height: 480,
	showFooter: true,
	editable: true,
	showRowNumColumn: true,
	showRowCheckColumn: true,
	displayTreeOpen: true,
	selectionMode: 'multipleCells',
	useGroupingPanel: true,
	rowStyleFunction: (rowIndex, item) => {
		if (item.country === 'USA') return 'my-row-style';
	}
};

const Syling = () => {
	const myGrid = useRef();

	useEffect(() => {
		const grid = myGrid.current;
		grid.showAjaxLoader();
		axios.get('./data/country_phone_500.json').then((result) => {
			grid.setGridData(result.data);
			grid.removeAjaxLoader();
		});
	}, []);

	const changeRowStyleFunction = () => {
		const grid = myGrid.current;
		grid.setProp('rowStyleFunction', (rowIndex, item) => {
			if (item.country === 'UK') return 'my-row-style';
		});
		grid.update();
	};

	return (
		<div>
			<div className="desc">
				<p>특정 조건에 따라 동적으로 스타일을 정의합니다.</p>
				<p>
					행(row) 스타일링 : <span className="my-row-style"> Country = USA 인 경우 행에 스타일링</span>
				</p>
				<p>
					셀 스타일링 : <span className="my-cell-style">Product = Galaxy S25 인 셀에 스타일링</span>
				</p>
				<button className="btn" onClick={changeRowStyleFunction}>
					행 스타일링을 변경하기 ( Country 가 UK 인 행 스타일링 하기 )
				</button>
				<ExportGridDataView myGrid={myGrid} />
			</div>
			<AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} footerLayout={footerLayout} />
		</div>
	);
};

export default Syling;
