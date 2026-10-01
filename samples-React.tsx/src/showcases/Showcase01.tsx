import { useCallback, useEffect, useRef } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import axios from 'axios';
import ExportGridDataView from '../samples/ExportGridDataView';
import './Showcase01.css';

const myExpFunction = (_rowIndex: number, _columnIndex: number, item: any, dataField: string): number => {
	let count = 0;

	if (dataField === 'ceu') {
		for (const field in item) {
			const value: string = item[field];
			if (value === 'E' || value === 'U') count++;
		}
		return count;
	}

	const opMap: Record<string, string> = { ct: 'T', ce: 'E', cu: 'U', cp: 'P' };
	const opValue = opMap[dataField] ?? '';
	for (const field in item) {
		if (item[field] === opValue) count++;
	}
	return count;
};

const cellStyleFunction = (_rowIndex: number, _columnIndex: number, value: any): string | null => {
	const styleMap: Record<string, string> = {
		N: 'mycustom-n',
		T: 'mycustom-t',
		U: 'mycustom-u',
		E: 'mycustom-e',
		P: 'mycustom-p'
	};
	return styleMap[value] ?? null;
};

const columnLayout: IGrid.Column[] = (() => {
	const days = ['일', '월', '화', '수', '목', '금', '토'];
	const layout: IGrid.Column[] = [
		{
			dataField: 'name',
			headerText: '학생이름',
			filter: { showIcon: true, useExMenu: true }
		},
		{
			headerText: '합 계',
			children: [
				{ dataField: 'ct', expFunction: myExpFunction, editable: false, headerText: 'T', width: 40, headerStyle: 'mycustom-t', dataType: 'numeric', headerTooltip: { show: true, tooltipHtml: '지각' } },
				{ dataField: 'ce', expFunction: myExpFunction, editable: false, headerText: 'E', width: 40, headerStyle: 'mycustom-e', dataType: 'numeric', headerTooltip: { show: true, tooltipHtml: '사정 상 결석' } },
				{ dataField: 'cu', expFunction: myExpFunction, editable: false, headerText: 'U', width: 40, headerStyle: 'mycustom-u', dataType: 'numeric', headerTooltip: { show: true, tooltipHtml: '무단 결석' } },
				{ dataField: 'cp', expFunction: myExpFunction, editable: false, headerText: 'P', width: 40, headerStyle: 'mycustom-p', dataType: 'numeric', headerTooltip: { show: true, tooltipHtml: '출석' } },
				{ dataField: 'ceu', expFunction: myExpFunction, editable: false, headerText: '결석 일수', width: 100, dataType: 'numeric', renderer: { type: IGrid.RendererKind.BarRenderer, max: 10, style: 'showcase1-custmom-bar' } }
			]
		}
	];

	for (let i = 1; i <= 31; i++) {
		layout.push({
			headerText: days[i % 7],
			children: [{ dataField: 'd' + i, headerText: String(i), width: 40, styleFunction: cellStyleFunction }]
		});
	}
	return layout;
})();

const gridProps: IGrid.Props = {
	editable: true,
	width: '100%',
	height: 480,
	selectionMode: 'multipleCells'
};

// 데이터 요청과 그리드 반영. 종료된 컴포넌트에는 응답을 적용하지 않습니다.
async function loadGridData(grid: AUIGrid, signal: AbortSignal) {
	grid.showAjaxLoader();
	try {
		const { data } = await axios.get('./data/student_present.json', { signal });
		if (!signal.aborted) grid.setGridData(data);
	} catch (error) {
		if (!signal.aborted) console.error('데이터 로딩 오류:', error);
	} finally {
		if (!signal.aborted) grid.removeAjaxLoader();
	}
}

// 그리드 생성 뒤 이벤트를 연결합니다. 리스너 해제는 wrapper가 담당합니다.
function bindGridEvents(grid: AUIGrid) {
	// 편집 이벤트 안에서 재진입하지 않도록 기존 16ms 지연을 유지합니다.
	let disposed = false;
	const pendingEdits = new Set<ReturnType<typeof setTimeout>>();
	const scheduleEdit = (callback: () => void) => {
		if (disposed) return;
		const timer = setTimeout(() => {
			pendingEdits.delete(timer);
			callback();
		}, 16);
		pendingEdits.add(timer);
	};
	const cancelPendingEdits = () => {
		disposed = true;
		pendingEdits.forEach(clearTimeout);
		pendingEdits.clear();
	};

	grid.bind([IGrid.EventKind.CellClick, IGrid.EventKind.HeaderClick], (event: IGrid.CellClickEvent | IGrid.HeaderClickEvent) => {
		switch (event.type) {
			case IGrid.EventKind.CellClick:
				console.log(event.type, (event as IGrid.CellClickEvent).value);
				break;
			case IGrid.EventKind.HeaderClick:
				console.log(event.type, event.headerText);
				break;
		}
	});

	grid.bind(IGrid.EventKind.AddRowFinish, () => {
		const selected = grid.getSelectedIndex();
		if (selected.length <= 0) return;

		const rowIndex = selected[0];
		const colIndex = grid.getColumnIndexByDataField('name');
		grid.setSelectionByIndex(rowIndex, colIndex);
		scheduleEdit(() => grid.openInputer());
	});

	grid.bind([IGrid.EventKind.CellEditEndBefore, IGrid.EventKind.CellEditCancel], (event: any) => {
		switch (event.type) {
			case IGrid.EventKind.CellEditEndBefore: {
				const endEvent = event as IGrid.CellEditEndEvent;
				if (endEvent.dataField === 'name') {
					console.log('oldValue :', endEvent.oldValue, ', new Value :', endEvent.value);
					return endEvent.value;
				}
				if (!endEvent.value) return endEvent.oldValue;
				const value = endEvent.value.toUpperCase();
				const validValues = ['T', 'E', 'U', 'P', 'N'];
				if (!validValues.includes(value)) {
					console.log('T, E, U, P, N 입력이 아님으로 에디팅 취소시킴');
					return endEvent.oldValue;
				}
				console.log('oldValue :', endEvent.oldValue, ', new Value :', value, '(대문자로 변경됨)');
				return value;
			}
			case IGrid.EventKind.CellEditCancel: {
				const cancelEvent = event as IGrid.CellEditCancelEvent;
				if (cancelEvent.dataField === 'name' && cancelEvent.item.name === '') {
					scheduleEdit(() => grid.removeRow(cancelEvent.rowIndex));
				}
				break;
			}
		}
	});

	return cancelPendingEdits;
}

const Showcase01 = () => {
	const myGrid = useRef<AUIGrid>(null);

	// 생성된 wrapper 참조에 초기화하고, effect가 종료되면 요청/작업을 정리합니다.
	useEffect(() => {
		const grid = myGrid.current as AUIGrid;
		const controller = new AbortController();
		const cancelPendingEdits = bindGridEvents(grid);
		loadGridData(grid, controller.signal);
		return () => {
			controller.abort();
			cancelPendingEdits();
		};
	}, []);

	const addRow = useCallback(() => {
		const grid = myGrid.current as AUIGrid;
		grid.forceEditingComplete(null);

		const holidays = [6, 7, 13, 14];
		const item: any = { name: '' };
		for (let i = 1; i <= 31; i++) {
			item['d' + i] = holidays.includes(i) ? 'N' : 'P';
		}
		grid.addRow(item, 'last');
	}, []);

	const removeRow = useCallback(() => {
		(myGrid.current as AUIGrid).removeRow('selectedIndex');
	}, []);

	const restoreSoftRow = useCallback(() => {
		(myGrid.current as AUIGrid).restoreSoftRows('selectedIndex');
	}, []);

	const removeSoftRows = useCallback(() => {
		const grid = myGrid.current as AUIGrid;
		const removedRows = grid.getRemovedItems(true);
		if (removedRows.length <= 0) {
			alert('삭제 처리되어 마크된 행이 없습니다.');
			return;
		}
		if (window.confirm('다시 복구 할 수 없습니다. 삭제 하시겠습니까?')) {
			grid.removeSoftRows();
		}
	}, []);

	return (
		<div>
			<div className="desc">
				<ExportGridDataView myGrid={myGrid} xlsxProps={{ fileName: '쇼케이스-01' }} pdfProps={{ fileName: '쇼케이스-01' }} />
				<p>학생 출석 레코드를 표현 할 때 각각의 셀에 스타일을 적용시킨 것입니다.</p>
				<div>
					<span className="legend mycustom-t">T</span>
					<span>지각</span>
					<span className="legend mycustom-e">E</span>
					<span>유고</span>
					<span className="legend mycustom-u">U</span>
					<span>무단</span>
					<span className="legend mycustom-p">P</span>
					<span>출석</span>
					<span className="legend mycustom-n">N</span>
					<span>휴교</span>
				</div>
				<p>날짜의 값(T, E, U, P, N) 수정 시 동적으로 합계가 변경됩니다.</p>
				<div>
					<div>
						<button onClick={addRow}>학생 추가</button>
						<button onClick={removeRow}>선택 삭제</button>
						<button onClick={restoreSoftRow}>삭제 취소</button>
						<button onClick={removeSoftRows}>삭제 처리된 행들 완전 삭제</button>
					</div>
				</div>
				<p>(삭제 시 softRemoveRowMode = true 설정으로 바로 그리드에서 제거하지 않음.)</p>
			</div>
			<AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default Showcase01;
