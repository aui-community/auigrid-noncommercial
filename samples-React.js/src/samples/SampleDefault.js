import React, { useEffect, useRef, useId } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
import axios from 'axios';

const PUBLIC_URL = process.env.PUBLIC_URL;

const SampleDefault = () => {
	// 그리드 객체
	const myGrid = useRef();

	// 그리드 name 에 정의할 고유값
	const uid = useId();

	// 그리드 칼럼 레이아웃 정의
	const columnLayout = [
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
				type: 'ImageRenderer',
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
				type: 'InputEditRenderer',
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
				type: 'InputEditRenderer',
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
			formatString: 'yyyy년 mm월 dd일' // 그리드에 보여줄 날짜 형식
		}
	];

	// 그리드 속성 정의
	const gridProps = {
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
		useGroupingPanel: true,
		// 상태 칼럼 사용
		showStateColumn: true,
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
		const grid = myGrid.current;
		// 그리드 이벤트 바인딩
		grid.bind(['cellClick', 'selectionChange', 'headerClick'], (event) => {
			console.log(event.type);
		});
	};

	// 그리드 데이터 조회하여 삽입
	const requestGridData = () => {
		const grid = myGrid.current;
		const REQ_URL = './data/normal_100.json';

		grid.showAjaxLoader();
		axios.get(REQ_URL).then((result) => {
			//console.log(result);
			// 그리드 데이터 삽입
			grid.setGridData(result.data);
			grid.removeAjaxLoader();
		});
	};

	// 작성된 그리드를 제거합니다.
	const destory = () => {
		const grid = myGrid.current;
		grid.destroy();
	};

	// 그리드를 수동으로 생성 시킵니다.
	const recreate = () => {
		// 이미 생성되어 있는 경우
		if (isCreatedGrid()) return;

		const grid = myGrid.current;

		// 기존 옵션에서 변경하고자 함.
		gridProps.useGroupingPanel = false;

		// 그리드 수동으로 재생성
		grid.create(columnLayout, gridProps);

		// 그리드 이벤트 세팅
		setupGridEvents();

		// 데이터 재요청
		requestGridData();
	};

	// 현재 그리드가 생성되었는지 여부
	const isCreatedGrid = () => {
		const grid = myGrid.current;
		const isCreated = grid.isCreated();
		console.log(isCreated);
		return isCreated;
	};

	return (
		<div>
			<p>기본적인 그리드 생성 화면. 동적으로 제거와 생성을 위한 가이드</p>
			<button className="btn" onClick={destory}>
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
