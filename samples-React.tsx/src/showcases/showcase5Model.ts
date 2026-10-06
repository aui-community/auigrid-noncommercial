import * as IGrid from 'aui-grid';
import type { GridInstance } from './showcaseTypes';
// 이 데모의 행 구조와 화면 상태를 구분해 편집 값과 요약을 함께 관리합니다.
type ModelField = 'aster' | 'orbit' | 'pico' | 'nova';
type BenchmarkRow = {
    id: string;
    category: string;
    metric: string;
    hint: string;
    unit: string;
    precision: number;
    direction: string;
} & Record<ModelField, number | null>;

export const initialView = { aster: true, orbit: true, pico: true, nova: true, status: '18개 지표 / 4개 모델 비교' };
export type DemoView = typeof initialView;
type ControlKey = 'aster' | 'orbit' | 'pico' | 'nova';
type GridPort = Pick<
    GridInstance,
    | 'exportToPdf'
    | 'exportToXlsx'
    | 'getProp'
    | 'hideColumnByDataField'
    | 'isCreated'
    | 'refresh'
    | 'resize'
    | 'setFixedColumnCount'
    | 'setGridData'
    | 'showColumnByDataField'
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
    const models: { field: ModelField; name: string; family: string }[] = [
        { field: 'aster', name: 'ASTER 32B', family: '균형형' },
        { field: 'orbit', name: 'ORBIT 70B', family: '고성능' },
        { field: 'pico', name: 'PICO 8B', family: '경량형' },
        { field: 'nova', name: 'NOVA 14B', family: '효율형' }
    ];
    let visibleModels = models.map((model) => model.field);
    // 서로 다른 단위를 갖는 지표를 행에 배치합니다. 모델과 수치는 실제 제품과 무관한 가상 자료입니다.
    const measurements: [string, string, string, string, number, string, ...(number | null)[]][] = [
        ['품질', '한국어 이해', '문맥 및 의도 파악', '점', 1, 'high', 92.4, 95.1, 83.2, 88.7],
        ['품질', '복합 추론', '여러 단계의 문제 해결', '점', 1, 'high', 86.8, 93.6, 74.5, 84.2],
        ['품질', '코드 생성', '테스트 통과 기준', '점', 1, 'high', 88.2, 94.3, 80.1, 87.5],
        ['품질', '문서 검색 답변', '제공한 근거와의 일치', '점', 1, 'high', 94.2, 93.8, 86.3, 91.7],
        ['품질', '구조화 출력', 'JSON 스키마 준수', '%', 1, 'high', 99.2, 99.6, 96.8, 99.2],
        ['품질', '지시 준수', '요청한 형식과 제약 준수', '점', 1, 'high', 91.5, 94.7, 85.1, 90.8],
        ['응답 성능', '첫 토큰 지연', '응답 시작까지 대기', 'ms', 0, 'low', 320, 580, 140, 210],
        ['응답 성능', '출력 속도', '초당 생성 토큰', 'tok/s', 0, 'high', 78, 42, 146, 112],
        ['응답 성능', '전체 응답 시간', '500 토큰 출력 기준', '초', 1, 'low', 6.7, 12.5, 3.6, 4.7],
        ['응답 성능', '동시 처리', '동일 장비의 동시 요청', '건', 0, 'high', 24, 12, 64, 40],
        ['운영 비용', '입력 단가', '100만 토큰당 비용', '원', 0, 'low', 850, 2100, 180, 420],
        ['운영 비용', '출력 단가', '100만 토큰당 비용', '원', 0, 'low', 1700, 4200, 360, 840],
        ['운영 비용', '월 예상 비용', '동일한 요청량 기준', '만원', 0, 'low', 184, 462, 42, 91],
        ['배포 환경', 'GPU 메모리', '추론 서버 필요 용량', 'GB', 0, 'low', 48, 96, 16, 24],
        ['배포 환경', '컨텍스트 길이', '한 번에 처리할 토큰', 'K', 0, 'high', 128, 128, 32, 64],
        ['배포 환경', '최대 출력', '요청당 최대 출력 토큰', 'K', 0, 'high', 16, 16, 8, 16],
        ['배포 환경', '모델 로딩', '추론 준비 시간', '초', 0, 'low', 24, 51, 8, 14],
        ['배포 환경', '추가 학습', '학습 소요 시간', '시간', 1, 'low', 3.8, null, 1.1, 2.2]
    ];
    const benchmarkRows: BenchmarkRow[] = measurements.map(
        ([category, metric, hint, unit, precision, direction, ...values], index) => ({
            id: 'METRIC-' + index,
            category,
            metric,
            hint,
            unit,
            precision,
            direction,
            aster: values[0],
            orbit: values[1],
            pico: values[2],
            nova: values[3]
        })
    );
    function escapeText(value: unknown) {
        return String(value).replace(
            /[&<>"']/g,
            (char) =>
                (({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }) as Record<string, string>)[
                    char
                ]
        );
    }
    function formatMetric(value: number | null, item: BenchmarkRow) {
        return value == null
            ? '미측정'
            : value.toLocaleString('ko-KR', {
                  minimumFractionDigits: item.precision,
                  maximumFractionDigits: item.precision
              });
    }
    // 현재 보이는 모델끼리만 비교하며 미측정은 제외하고 동점은 함께 강조합니다.
    function isBest(value: number | null, item: BenchmarkRow) {
        if (value == null) return false;
        const values = visibleModels.map((field) => item[field]).filter((number): number is number => number != null);
        return value === (item.direction === 'high' ? Math.max(...values) : Math.min(...values));
    }
    // 평가 지표의 보조 설명은 화면 템플릿과 파일 출력에서 같은 문구를 사용합니다.
    function metricDescription(item: BenchmarkRow) {
        return item.hint + ' / ' + (item.direction === 'high' ? '높을수록 좋음' : '낮을수록 좋음');
    }
    // 화면에 보이는 수치, 단위와 최고값 표시만 텍스트로 내보냅니다.
    // 숨겨진 모델을 제외한 비교 기준은 화면과 동일하게 isBest를 사용합니다.
    function modelAlias(value: number | null, item: BenchmarkRow) {
        return (
            formatMetric(value, item) + (value == null ? '' : ' ' + item.unit) + (isBest(value, item) ? '  최고' : '')
        );
    }
    function modelColumn(model: (typeof models)[number]): IGrid.Column {
        return {
            dataField: model.field,
            headerText: model.name,
            minWidth: 160,
            headerStyle: 'benchmark-model-header',
            style: 'benchmark-score',
            styleFunction: (row, col, value, header, item) =>
                isBest(value, item) ? 'benchmark-best' : 'benchmark-score',
            renderer: {
                type: IGrid.RendererKind.TemplateRenderer,
                aliasFunction: (row, col, value, header, item) => modelAlias(value, item)
            },
            labelFunction: (row, col, value, header, item) => {
                const best = isBest(value, item);
                return (
                    '<div class="benchmark-value"><strong>' +
                    formatMetric(value, item) +
                    (value == null ? '' : '<span>' + escapeText(item.unit) + '</span>') +
                    '</strong><small>' +
                    (best ? '최고' : value == null ? '—' : '비교') +
                    '</small></div>'
                );
            }
        };
    }
    function changeModels(field: ModelField, checked: boolean) {
        const selected = models
            .filter((model) => (model.field === field ? checked : view[model.field]))
            .map((model) => model.field);
        if (selected.length < 2) {
            view[field] = true;
            view.status = '비교할 모델을 2개 이상 선택하세요.';
            publish();
            return;
        }
        view[field] = checked;
        visibleModels = selected;
        models.forEach((model) => {
            if (visibleModels.includes(model.field)) grid().showColumnByDataField(model.field);
            else grid().hideColumnByDataField(model.field);
        });
        grid().refresh();
        view.status = '18개 지표 / ' + visibleModels.length + '개 모델 비교';
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
            fileName: 'AI_모델_벤치마크',
            headers: [{ text: 'AI 모델 벤치마크 비교 (가상 데이터)', height: 28 }]
        };
        if (format === 'pdf')
            // 지표 이름과 보조 설명 두 줄이 잘리지 않도록 화면의 행 높이를 적용합니다.
            grid().exportToPdf({
                ...props,
                rowHeight: grid().getProp('rowHeight'),
                fontPath: `${baseUrl}/fonts/nyjgothic-medium.ttf`
            });
        else grid().exportToXlsx(props);
    }

    const columns: IGrid.Column[] = [
        {
            dataField: 'category',
            headerText: '평가 영역',
            width: 94,
            cellMerge: true,
            style: 'benchmark-category'
        },
        {
            dataField: 'metric',
            headerText: '평가 지표',
            width: 210,
            style: 'benchmark-metric',
            renderer: {
                type: IGrid.RendererKind.TemplateRenderer,
                // HTML의 두 줄 구성을 개행으로 옮겨 Excel과 PDF에도 지표 설명을 함께 기록합니다.
                aliasFunction: (row, col, value, header, item) => value + '\n' + metricDescription(item)
            },
            labelFunction: (row, col, value, header, item) =>
                '<div class="benchmark-metric-text"><strong>' +
                escapeText(value) +
                '</strong><small>' +
                escapeText(metricDescription(item)) +
                '</small></div>'
        },
        ...models.map((model) => ({
            headerText: model.family,
            headerStyle: 'benchmark-family-header',
            children: [modelColumn(model)]
        }))
    ];

    const columnLayout: IGrid.Column[] = columns;
    const gridProps: IGrid.Props = {
        width: '100%',
        height: 710,

        rowIdField: 'id',
        rowIdTrustMode: true,
        rowHeight: 54,
        headerHeights: [28, 42],
        showRowNumColumn: false,
        showStateColumn: false,
        enableCellMerge: true,
        enableSorting: false,
        fixedColumnCount: compact ? 0 : 2,
        selectionMode: 'multipleCells'
    };

    function initialize() {
        grid().setGridData(benchmarkRows);
    }

    function setControl<K extends ControlKey>(key: K, value: DemoView[K]) {
        view[key] = value;
        changeModels(key, Boolean(value));
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
        instance = null;
    }
    function pause() {}
    function resume() {
        if (instance?.isCreated()) instance.resize();
    }
    return { columnLayout, gridProps, attach, detach, pause, resume, setControl, exportReport };
}
