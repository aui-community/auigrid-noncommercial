import * as IGrid from 'aui-grid';
import type { GridInstance } from './showcaseTypes';
// 이 데모의 행 구조와 화면 상태를 구분해 편집 값과 요약을 함께 관리합니다.
interface RevisionRow {
    id: string;
    partNo: string;
    partName: string;
    attribute: string;
    before: string;
    after: string;
    difference: string;
    changed: boolean;
    reviewed: boolean;
    stripe: number;
}

export const initialView = { query: '', changesOnly: false, merge: true, status: '' };
export type DemoView = typeof initialView;
type ControlKey = 'query' | 'changesOnly' | 'merge';
type GridPort = Pick<
    GridInstance,
    | 'bind'
    | 'exportToPdf'
    | 'exportToXlsx'
    | 'getGridData'
    | 'isCreated'
    | 'resize'
    // 병합 표시 전환에서 호출하는 래퍼 메소드도 이 모델의 계약에 포함합니다.
    | 'setCellMerge'
    | 'setFilter'
    | 'setFixedColumnCount'
    | 'setGridData'
    | 'unbind'
>;

// React/Vue가 생성한 래퍼를 전달받고, 표시 상태는 프레임워크에 돌려줍니다.
export function createDemo(onChange: (view: DemoView) => void, baseUrl: string) {
    let instance: GridPort | null = null;
    const view = { ...initialView };
    function grid(): GridPort {
        if (!instance) throw new Error('그리드가 연결되지 않았습니다.');
        return instance;
    }
    function publish() {
        if (instance) onChange({ ...view });
    }

    let compact = window.innerWidth <= 700;
    const partNames = ['배터리 하우징', '냉각 플레이트', '센서 브래킷', '커넥터 커버', '모터 마운트', '차폐 패널'];
    // 부품 75개에 네 가지 변경 항목을 배치합니다. 같은 부품은 세로, 동일한 전후 값은 가로로 병합합니다.
    const revisionRows: RevisionRow[] = Array.from({ length: 75 }, (_, index) => {
        const thickness = 2 + (index % 5) * 0.5;
        const weight = 1200 + (index % 9) * 80;
        const entries = [
            [
                '재질',
                'AL 6061-T6',
                index % 3 === 0 ? 'AL 7075-T6' : 'AL 6061-T6',
                index % 3 === 0 ? '재질 변경' : '동일'
            ],
            [
                '두께',
                thickness.toFixed(1) + ' mm',
                (thickness - (index % 4 === 1 ? 0 : 0.2)).toFixed(1) + ' mm',
                index % 4 === 1 ? '동일' : '−0.2 mm'
            ],
            ['중량', weight + ' g', weight - (index % 4 === 1 ? 0 : 80) + ' g', index % 4 === 1 ? '동일' : '−80 g'],
            [
                '표면 처리',
                '아노다이징',
                index % 5 === 2 ? '전도성 피막' : '아노다이징',
                index % 5 === 2 ? '공법 변경' : '동일'
            ]
        ];
        return entries.map(([attribute, before, after, difference], offset) => ({
            id: 'PART-' + index + '-' + offset,
            partNo: 'EV-' + String(1001 + index),
            partName: partNames[index % partNames.length] + ' ' + String(Math.floor(index / 6) + 1).padStart(2, '0'),
            attribute,
            before,
            after,
            difference,
            changed: before !== after,
            reviewed: false,
            stripe: index % 2
        }));
    }).flat();
    // 필터는 제품의 원본 데이터에 적용하므로 검토 상태가 검색과 필터 전환 후에도 유지됩니다.
    function filterRevisions() {
        const query = view.query.trim().toLowerCase();
        const changesOnly = view.changesOnly;
        grid().setFilter(
            'partNo',
            (field, value, item) =>
                (!changesOnly || item.changed) && (item.partNo + ' ' + item.partName).toLowerCase().includes(query)
        );
        updateRevisionStatus();
    }
    function updateRevisionStatus() {
        const rows = grid().getGridData() as RevisionRow[];
        const changes = rows.filter((item) => item.changed);
        view.status =
            '조회 ' +
            new Set(rows.map((item) => item.partNo)).size +
            '개 부품 / ' +
            rows.length +
            '개 항목 / 변경 ' +
            changes.length +
            '건 중 검토 완료 ' +
            changes.filter((item) => item.reviewed).length +
            '건';
        publish();
    }
    function resizeComparison() {
        const next = window.innerWidth <= 700;
        if (!instance || compact === next) return;
        compact = next;
        grid().setFixedColumnCount(compact ? 0 : 2);
    }
    function exportReport(format: 'xlsx' | 'pdf') {
        const props = {
            fileName: '설계_변경_대조표',
            headers: [{ text: '설계 변경 대조표 / REV. A → REV. B', height: 28 }]
        };
        if (format === 'pdf') grid().exportToPdf({ ...props, fontPath: `${baseUrl}/fonts/nyjgothic-medium.ttf` });
        else grid().exportToXlsx(props);
    }

    const columns: IGrid.Column[] = [
        {
            headerText: '부품 정보',
            children: [
                {
                    dataField: 'partNo',
                    headerText: '부품 번호',
                    width: 112,
                    cellMerge: true,
                    style: 'revision-part-no',
                    editable: false
                },
                {
                    dataField: 'partName',
                    headerText: '부품명',
                    width: 154,
                    cellMerge: true,
                    mergeRef: 'partNo',
                    mergePolicy: 'restrict',
                    style: 'revision-part-name',
                    editable: false
                }
            ]
        },
        {
            dataField: 'attribute',
            headerText: '비교 항목',
            width: 96,
            editable: false,
            style: 'revision-attribute'
        },
        {
            dataField: 'before',
            headerText: 'REV. A / 변경 전',
            minWidth: 168,
            cellColMerge: true,
            cellColSpan: 2,
            editable: false,
            headerStyle: 'revision-before-header',
            styleFunction: (row, col, value, header, item) => (item.changed ? 'revision-before' : 'revision-same')
        },
        {
            dataField: 'after',
            headerText: 'REV. B / 변경 후',
            minWidth: 168,
            editable: false,
            headerStyle: 'revision-after-header',
            styleFunction: (row, col, value, header, item) => (item.changed ? 'revision-after' : 'revision-same')
        },
        {
            dataField: 'difference',
            headerText: '변경 내용',
            width: 104,
            editable: false,
            styleFunction: (row, col, value, header, item) => (item.changed ? 'revision-difference' : 'revision-same')
        },
        {
            dataField: 'reviewed',
            headerText: '검토',
            width: 64,
            renderer: {
                type: IGrid.RendererKind.CheckBoxEditRenderer,
                editable: true,
                visibleFunction: (row, col, value, checked, item) => item.changed,
                checkableFunction: (row, col, value, checked, item) => item.changed
            },
            labelFunction: (row, col, value, header, item) => (item.changed ? (value ? '완료' : '대기') : '—')
        }
    ];

    const columnLayout: IGrid.Column[] = columns;
    const gridProps: IGrid.Props = {
        width: '100%',
        height: 710,

        rowIdField: 'id',
        rowIdTrustMode: true,
        rowHeight: 34,
        headerHeight: 29,
        showRowNumColumn: false,
        showStateColumn: false,
        editable: true,
        enableClipboard: false,
        enableSorting: false,
        enableFilter: true,
        enableCellMerge: true,
        cellMergeRowSpan: true,
        fixedColumnCount: compact ? 0 : 2,
        selectionMode: 'multipleCells',
        rowStyleFunction: (row, item) => (item.stripe ? 'revision-alternate' : 'revision-base')
    };

    function initialize() {
        // 체크의 실행 취소와 다시 실행도 하단 검토 건수에 함께 반영합니다.
        grid().bind(['cellEditEnd', 'filtering', 'undoRedoChange'], updateRevisionStatus);
        grid().setGridData(revisionRows);
        updateRevisionStatus();
    }

    function setControl<K extends ControlKey>(key: K, value: DemoView[K]) {
        view[key] = value;
        if (key === 'merge') grid().setCellMerge(view.merge);
        else filterRevisions();
        publish();
    }
    function attach(api: GridPort) {
        instance = api;
        resizeComparison();
        window.addEventListener('resize', resizeComparison);
        initialize();
        publish();
    }
    // 인스턴스 생성/파괴는 래퍼에 맡기고 이 모델의 이벤트와 타이머만 정리합니다.
    function detach() {
        window.removeEventListener('resize', resizeComparison);
        if (instance?.isCreated()) instance.unbind(['cellEditEnd', 'filtering', 'undoRedoChange']);
        instance = null;
    }
    function pause() {}
    function resume() {
        if (instance?.isCreated()) instance.resize();
    }
    return { columnLayout, gridProps, attach, detach, pause, resume, setControl, exportReport };
}
