import * as IGrid from 'aui-grid';
import * as renderers from '../renderers/purchase_approval';

export type Status = 'all' | 'active' | 'done' | 'rejected';
export type Layout = 'band' | 'flatAll';
export interface PurchaseRow {
    id: string; title: string; requester: string; team: string; description: string;
    amount: number; stage: number; rejected: boolean; daysLeft: number; dueDate: string;
    files: { name: string; size: string }[]; tone: number; approvalStatus: string; actions: string; status: Status;
}
export interface CellAction { id: string; action: string; value?: number }
export interface DialogView {
    id: string; title: string; facts: [string, string][];
    files: PurchaseRow['files']; editable: boolean; completed: boolean; rejected: boolean; advanceLabel: string;
}
export interface DemoView { status: Status; mode: Layout; count: number; total: number; dialog: DialogView | null }
// 두 프레임워크의 래퍼가 이미 제공하는 메서드만 사용합니다. 엔진 전역 ID를 별도로 보관하지 않습니다.
// npm 타입의 공통 스타일 계약에 이 예제가 사용하는 파일 옵션을 추가합니다.
interface ExportOptions extends IGrid.ExportStyleOptions {
    fileName: string; sheetName?: string; exceptColumnFields?: string[]; fontPath?: string; rowHeight?: number;
}
export interface GridPort {
    setGridData(rows: PurchaseRow[]): void; getRowCount(): number;
    updateRowsById(item: PurchaseRow): void; setProp(props: IGrid.Props): void; refresh(): void;
    clearSortingAll(): void; clearFilterAll(): void;
    exportToXlsx(props: ExportOptions): void; exportToPdf(props: ExportOptions): void;
    bind(name: string, callback: () => void): void;
    unbind(name: string): void; isCreated(): boolean; showAjaxLoader(): void; removeAjaxLoader(): void;
}
export var filters: { value: Status; label: string }[] = [
    { value: 'all', label: '전체 요청' }, { value: 'active', label: '진행 중' },
    { value: 'done', label: '발주 완료' }, { value: 'rejected', label: '반려' }
];
export var initialView: DemoView = { status: 'all', mode: 'band', count: 0, total: 0, dialog: null };
export var gridProps: IGrid.Props = {
    bodyLayoutMode: 'band', rowHeight: 120, headerHeight: 29, rowIdField: 'id',
    showRowNumColumn: true, showStateColumn: false, selectionMode: 'singleRow',
    enableSorting: true, enableFilter: true,
    editable: false, applyRestPercentWidth: true, width: '100%', height: 540,
    noDataMessage: '이 상태에 해당하는 요청이 없습니다.'
};
var stageNames = ['접수', '검토', '결재', '발주'];


// npm의 공식 필터 타입으로 날짜 트리의 전체 펼침 옵션을 지정합니다.
var dateFilter: NonNullable<IGrid.Column['filter']> = { showIcon: true, type: 'date', expandAll: true };
function escapeLabel(value: unknown) {
    var escapes: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value).replace(/[&<>"']/g, function (character) { return escapes[character]; });
}
function getStageStatus(item: PurchaseRow, index: number) {
    if (index < item.stage) return '완료';
    if (index === item.stage) return item.rejected ? '반려' : '진행 중';
    return '대기';
}
// Excel과 PDF에서는 현재 상태를 먼저 읽고 완료/대기 단계를 확인할 수 있게 요약합니다.
function getApprovalExportText(item: PurchaseRow) {
    var status = item.rejected ? stageNames[item.stage] + " 반려" : item.stage === 4 ? "발주 완료" :
        ["구매 접수 중", "구매 담당 검토 중", "팀장 결재 중", "발주 준비 중"][item.stage];
    var lines = [status + " (" + Math.min(item.stage + 1, 4) + " / 4 단계)"];
    var completed = stageNames.slice(0, item.stage);
    var waiting = stageNames.slice(item.stage + 1);
    if (item.rejected) lines.push("요청 내용 보완 필요");
    if (completed.length) lines.push("완료: " + completed.join(", "));
    if (waiting.length) lines.push("대기: " + waiting.join(", "));
    return lines.join("\n");
}

function getActionLabel(item: PurchaseRow) {
    return item.rejected ? '재상신' : ['검토 시작', '검토 완료', '승인', '발주 완료', '완료'][item.stage];
}
function updateRequestStatus(item: PurchaseRow) {
    item.approvalStatus = item.stage === 4 ? '발주 완료' : stageNames[item.stage] + ' ' + (item.rejected ? '반려' : '진행 중');
    item.status = item.rejected ? 'rejected' : item.stage === 4 ? 'done' : 'active';
}
// 밴드형 상위 셀과 하위 셀에 사용할 칼럼 레이아웃입니다.
function createColumnLayout(onAction: (event: CellAction) => void): IGrid.Column[] {
    function createCustomRenderer(jsClass: unknown, aliasFunction: IGrid.CustomRenderer['aliasFunction']): IGrid.CustomRenderer {
        return { type: IGrid.RendererKind.CustomRenderer, jsClass: jsClass, aliasFunction: aliasFunction, extraProps: { onAction: onAction } };
    }
	var columnLayout: IGrid.Column[] = [{
		dataField: "title",
		headerText: "구매 요청",
		bodyCell: true,
		bodyCellHeight: "34%",
		width: 260,
		style: "request-title-cell",
		filter: { showIcon: true, useExMenu: true },
		renderer: {
			type: IGrid.RendererKind.TemplateRenderer,
			aliasFunction: function (rowIndex, columnIndex, value, headerText, item) {
				return item.id + "\n" + value;
			}
		},
		labelFunction: function (rowIndex, columnIndex, value, headerText, item) {
			return '<span class="request-id">' + escapeLabel(item.id) + '</span>' + escapeLabel(value);
		},
		children: [{
			dataField: "requester",
			headerText: "요청자",
			style: "requester-text-cell",
			width: "22%",
			minWidth: 150,
			filter: { showIcon: true, useExMenu: true },
			renderer: createCustomRenderer(renderers.RequesterRenderer, function (rowIndex, columnIndex, value, headerText, item) {
				return value + "\n" + item.team;
			})
		}, {
			dataField: "amount",
			headerText: "요청 금액",
			width: "12%",
			minWidth: 116,
			dataType: "numeric",
			formatString: "#,##0",
			style: "amount-cell",
			// Excel에서도 원래 숫자 값과 천 단위 표시 서식을 유지합니다.
			xlsxNumeric: true,
			filter: { showIcon: true, useExMenu: true }
		}]
	}, {
		dataField: "approvalStatus",
		headerText: "결재 진행",
		width: "32%",
		minWidth: 360,
		filter: { showIcon: true },
		renderer: createCustomRenderer(renderers.ApprovalStepsRenderer, function (rowIndex, columnIndex, value, headerText, item) {
			return getApprovalExportText(item);
		})
	}, {
		dataField: "files",
		headerText: "첨부파일",
		width: "12%",
		minWidth: 136,
		sortable: false,
		renderer: createCustomRenderer(renderers.AttachmentRenderer, function (rowIndex, columnIndex, value, headerText, item: PurchaseRow) {
			return item.files.length ? item.files.map(function (file) { return file.name; }).join("\n") : "없음";
		})
	}, {
		dataField: "dueDate",
		headerText: "납기",
		width: "9%",
		minWidth: 100,
		dataType: "date",
		dateInputFormat: "yyyy-mm-dd",
		formatString: "yyyy-mm-dd",
		// 날짜 필터를 열 때 연, 월, 일을 모두 펼쳐 표시합니다.
		filter: dateFilter,
		renderer: createCustomRenderer(renderers.PurchaseDueRenderer, function (rowIndex, columnIndex, value, headerText, item) {
			var status = item.stage === 4 ? "발주 완료" : item.daysLeft < 0 ? -item.daysLeft + "일 지연" : item.daysLeft === 0 ? "오늘 납기" : item.daysLeft + "일 남음";
			return value + "\n" + status;
		})
	}, {
		dataField: "actions",
		headerText: "작업",
		width: "13%",
		minWidth: 150,
		sortable: false,
		renderer: createCustomRenderer(renderers.ApprovalActionsRenderer, function (rowIndex, columnIndex, value, headerText, item) {
			return getActionLabel(item);
		})
	}];
	return columnLayout;
}

// 데이터와 콜백은 컴포넌트별로 관리하여 정렬, 화면 재진입 후에도 현재 요청 ID를 처리합니다.
export function createPurchaseDemo(notify: (view: DemoView) => void, baseUrl: string) {
    var grid: GridPort | null = null;
    var rows: PurchaseRow[] = [];
    var request: AbortController | null = null;
    var view: DemoView = { ...initialView };
    function visibleRows() { return rows.filter(function (row) { return view.status === 'all' || row.status === view.status; }); }
    function publish() { notify({ ...view }); }
    function updateCounts() {
        view = { ...view, count: grid?.getRowCount() || 0, total: visibleRows().length };
        publish();
    }
    function applyFilter() {
        grid?.setGridData(structuredClone(visibleRows()));
        updateCounts();
    }
    function clearGridView() {
        grid?.clearSortingAll();
        grid?.clearFilterAll();
        updateCounts();
    }
    // WebDemo와 같은 JSON을 읽습니다. 재요청이나 화면 종료 뒤 도착한 이전 응답은 적용하지 않습니다.
    async function loadGridData() {
        request?.abort();
        var controller = new AbortController();
        request = controller;
        var instance = grid;
        instance?.showAjaxLoader();
        try {
            var response = await fetch(baseUrl + '/data/purchase_approval.json', { signal: controller.signal });
            if (!response.ok) throw new Error('데이터 요청 실패');
            var data: PurchaseRow[] = await response.json();
            if (controller.signal.aborted || grid !== instance) return;
            data.forEach(function (item) {
                var due = new Date();
                due.setDate(due.getDate() + item.daysLeft);
                item.dueDate = due.getFullYear() + '-' + String(due.getMonth() + 1).padStart(2, '0') + '-' + String(due.getDate()).padStart(2, '0');
                item.actions = '';
                updateRequestStatus(item);
            });
            rows = data;
            applyFilter();
        } catch (error) {
            if (!controller.signal.aborted) console.error('데이터 로딩 오류:', error);
        } finally {
            if (!controller.signal.aborted && grid === instance && instance?.isCreated()) instance.removeAjaxLoader();
        }
    }
    function exportExcel() {
        if (!grid?.getRowCount()) return;
        grid.exportToXlsx({
            fileName: '구매_요청_및_결재_현황', sheetName: '구매 요청 및 결재 현황',
            // 레이아웃을 생략하여 현재 화면을 따릅니다. 업무 실행 버튼은 Excel에서 제외합니다.
            exceptColumnFields: ['actions'], useExportStyle: true,
            // 화면과 동일하게 구매 요청과 요청자는 왼쪽, 요청 금액은 오른쪽 정렬합니다.
            exportStyle: {
                'request-title-cell': { backgroundColor: '#f3f3f3', color: '#222222', textAlign: 'left' },
                'requester-text-cell': { textAlign: 'left' },
                'amount-cell': { textAlign: 'right' }
            }
        });
    }
    function exportPdf() {
        if (!grid?.getRowCount()) return;
        grid.exportToPdf({
            fileName: '구매_요청_및_결재_현황', fontPath: baseUrl + '/fonts/nyjgothic-medium.ttf',
            rowHeight: view.mode === 'band' ? 120 : 94, useExportStyle: true,
            // 화면과 동일하게 구매 요청과 요청자는 왼쪽, 요청 금액은 오른쪽 정렬합니다.
            exportStyle: {
                'request-title-cell': { backgroundColor: '#f3f3f3', color: '#222222', textAlign: 'left' },
                'requester-text-cell': { textAlign: 'left' },
                'amount-cell': { textAlign: 'right' }
            }
        });
    }
    function changeRequest(id: string, action: string) {
        var item = rows.find(function (row) { return row.id === id; });
        if (!item || item.stage === 4) return;
        if (action === 'reject') {
            if (item.rejected) return;
            item.rejected = true;
        } else if (item.rejected) {
            item.rejected = false;
            item.stage = 1;
        } else {
            item.stage += 1;
        }
        updateRequestStatus(item);
        if (view.status === 'all') { grid?.updateRowsById(structuredClone(item)); updateCounts(); }
        else applyFilter();
    }
    function closeDialog() { view = { ...view, dialog: null }; publish(); }
    function handleAction(event: CellAction) {
        var item = rows.find(function (row) { return row.id === event.id; });
        if (!item) return;
        var action = event.action;
        var value = event.value || 0;
        if (action === 'advance') { changeRequest(item.id, action); return; }
        var dialog: DialogView = {
            id: item.id, title: item.id + ' / ' + item.title, facts: [], files: [],
            editable: action === 'detail' || action === 'step', completed: item.stage === 4,
            rejected: item.rejected, advanceLabel: getActionLabel(item)
        };
        if (action === 'requester') {
            dialog.title = item.requester;
            dialog.facts = [['소속', item.team], ['구매 요청', item.id + ' / ' + item.title]];
        } else if (action === 'files' || action === 'file') {
            if (action === 'file' && !item.files[value]) return;
            dialog.title = action === 'files' ? '첨부파일' : item.files[value].name;
            dialog.files = action === 'files' ? item.files : [];
            if (action === 'file') dialog.facts = [['파일 크기', item.files[value].size], ['품목', item.description]];
            dialog.facts.push(['안내', '첨부파일 미리보기 예시이며 실제 파일은 다운로드하지 않습니다.']);
        } else {
            if (action === 'step') dialog.title = stageNames[value] + ' 단계 / ' + getStageStatus(item, value);
            dialog.facts = [['구매 요청', item.title], ['요청자', item.requester + ' / ' + item.team],
                ['요청 금액', item.amount.toLocaleString('ko-KR') + '원'], ['희망 납기', item.dueDate],
                ['현재 상태', item.approvalStatus], ['품목', item.description]];
        }
        view = { ...view, dialog: dialog };
        publish();
    }
    return {
        columns: createColumnLayout(handleAction),
        attach: function (instance: GridPort) {
            grid = instance;
            grid.bind('filtering', updateCounts);
            loadGridData();
        },
        detach: function () {
            request?.abort();
            if (grid?.isCreated()) grid.unbind('filtering');
            grid = null;
        },
        setStatus: function (status: Status) { view = { ...view, status: status }; applyFilter(); },
        setLayout: function (mode: Layout) {
            grid?.setProp({ bodyLayoutMode: mode, rowHeight: mode === 'band' ? 120 : 94 });
            grid?.refresh();
            view = { ...view, mode: mode };
            updateCounts();
        },
        actOnDialog: function (action: string) {
            var id = view.dialog?.id;
            closeDialog();
            if (id) changeRequest(id, action);
        },
        clearGridView: clearGridView, exportExcel: exportExcel, exportPdf: exportPdf,
        closeDialog: closeDialog, handleAction: handleAction
    };
}
