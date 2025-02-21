import React, { useEffect, useRef } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import ExportGridDataView from './ExportGridDataView';
import data from './data/TreeGridFlatData';

const SampleTreeGrid = () => {
	// 그리드 객체
	const myGrid = useRef<AUIGrid>(null);

	const isExpanded = useRef<boolean>(true);

	// 그리드 칼럼 레이아웃 정의
	const columnLayout: IGrid.Column[] = [
		{
			dataField: 'id',
			headerText: 'Task ID',
			width: 120,
			editRenderer: {
				type: IGrid.EditRendererKind.InputEditRenderer,

				// ID는 고유값만 가능하도록 에디팅 유효성 검사
				validator: (oldValue, newValue, rowItem, dataField) => {
					const grid = myGrid.current as AUIGrid;
					if (oldValue !== newValue) {
						// dataField 에서 newValue 값이 유일한 값인지 조사
						const isValid = grid.isUniqueValue(dataField, newValue);

						// 리턴값은 Object 이며 validate 의 값이 true 라면 패스, false 라면 message 를 띄움
						return { validate: isValid, message: newValue + ' 값은 고유값이 아닙니다. 다른 값을 입력해 주십시오.' };
					}
				}
			}
		},
		{
			dataField: 'name',
			headerText: 'Task Name',
			style: 'my-left-column'
		}
	];

	// 그리드 속성 정의
	const gridProps: IGrid.Props = {
		width: '100%',
		height: 480,
		// singleRow 선택모드
		selectionMode: 'singleRow',
		displayTreeOpen: true,
		editable: true,
		// 일반 데이터를 트리로 표현할지 여부(treeIdField, treeIdRefField 설정 필수)
		flat2tree: true,
		// 행의 고유 필드명
		rowIdField: 'rowId',
		// 트리의 고유 필드명
		treeIdField: 'id',
		// 계층 구조에서 내 부모 행의 treeIdField 참고 필드명
		treeIdRefField: 'parent'
	};

	useEffect(() => {
		console.log('SampleTreeGrid 마운트됨');

		// 최초 마운팅 될 때 그리드 이벤트 세팅
		setupGridEvents();

		// 최초 마운팅 될 때 그리드 데이터 조회시키기
		requestGridData();

		return () => {
			console.log('SampleTreeGrid 언마운트됨');
		};
	}, []);

	// 그리드 이벤트 세팅
	const setupGridEvents = () => {
		const grid = myGrid.current as AUIGrid;

		// 그리드 ready 이벤트 바인딩
		grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
			console.log(event);
		});

		// 그리드 cellClick
		grid.bind(IGrid.EventKind.CellClick, (event: IGrid.CellClickEvent) => {
			console.log(event.value);
		});
	};

	// 그리드 데이터 조회하여 삽입
	const requestGridData = () => {
		const grid = myGrid.current as AUIGrid;

		// 그리드에 데이터 삽입
		grid.setGridData(data);
	};

	// 모두 열기/닫기
	const expand = () => {
		const grid = myGrid.current as AUIGrid;

		if (isExpanded.current) {
			grid.collapseAll();
		} else {
			grid.expandAll();
		}

		isExpanded.current = !isExpanded.current;
	};

	// 특정 행 열기 닫기
	const expandItem = () => {
		const grid = myGrid.current as AUIGrid;
		let isOpen: boolean = grid.isItemOpenByRowId('r6');

		//-- rowIdField 로 설정한 필드의 값이 r6 인 행 열기/ 닫기
		grid.expandItemByRowId('r6', !isOpen);
	};

	return (
		<div>
			<div className="desc">
				<p>기본적으로 트리 그리드는 계층 데이터로 구성된 데이터를 출력합니다. 즉, 서버에서 데이터 작성 시 데이터 구조를 계층적으로 작성해야 합니다.</p>
				<p>그러나 일반 배열 형식의 데이터를 다음과 같이 id 와 parent 를 지시하면 그리드가 계층구조로 출력합니다.</p>
				<p>{`{"id": "1", "name": "Phase 1 - Strategic Plan"},`}</p>
				<p>{`{"id": "2", "name": "Self-Assessment", "parent":"1"},`}</p>
				<p>{`{"id": "3", "name": "Define business vision", "parent":"2"}`}</p>
				<p>id 와 parent 필드는 각각 treeIdField, treeIdRefField 속성으로 설정하십시오.</p>

				<button onClick={expand}>모두 열기/ 닫기</button>
				<button onClick={expandItem}>특정 브랜치(ID = "r6") 열기/닫기</button>

				<ExportGridDataView myGrid={myGrid} />
			</div>
			<AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default SampleTreeGrid;
