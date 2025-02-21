import React, { useEffect, useRef, useId } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import axios from 'axios';
import ExportGridDataView from './ExportGridDataView';

const PUBLIC_URL = process.env.PUBLIC_URL;

const SampleDefault = () => {
	// 그리드 객체
	const myGrid = useRef<AUIGrid>(null);

	// 그리드 name 에 정의할 고유값
	const uid: string = useId();

	// 그리드 칼럼 레이아웃 정의
	const columnLayout: IGrid.Column[] = [
		{
			dataField: 'id',
			headerText: 'ID',
			width: 120
		},
		{
			dataField: 'name',
			headerText: 'Name',
			width: 140
		},
		{
			dataField: 'country',
			headerText: 'Country',
			width: 140
		},
		{
			dataField: 'flag',
			headerText: 'Flag IMG',
			editable: false,
			prefix: PUBLIC_URL + '/assets/',
			renderer: {
				type: IGrid.RendererKind.ImageRenderer,
				imgHeight: 24,
				altField: 'country'
			},
			width: 100
		},
		{
			dataField: 'product',
			headerText: 'Product',
			width: 140
		},
		{
			dataField: 'color',
			headerText: 'Color',
			width: 100
		},
		{
			dataField: 'price',
			headerText: 'Price',
			dataType: 'numeric',
			style: 'my-column',
			width: 120,
			editRenderer: {
				type: IGrid.EditRendererKind.InputEditRenderer,
				onlyNumeric: true, // 0~9만 입력가능
				textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
				autoThousandSeparator: true // 천단위 구분자 삽입 여부
			}
		},
		{
			dataField: 'quantity',
			headerText: 'Quantity',
			dataType: 'numeric',
			style: 'my-column',
			width: 100,
			editRenderer: {
				type: IGrid.EditRendererKind.InputEditRenderer,
				onlyNumeric: true, // 0~9만 입력가능
				textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
				autoThousandSeparator: true // 천단위 구분자 삽입 여부
			}
		},
		{
			dataField: 'date',
			headerText: 'Date',
			dataType: 'date',
			dateInputFormat: 'yyyy-mm-dd', // 데이터의 날짜 형식
			formatString: 'yyyy. mm. dd.', // 그리드에 보여줄 날짜 형식
			editRenderer: {
				type: IGrid.EditRendererKind.CalendarRenderer,
				defaultFormat: 'yyyy-mm-dd', // 달력 선택 시 데이터에 적용되는 날짜 형식
				showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 출력 여부
				showConfirmBtn: true // 확인 버튼 출력 여부
			}
		}
	];

	// 그리드 속성 정의
	const gridProps: IGrid.Props = {
		width: '100%',
		height: 480,
		// 편집 가능 여부 (기본값 : false)
		editable: true,
		// 셀 병합 실행
		enableCellMerge: true,
		// 엔터키가 다음 행이 아닌 다음 칼럼으로 이동할지 여부 (기본값 : false)
		enterKeyColumnBase: true,
		// 셀 선택모드 (기본값: singleCell)
		selectionMode: 'multipleCells',
		// 컨텍스트 메뉴 사용 여부 (기본값 : false)
		useContextMenu: true,
		// 필터 사용 여부 (기본값 : false)
		enableFilter: true,
		// 그룹핑 패널 사용
		//useGroupingPanel: true,
		// 상태 칼럼 사용
		//showStateColumn: true,
		// 그룹핑 또는 트리로 만들었을 때 펼쳐지게 할지 여부 (기본값 : false)
		displayTreeOpen: true,
		noDataMessage: '출력할 데이터가 없습니다.',
		groupingMessage: '여기에 칼럼을 드래그하면 그룹핑이 됩니다.'
	};

	useEffect(() => {
		console.log('SampleDefault 마운트됨');

		// 최초 마운팅 될 때 그리드 이벤트 세팅
		setupGridEvents();

		// 최초 마운팅 될 때 그리드 데이터 조회시키기
		requestGridData();

		return () => {
			console.log('SampleDefault 언마운트됨');
		};
	}, []);

	// 그리드 이벤트 세팅
	const setupGridEvents = () => {
		const grid = myGrid.current as AUIGrid;

		// 그리드 ready 이벤트 바인딩
		grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
			console.log(event);
		});

		// 그리드 cellClick, headerClick 이벤트 바인딩
		grid.bind([IGrid.EventKind.CellClick, IGrid.EventKind.HeaderClick], (event: IGrid.CellClickEvent | IGrid.HeaderClickEvent) => {
			switch (event.type) {
				case IGrid.EventKind.CellClick:
					console.log((event as IGrid.CellClickEvent).value);
					break;
				case IGrid.EventKind.HeaderClick:
					console.log(event.headerText);
					break;
				default:
			}
		});

		// 그리드 doubleClick 이벤트 바인딩
		grid.bind(IGrid.EventKind.CellDoubleClick, (event: IGrid.CellDoubleClickEvent) => {
			console.log(event);
		});
	};

	// 그리드 데이터 조회하여 삽입
	const requestGridData = () => {
		const grid = myGrid.current as AUIGrid;
		grid.showAjaxLoader();
		axios.get('./data/normal_100.json').then((result) => {
			//console.log(result);
			// 그리드 데이터 삽입
			grid.setGridData(result.data);
			grid.removeAjaxLoader();
		});
	};

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
