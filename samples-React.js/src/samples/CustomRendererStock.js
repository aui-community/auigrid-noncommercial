import React, { useEffect, useRef } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
import AUIGridStockRenderer from '../renderers/AUIGrid.StockRenderer';
import data from './data/StockListData';

const CustomRendererStock = () => {
	// 그리드 객체
	const myGrid = useRef();

	// 그리드 칼럼 레이아웃 정의
	const columnLayout = [
		{
			dataField: 'name',
			headerText: '종목명',
			width: 160
		},
		{
			dataField: 'close',
			headerText: '현재가',
			width: 180,
			headerTooltip: {
				show: true,
				tooltipHtml: '사용자 정의 렌더러를 작성한 칼럼입니다.'
			},
			renderer: {
				type: 'CustomRenderer',
				jsClass: AUIGridStockRenderer
			}
		},
		{
			dataField: 'volume',
			headerText: '거래량',
			dataType: 'numeric',
			formatString: '#,##0',
			width: 140,
			style: 'my-right-column'
		},
		{
			dataField: 'total',
			headerText: '시가 총액',
			dataType: 'numeric',
			formatString: '#,##0',
			width: 140,
			style: 'my-right-column'
		},
		{
			dataField: 'size',
			headerText: '상장 주식수',
			dataType: 'numeric',
			formatString: '#,##0',
			width: 140,
			style: 'my-right-column'
		},
		{
			dataField: 'undefined',
			headerText: '상세 보기',
			width: 140,
			renderer: {
				type: 'ButtonRenderer',
				labelText: '상세 보기',
				onClick: function (event) {
					alert('( ' + event.rowIndex + ', ' + event.columnIndex + ' ) ' + event.item.name + ' 상세 보기 클릭');
				}
			}
		}
	];

	// 그리드 속성 정의
	const gridProps = {
		width: '100%',
		height: 480,
		// 행 인덱스 칼럼 30 사이즈
		rowNumColumnWidth: 30,
		//rowHeight 38으로 설정
		rowHeight: 38
	};

	useEffect(() => {
		console.log('CustomRendererStock 마운트됨');

		// 최초 마운팅 될 때 그리드 이벤트 세팅
		setupGridEvents();

		// 최초 마운팅 될 때 그리드 데이터 조회시키기

		const grid = myGrid.current;
		// 그리드 데이터 삽입
		grid.setGridData(data);

		return () => {
			console.log('CustomRendererStock 언마운트됨');
		};
	}, []);

	// 그리드 이벤트 세팅
	const setupGridEvents = () => {
		const grid = myGrid.current;
		// 그리드 이벤트 바인딩
		grid.bind(['cellClick'], (event) => {
			console.log(event);
		});
	};

	return (
		<div>
			<div className="desc">
				<p>이 샘플은 일반 JS에 작성한 AUIGrid.MyStockRenderer 를 리액트 컴포넌트로 만들어 출력한 모습입니다.</p>
				<p>즉, 사용자정의 렌더러(CustomRenderer) 샘플 1을 그대로 리액트 컴포넌트로 작성하여 어떻게 적용하는지를 보여주는 데모입니다.</p>
				<p>"현재가" 칼럼은 리액트 컴포넌트(Stock.js, AUIGrid.StockRenderer.js)를 작성하여 그리드에 어떻게 적용하여 출력 시키는지를 보여주는 칼럼이니 반드시 확인하십시오.</p>
			</div>
			<AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default CustomRendererStock;
