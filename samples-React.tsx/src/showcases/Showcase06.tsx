import React, { useEffect, useRef } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import axios from 'axios';
import ExportGridDataView from '../samples/ExportGridDataView';
import './Showcase06.css';

const Showcase06 = () => {
	// 그리드 객체
	const myGrid = useRef<AUIGrid>(null);

	// 그리드 칼럼 레이아웃
	const columnLayout: IGrid.Column[] = [
		{
			dataField: 'type0',
			headerText: '구분',
			cellMerge: true,
			style: 'showcase6-my-column-strong',
			filter: {
				showIcon: true
			}
		},
		{
			dataField: 'type',
			headerText: '유형',
			width: 120
		},
		{
			dataField: 'p131,p132,p133,p134,p135,p136,p137,p138,p139,p1310,p1311,p1312',
			headerText: '월별 추이',
			width: 120,
			renderer: {
				type: IGrid.RendererKind.SparkColumnRenderer
			}
		},
		{
			dataField: 'p131',
			headerText: "'13 1월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p132',
			headerText: "'13 2월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p133',
			headerText: "'13 3월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p134',
			headerText: "'13 4월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p135',
			headerText: "'13 5월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p136',
			headerText: "'13 6월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p137',
			headerText: "'13 7월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p138',
			headerText: "'13 8월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p139',
			headerText: "'13 9월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p1310',
			headerText: "'13 10월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p1311',
			headerText: "'13 11월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p1312',
			headerText: "'13 12월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		}
	];

	// 그리드 속성 정의
	const gridProps: IGrid.Props = {
		width: '100%',
		height: 480,
		enableCellMerge: true,
		enableFilter: true,
		editable: true,
		// singleRow 선택모드
		selectionMode: 'multipleCells',
		// 줄번호 칼럼 렌더러 출력 안함
		showRowNumColumn: false,
		// 체크박스 표시 렌더러 출력 안함
		showRowCheckColumn: false,
		rowStyleFunction: (rowIndex, item) => {
			if (item._mySum || item._mySum === 'true') {
				return 'aui-grid-row-depth2-style';
			}
			return null;
		}
	};

	useEffect(() => {
		console.log('Showcase06 마운트됨');

		// 최초 마운팅 될 때 그리드 이벤트 세팅
		setupGridEvents();

		// 최초 마운팅 될 때 그리드 데이터 조회시키기
		requestGridData();

		return () => {
			console.log('Showcase06 언마운트됨');
		};
	}, []);

	// 그리드 이벤트 세팅
	const setupGridEvents = () => {
		const grid = myGrid.current as AUIGrid;
		// 그리드 이벤트 바인딩
		grid.bind(IGrid.EventKind.CellClick, (event: IGrid.CellClickEvent) => {
			console.log(event.type);
		});

		grid.bind(IGrid.EventKind.HeaderClick, (event: IGrid.HeaderClickEvent) => {
			console.log(event.type);
		});
	};

	// 그리드 데이터 조회하여 삽입
	const requestGridData = () => {
		const grid = myGrid.current as AUIGrid;
		grid.showAjaxLoader();
		axios.get('./data/profit.json').then((result) => {
			//console.log(result);
			// 그리드 데이터 삽입
			grid.setGridData(result.data);
			grid.removeAjaxLoader();
		});
	};

	return (
		<div>
			<div className="desc">
				<ExportGridDataView myGrid={myGrid} xlsxProps={{ fileName: '쇼케이스-06' }} pdfProps={{ fileName: '쇼케이스-06' }} />
				<p>손익을 크게 매출 수익, 원가, 경비로 보고 해당 내역을 출력한 모습입니다.</p>
			</div>
			<AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default Showcase06;
