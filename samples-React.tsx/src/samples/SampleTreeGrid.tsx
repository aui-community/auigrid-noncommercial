import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import ExportGridDataView from './ExportGridDataView';
import data from './data/TreeGridFlatData';

const gridProps: IGrid.Props = {
	width: '100%',
	height: 480,
	selectionMode: 'singleRow',
	displayTreeOpen: true,
	editable: true,
	flat2tree: true,
	rowIdField: 'rowId',
	treeIdField: 'id',
	treeIdRefField: 'parent'
};

const SampleTreeGrid = () => {
	const myGrid = useRef<AUIGrid>(null);
	const isExpanded = useRef(true);

	const columnLayout = useMemo<IGrid.Column[]>(() => [
		{
			dataField: 'id',
			headerText: 'Task ID',
			width: 120,
			editRenderer: {
				type: IGrid.EditRendererKind.InputEditRenderer,
				validator: (oldValue, newValue, _rowItem, dataField) => {
					if (oldValue === newValue) return;
					const isValid = (myGrid.current as AUIGrid).isUniqueValue(dataField, newValue);
					return { validate: isValid, message: `${newValue} 값은 고유값이 아닙니다. 다른 값을 입력해 주십시오.` };
				}
			}
		},
		{ dataField: 'name', headerText: 'Task Name', style: 'my-left-column' }
	], []);

	useEffect(() => {
		const grid = myGrid.current as AUIGrid;

		grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
			console.log(event);
		});

		grid.bind(IGrid.EventKind.CellClick, (event: IGrid.CellClickEvent) => {
			console.log(event.value);
		});

		grid.setGridData(data);
	}, []);

	const expand = useCallback(() => {
		const grid = myGrid.current as AUIGrid;
		isExpanded.current ? grid.collapseAll() : grid.expandAll();
		isExpanded.current = !isExpanded.current;
	}, []);

	const expandItem = useCallback(() => {
		const grid = myGrid.current as AUIGrid;
		grid.expandItemByRowId('r6', !grid.isItemOpenByRowId('r6'));
	}, []);

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
