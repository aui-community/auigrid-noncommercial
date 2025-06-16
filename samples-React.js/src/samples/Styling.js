import React, { useEffect, useRef } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
import axios from 'axios';
import ExportGridDataView from './ExportGridDataView';
import './Styling.css';

const Syling = () => {
	// 그리드 객체
	const myGrid = useRef();

	// 그리드 칼럼 레이아웃 정의
	const columnLayout = [
		{
			dataField: 'orderId',
			headerText: 'Order ID',
			width: 140
		},
		{
			dataField: 'country',
			headerText: 'Country',
			style: 'my-column-style2'
		},
		{
			dataField: 'name',
			headerText: 'Name'
		},
		{
			dataField: 'product',
			headerText: 'Product',
			style: 'my-column-style',
			styleFunction: (rowIndex, columnIndex, value, headerText, item, dataField) => {
				if (value === 'Galaxy S25') {
					return 'my-cell-style';
				}
			}
		},
		{
			dataField: 'price',
			headerText: 'Price',
			dataType: 'numeric',
			style: 'my-right-column'
		},
		{
			dataField: 'phone',
			headerText: 'Phone'
		},
		{
			dataField: 'date',
			headerText: 'Date'
		}
	];

	// 푸터 레이아웃 설정
	const footerLayout = [
		{
			dataField: 'price',
			positionField: 'price',
			operation: 'SUM',
			dataType: 'numeric',
			formatString: '#,##0',
			style: 'aui-grid-my-footer-sum-total2'
		},
		{
			dataField: 'price',
			positionField: 'date',
			operation: 'COUNT',
			style: 'aui-grid-my-footer-sum-total2'
		},
		{
			labelText: 'Count=>',
			positionField: 'phone',
			style: 'aui-grid-my-footer-sum-total2'
		}
	];

	// 그리드 속성 정의
	const gridProps = {
		width: '100%',
		height: 480,
		showFooter: true,
		editable: true,
		showRowNumColumn: true,
		showRowCheckColumn: true,
		displayTreeOpen: true,
		// singleRow 선택모드
		selectionMode: 'multipleCells',
		// 그룹핑 패널 사용
		useGroupingPanel: true,
		// row Styling 함수
		rowStyleFunction: (rowIndex, item) => {
			if (item.country === 'USA') {
				return 'my-row-style';
			}
		}
	};

	useEffect(() => {
		console.log('Syling 마운트됨');

		// 최초 마운팅 될 때 그리드 데이터 조회시키기
		requestGridData();

		return () => {
			console.log('Syling 언마운트됨');
		};
	}, []);

	// row Styling 함수를 다른 함수로 변경
	const changeRowStyleFunction = () => {
		const grid = myGrid.current;

		// row Styling 함수를 다른 함수로 변경
		grid.setProp('rowStyleFunction', (rowIndex, item) => {
			if (item.country === 'UK') {
				return 'my-row-style';
			}
		});

		// 변경된 rowStyleFunction 이 적용되도록 그리드 업데이트
		grid.update();
	};

	// 그리드 데이터 조회하여 삽입
	const requestGridData = () => {
		const grid = myGrid.current;
		const REQ_URL = './data/country_phone_500.json';

		grid.showAjaxLoader();
		axios.get(REQ_URL).then((result) => {
			//console.log(result);
			// 그리드 데이터 삽입
			grid.setGridData(result.data);
			grid.removeAjaxLoader();
		});
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
