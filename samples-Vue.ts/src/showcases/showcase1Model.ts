import * as IGrid from 'aui-grid';
import type { GridInstance } from './showcaseTypes';
import { percentageRenderer } from './showcaseTypes';
// 이 데모의 행 구조와 화면 상태를 구분해 편집 값과 요약을 함께 관리합니다.
type ResourceRow = { id: string; asset: string; category: string; site: string; [field: string]: string };

export const initialView = {
    site: '전체',
    category: '전체',
    query: '',
    state: '가동',
    count: '',
    undoDisabled: true,
    message: '드래그로 날짜 범위를 선택하면 여러 일정의 상태를 한 번에 변경할 수 있습니다.'
};
export type DemoView = typeof initialView;
type ControlKey = 'site' | 'category' | 'query' | 'state';
type GridPort = Pick<
    GridInstance,
    | 'addRow'
    | 'bind'
    | 'exportToPdf'
    | 'exportToXlsx'
    | 'forceEditingComplete'
    | 'getOrgGridData'
    | 'getRowCount'
    | 'getSelectedItems'
    | 'isCreated'
    | 'removeRow'
    | 'resize'
    | 'setFilter'
    | 'setFixedColumnCount'
    | 'setFooter'
    | 'setGridData'
    | 'unbind'
    | 'undo'
    | 'undoable'
    | 'updateRowsById'
>;

// React/Vue가 생성한 래퍼를 전달받고, 표시 상태는 프레임워크에 돌려줍니다.
export function createDemo(onChange: (view: DemoView) => void, baseUrl: string) {
    let instance: GridPort | null = null;
    let generation = 0;
    const view = { ...initialView };
    function grid(): GridPort {
        if (!instance) throw new Error('그리드가 연결되지 않았습니다.');
        return instance;
    }
    function publish() {
        if (instance) onChange({ ...view });
    }

    let nextResource = 601;
    const states = ['가동', '예약', '점검', '유휴'];
    const stateClasses: Record<string, string> = {
        가동: 'resource-active',
        예약: 'resource-reserved',
        점검: 'resource-maintenance',
        유휴: 'resource-idle'
    };
    const sites = ['수도권 센터', '중부 센터', '남부 센터', '동부 센터', '서부 센터'];
    const resourceTypes = ['자율이동 로봇', '무인 운반차', '전동 지게차', '3D 프린터', '정밀 측정기', '비전 검사기'];
    const dayFields = Array.from({ length: 31 }, (_, index) => 'd' + (index + 1));
    const numberFormat = new Intl.NumberFormat('ko-KR');
    // 자원마다 다른 연속 가동, 예약 및 점검 구간을 만들며 같은 번호는 항상 같은 일정을 갖습니다.
    function makeResource(index: number, empty = false) {
        const type = resourceTypes[index % resourceTypes.length],
            serial = String(index + 1).padStart(4, '0');
        const item: ResourceRow = {
            id: 'R' + serial,
            asset: type + ' #' + serial,
            category: type,
            site: sites[Math.floor(index / resourceTypes.length) % sites.length]
        };
        dayFields.forEach((field, day) => {
            const phase = (day + index * 7) % 31;
            const weekend = [0, 6].includes(new Date(2026, 9, day + 1).getDay());
            item[field] = empty
                ? '유휴'
                : phase < 2
                  ? '점검'
                  : phase < 6
                    ? '예약'
                    : weekend && index % 3 !== 0
                      ? '유휴'
                      : phase > 27
                        ? '유휴'
                        : '가동';
        });
        return item;
    }
    // 출석표처럼 날짜 셀의 상태를 세어 월간 집계와 가동률을 즉시 계산합니다.
    function stateCount(row: number, col: number, item: ResourceRow, field: string) {
        const expected = (
            {
                active: '가동',
                reserved: '예약',
                maintenance: '점검',
                idle: '유휴',
                utilization: '가동'
            } as Record<string, string>
        )[field];
        const count = dayFields.reduce((sum, day) => sum + (item[day] === expected ? 1 : 0), 0);
        return field === 'utilization' ? count / 31 : count;
    }
    function updateResourceCount() {
        view.count =
            numberFormat.format(grid().getRowCount()) +
            ' / ' +
            numberFormat.format(grid().getOrgGridData().length) +
            '개 자원';
        view.undoDisabled = !grid().undoable();
        publish();
    }
    function filterResources() {
        grid().forceEditingComplete(null);
        const site = view.site,
            type = view.category,
            query = view.query.trim().toLowerCase();
        grid().setFilter(
            'asset',
            (field, value, item) =>
                (site === '전체' || item.site === site) &&
                (type === '전체' || item.category === type) &&
                (!query || item.asset.toLowerCase().includes(query))
        );
        updateResourceCount();
    }
    function applyState() {
        grid().forceEditingComplete(null);
        const updates = new Map<string, Partial<ResourceRow>>(),
            value = view.state;
        // 행 ID별 변경을 모아 한 번에 적용하면 범위 편집도 한 번의 Undo로 취소할 수 있습니다.
        grid()
            .getSelectedItems()
            .forEach((cell) => {
                if (!dayFields.includes(cell.dataField)) return;
                if (!updates.has(cell.item.id)) updates.set(cell.item.id, { id: cell.item.id });
                updates.get(cell.item.id)![cell.dataField] = value;
            });
        if (updates.size) grid().updateRowsById(Array.from(updates.values()));
        view.message = updates.size
            ? updates.size + '개 자원의 선택한 날짜를 ' + value + ' 상태로 변경했습니다.'
            : '먼저 날짜 셀이나 날짜 범위를 선택하세요.';
        updateResourceCount();
        publish();
    }
    function addResource() {
        grid().forceEditingComplete(null);
        view.site = '전체';
        view.category = '전체';
        view.query = '';
        filterResources();
        grid().addRow(makeResource(nextResource++ - 1, true), 'last');
        updateResourceCount();
    }
    function removeResource() {
        grid().forceEditingComplete(null);
        grid().removeRow('selectedIndex');
        updateResourceCount();
    }
    function undoResource() {
        grid().forceEditingComplete(null);
        grid().undo();
        updateResourceCount();
    }
    // 좁은 화면에서는 고정 열을 풀어 날짜 칼럼에도 충분한 스크롤 영역을 제공합니다.
    function syncFixedColumns() {
        if (instance) grid().setFixedColumnCount(matchMedia('(max-width:760px)').matches ? 0 : 2);
    }
    function exportReport(format: 'xlsx' | 'pdf') {
        grid().forceEditingComplete(null);
        const props = { fileName: '자원운영표_2026_10' };
        if (format === 'pdf') grid().exportToPdf({ ...props, fontPath: `${baseUrl}/fonts/nyjgothic-medium.ttf` });
        else grid().exportToXlsx(props);
    }

    const columns: IGrid.Column[] = [
        {
            dataField: 'asset',
            headerText: '관리 자원',
            width: 190,
            editable: false,
            style: 'workspace-left'
        },
        { dataField: 'site', headerText: '운영 거점', width: 100, editable: false },
        {
            headerText: '월간 집계 (일)',
            children: [
                ...[
                    ['active', '가동'],
                    ['reserved', '예약'],
                    ['maintenance', '점검'],
                    ['idle', '유휴']
                ].map(([field, label]): IGrid.Column => ({
                    dataField: field,
                    headerText: label,
                    width: 48,
                    dataType: 'numeric',
                    editable: false,
                    expFunction: stateCount,
                    headerStyle: stateClasses[label]
                })),
                {
                    dataField: 'utilization',
                    headerText: '가동률',
                    width: 140,
                    dataType: 'numeric',
                    editable: false,
                    expFunction: stateCount,
                    // 계산된 0~1 비율을 막대와 백분율 텍스트로 함께 표시합니다.
                    renderer: percentageRenderer({ showBar: true, showLabel: true, precision: 0, offset: 8 })
                }
            ]
        }
    ];
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    dayFields.forEach((field, index) => {
        const day = new Date(2026, 9, index + 1).getDay();
        columns.push({
            headerText: weekdays[day],
            children: [
                {
                    dataField: field,
                    headerText: String(index + 1),
                    width: 44,
                    headerStyle: day === 0 || day === 6 ? 'resource-weekend' : '',
                    styleFunction: (row, col, value) => stateClasses[value],
                    editRenderer: { type: IGrid.RendererKind.DropDownListRenderer, list: states }
                }
            ]
        });
    });

    const columnLayout: IGrid.Column[] = columns;
    const gridProps: IGrid.Props = {
        width: '100%',
        height: 630,

        rowIdField: 'id',
        rowIdTrustMode: true,
        editable: true,
        enableUndoRedo: true,
        softRemoveRowMode: false,
        showStateColumn: true,
        showRowNumColumn: true,
        rowHeight: 28,
        headerHeight: 26,
        showFooter: true,
        enableFilter: true,
        selectionMode: 'multipleCells',
        fixedColumnCount: matchMedia('(max-width:760px)').matches ? 0 : 2
    };

    function initialize() {
        grid().setFooter([
            { positionField: 'asset', labelText: '조회 자원 일수 합계', colSpan: 2 },
            ...['active', 'reserved', 'maintenance', 'idle'].map((field): IGrid.Footer => ({
                dataField: field,
                positionField: field,
                operation: 'SUM',
                formatString: '#,##0'
            }))
        ]);
        grid().bind('cellEditEndBefore', (event: IGrid.CellEditEndBeforeEvent) =>
            dayFields.includes(event.dataField) && !states.includes(event.value) ? event.oldValue : event.value
        );
        grid().bind(['cellEditEnd', 'undoRedoChange'], () =>
            defer(() => {
                if (instance) updateResourceCount();
            })
        );
        grid().setGridData(Array.from({ length: 600 }, (_, index) => makeResource(index)));
        updateResourceCount();
    }

    // 큐에 남은 이전 편집 이벤트는 화면을 떠나거나 다시 연결하면 무시합니다.
    function defer(callback: () => void) {
        const current = generation;
        queueMicrotask(() => {
            if (instance && current === generation) callback();
        });
    }
    function setControl<K extends ControlKey>(key: K, value: DemoView[K]) {
        view[key] = value;
        if (key !== 'state') filterResources();
        publish();
    }
    function attach(api: GridPort) {
        instance = api;
        generation++;
        syncFixedColumns();
        window.addEventListener('resize', syncFixedColumns);
        initialize();
        publish();
    }
    // 인스턴스 생성/파괴는 래퍼에 맡기고 이 모델의 이벤트와 타이머만 정리합니다.
    function detach() {
        generation++;
        window.removeEventListener('resize', syncFixedColumns);
        if (instance?.isCreated()) instance.unbind(['cellEditEnd', 'cellEditEndBefore', 'undoRedoChange']);
        instance = null;
    }
    function pause() {}
    function resume() {
        if (instance?.isCreated()) instance.resize();
    }
    return {
        columnLayout,
        gridProps,
        attach,
        detach,
        pause,
        resume,
        setControl,
        applyState,
        addResource,
        removeResource,
        undoResource,
        exportReport
    };
}
