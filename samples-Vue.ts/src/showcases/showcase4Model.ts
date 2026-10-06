import * as IGrid from 'aui-grid';
import type { GridInstance } from './showcaseTypes';
import { percentageRenderer } from './showcaseTypes';
// 이 데모의 행 구조와 화면 상태를 구분해 편집 값과 요약을 함께 관리합니다.
type ServiceUpdate = {
    id: string;
    requests: number;
    latency: number;
    cpu: number;
    errorRate: number;
    status: string;
    updatedAt: string;
    [field: `sample${number}`]: number;
};
type ServiceRow = ServiceUpdate & { name: string; region: string };

export const initialView = {
    traffic: 'normal',
    interval: '1000',
    healthy: 0,
    total: '/ 24',
    requests: '',
    latency: '',
    attention: 0,
    attentionActive: 'false',
    updated: '24개 서비스 모니터링',
    time: '',
    dateTime: '',
    state: '실시간 수신 중',
    paused: 'false',
    toggle: '일시정지',
    stepDisabled: true
};
export type DemoView = typeof initialView;
type ControlKey = 'traffic' | 'interval';
type GridPort = Pick<GridInstance, 'isCreated' | 'refreshRows' | 'resize' | 'setGridData' | 'unbind'>;

// React/Vue가 생성한 래퍼를 전달받고, 표시 상태는 프레임워크에 돌려줍니다.
export function createDemo(onChange: (view: DemoView) => void, _baseUrl: string) {
    let instance: GridPort | null = null;
    const view = { ...initialView };
    function grid(): GridPort {
        if (!instance) throw new Error('그리드가 연결되지 않았습니다.');
        return instance;
    }
    function publish() {
        if (instance) onChange({ ...view });
    }
    // 외부 서버 없이 가상 운영 지표를 생성합니다. 최초 데이터 입력 후에는 refreshRows로 일부 행만 갱신합니다.

    let timerId: ReturnType<typeof setInterval> | null = null;
    let isRunning = true;
    let disposed = false;
    let active = true;
    let nextRow = 0;
    let sampleNumber = 0;
    let services: ServiceRow[] = [];
    const historyFields = Array.from({ length: 12 }, (_, index) => `sample${index}` as const);
    const numberFormat = new Intl.NumberFormat('ko-KR');
    const serviceDefinitions = [
        { id: 'gateway', name: 'API 게이트웨이', region: '서울', requests: 8200, latency: 42, cpu: 0.42 },
        { id: 'auth', name: '회원 인증', region: '서울', requests: 2100, latency: 68, cpu: 0.36 },
        { id: 'catalog', name: '상품 조회', region: '서울', requests: 4600, latency: 95, cpu: 0.51 },
        { id: 'search', name: '상품 검색', region: '서울', requests: 1800, latency: 185, cpu: 0.68 },
        { id: 'cart', name: '장바구니', region: '서울', requests: 980, latency: 54, cpu: 0.31 },
        { id: 'orders', name: '주문 접수', region: '서울', requests: 620, latency: 128, cpu: 0.48 },
        { id: 'payment', name: '결제 승인', region: '부산', requests: 480, latency: 265, cpu: 0.62 },
        { id: 'stock', name: '재고 조회', region: '부산', requests: 1650, latency: 82, cpu: 0.58 },
        { id: 'delivery', name: '배송 추적', region: '부산', requests: 540, latency: 116, cpu: 0.4 },
        { id: 'notify', name: '알림 발송', region: '부산', requests: 760, latency: 74, cpu: 0.44 },
        { id: 'media', name: '이미지 처리', region: '부산', requests: 980, latency: 218, cpu: 0.77 },
        { id: 'logs', name: '로그 수집', region: '부산', requests: 3100, latency: 38, cpu: 0.53 },
        { id: 'recommend', name: '상품 추천', region: '서울', requests: 1350, latency: 174, cpu: 0.64 },
        { id: 'pricing', name: '가격 계산', region: '서울', requests: 880, latency: 64, cpu: 0.38 },
        { id: 'coupon', name: '쿠폰 적용', region: '서울', requests: 510, latency: 76, cpu: 0.34 },
        { id: 'reviews', name: '구매 후기', region: '서울', requests: 930, latency: 91, cpu: 0.42 },
        { id: 'wishlist', name: '관심 상품', region: '서울', requests: 720, latency: 49, cpu: 0.29 },
        { id: 'sessions', name: '세션 관리', region: '서울', requests: 2800, latency: 31, cpu: 0.55 },
        { id: 'settlement', name: '정산 처리', region: '부산', requests: 320, latency: 198, cpu: 0.61 },
        { id: 'returns', name: '반품 접수', region: '부산', requests: 180, latency: 105, cpu: 0.32 },
        { id: 'tracking', name: '운송장 발급', region: '부산', requests: 440, latency: 144, cpu: 0.47 },
        { id: 'analytics', name: '방문 분석', region: '부산', requests: 4200, latency: 67, cpu: 0.72 },
        { id: 'cdn', name: '정적 자원 전달', region: '부산', requests: 6900, latency: 24, cpu: 0.46 },
        { id: 'audit', name: '감사 이벤트', region: '부산', requests: 1560, latency: 58, cpu: 0.41 }
    ];
    const statusLabels: Record<string, string> = { healthy: '정상', watch: '주의', delayed: '지연' };

    // 요청량, 응답 시간과 자원 사용률이 함께 변하도록 모의 부하를 계산합니다.
    function sampleService(index: number, now: Date) {
        const definition = serviceDefinitions[index];
        const peak = view.traffic === 'peak';
        const wave = Math.sin(sampleNumber * 0.55 + index * 0.9);
        const load = 1 + wave * 0.14 + (Math.random() - 0.5) * 0.08;
        const requests = Math.max(1, Math.round(definition.requests * load * (peak ? 1.65 : 1)));
        const latency = Math.round(definition.latency * (1 + wave * 0.2) * (peak ? 2.1 : 1));
        const cpu = Number(Math.min(0.99, Math.max(0.05, definition.cpu + wave * 0.07 + (peak ? 0.23 : 0))).toFixed(3));
        const errorRate = Number(Math.max(0, 0.0015 + wave * 0.0012 + (peak ? 0.008 : 0)).toFixed(4));
        const status =
            latency >= 500 || cpu >= 0.9 || errorRate >= 0.012
                ? 'delayed'
                : latency >= 220 || cpu >= 0.75 || errorRate >= 0.006
                  ? 'watch'
                  : 'healthy';
        return { requests, latency, cpu, errorRate, status, updatedAt: formatTime(now) };
    }

    // 매번 서로 다른 네 서비스만 선택합니다. 정렬하거나 행을 선택해도 고유 ID로 같은 행을 갱신합니다.
    function refreshRows() {
        if (disposed || !instance) return;
        const now = new Date();
        sampleNumber++;
        const updates: ServiceUpdate[] = [];
        for (let offset = 0; offset < 4; offset++) {
            const index = (nextRow + offset) % services.length;
            const previous = services[index];
            const update: ServiceUpdate = { id: previous.id, ...sampleService(index, now) };
            historyFields.forEach((field, point) => {
                update[field] =
                    point === historyFields.length - 1 ? update.requests : previous[historyFields[point + 1]];
            });
            services[index] = { ...previous, ...update };
            updates.push(update);
        }
        nextRow = (nextRow + updates.length) % services.length;
        const flashStyle = matchMedia('(prefers-reduced-motion: reduce)').matches ? '' : 'live-cell-update';
        grid().refreshRows(updates, flashStyle, 420);
        updateSummary(now, updates.length);
    }

    // 요약도 마지막으로 수신한 행 값으로 계산합니다. 평균 응답은 요청량으로 가중합니다.
    function updateSummary(now: Date, changedCount: number) {
        const requests = services.reduce((sum, row) => sum + row.requests, 0);
        const latency = services.reduce((sum, row) => sum + row.requests * row.latency, 0) / requests;
        const healthy = services.filter((row) => row.status === 'healthy').length;
        view.healthy = healthy;
        view.total = '/ ' + services.length;
        view.requests = numberFormat.format(requests);
        view.latency = numberFormat.format(Math.round(latency));
        view.attention = services.length - healthy;
        view.attentionActive = String(healthy < services.length);
        view.updated = changedCount ? changedCount + '개 서비스 갱신' : services.length + '개 서비스 모니터링';

        view.time = formatTime(now);
        view.dateTime = now.toISOString();
        publish();
    }

    function formatTime(date: Date) {
        // 로케일의 시/분/초 표기 차이 없이 수신 시각의 너비를 일정하게 유지합니다.
        return [date.getHours(), date.getMinutes(), date.getSeconds()]
            .map((value) => String(value).padStart(2, '0'))
            .join(':');
    }

    function createColumnLayout(): IGrid.Column[] {
        // 비율 너비와 최소 너비를 함께 지정해 데스크톱과 모바일을 같은 칼럼으로 구성합니다.
        return [
            { dataField: 'name', headerText: '서비스', width: '17%', minWidth: 158, style: 'live-service' },
            { dataField: 'region', headerText: '리전', width: '7%', minWidth: 66 },
            {
                dataField: 'status',
                headerText: '상태',
                width: '8%',
                minWidth: 88,
                renderer: { type: IGrid.RendererKind.TemplateRenderer },
                // 상태 값은 위에서 정의한 세 가지 코드만 사용하며 서버 HTML을 그대로 삽입하지 않습니다.
                labelFunction: (rowIndex, columnIndex, value) =>
                    '<span class="live-badge live-badge--' + value + '">' + statusLabels[value] + '</span>'
            },
            {
                dataField: 'requests',
                headerText: '요청/초',
                width: '9%',
                minWidth: 92,
                dataType: 'numeric',
                formatString: '#,##0',
                style: 'live-number'
            },
            {
                dataField: 'latency',
                headerText: '응답 시간(ms)',
                width: '10%',
                minWidth: 104,
                dataType: 'numeric',
                formatString: '#,##0',
                style: 'live-number',
                styleFunction: (rowIndex, columnIndex, value) =>
                    value >= 500
                        ? 'live-number live-delayed'
                        : value >= 220
                          ? 'live-number live-warning'
                          : 'live-number'
            },
            {
                dataField: 'errorRate',
                headerText: '오류율',
                width: '8%',
                minWidth: 84,
                dataType: 'numeric',
                style: 'live-number',
                renderer: percentageRenderer({ showBar: false, precision: 2 })
            },
            {
                dataField: 'cpu',
                headerText: 'CPU 사용률',
                width: '14%',
                minWidth: 142,
                dataType: 'numeric',
                renderer: percentageRenderer({
                    offset: 10,
                    styleRange: [
                        { '0.75': 'live-cpu-normal' },
                        { '0.9': 'live-cpu-watch' },
                        { '1': 'live-cpu-delayed' }
                    ]
                })
            },
            {
                dataField: historyFields.join(','),
                headerText: '요청 추이',
                width: '16%',
                minWidth: 138,
                sortable: false,
                renderer: {
                    type: IGrid.RendererKind.SparkLineRenderer,
                    lineColor: '#3982ba',
                    lineWidth: 2,
                    markFirstValue: false,
                    markMinValue: false,
                    markMaxValue: false,
                    markLastValue: true,
                    lastColor: '#206bab',
                    height: 24
                }
            },
            { dataField: 'updatedAt', headerText: '수신 시각', width: '11%', minWidth: 90 }
        ];
    }

    // 주기 변경, 재개와 탭 복귀는 한 경로를 사용해 타이머가 중복 생성되지 않게 합니다.
    function stopTimer() {
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
        }
    }
    function syncTimer() {
        stopTimer();
        if (disposed || !active) return;
        if (isRunning && !document.hidden) timerId = setInterval(refreshRows, Number(view.interval));

        view.state = !isRunning ? '일시정지' : document.hidden ? '백그라운드 대기' : '실시간 수신 중';
        view.paused = String(!isRunning || document.hidden);
        view.toggle = isRunning ? '일시정지' : '실시간 재개';
        view.stepDisabled = isRunning;
        publish();
    }
    function toggleUpdates() {
        isRunning = !isRunning;
        syncTimer();
    }

    const columnLayout: IGrid.Column[] = createColumnLayout();
    const gridProps: IGrid.Props = {
        width: '100%',
        height: 510,

        rowIdField: 'id',
        rowHeight: 38,
        headerHeight: 36,
        showRowNumColumn: false,
        fixedColumnCount: 1,
        selectionMode: 'singleRow',
        enableSorting: true
    };

    function initialize() {
        const now = new Date();
        services = serviceDefinitions.map((definition, index) => {
            const row: ServiceRow = {
                id: definition.id,
                name: definition.name,
                region: definition.region,
                ...sampleService(index, now)
            };
            historyFields.forEach((field, point) => {
                row[field] = Math.round(definition.requests * (0.9 + Math.sin(point * 0.55 + index) * 0.13));
            });
            row[historyFields[historyFields.length - 1]] = row.requests;
            return row;
        });
        // 데모의 상태와 그리드에 전달하는 객체를 분리해 공개 갱신 메소드만으로 화면을 변경합니다.
        grid().setGridData(services.map((row) => ({ ...row })));
        updateSummary(now, 0);

        syncTimer();
    }

    function setControl<K extends ControlKey>(key: K, value: DemoView[K]) {
        view[key] = value;
        if (key === 'interval') syncTimer();
        else if (isRunning) refreshRows();
        publish();
    }
    function attach(api: GridPort) {
        instance = api;
        disposed = false;
        active = true;
        document.addEventListener('visibilitychange', syncTimer);
        initialize();
        publish();
    }
    // 인스턴스 생성/파괴는 래퍼에 맡기고 이 모델의 이벤트와 타이머만 정리합니다.
    function detach() {
        disposed = true;
        stopTimer();
        document.removeEventListener('visibilitychange', syncTimer);
        instance = null;
    }
    function pause() {
        active = false;
        stopTimer();
    }
    function resume() {
        active = true;
        if (instance) {
            instance.resize();
            syncTimer();
        }
    }
    return { columnLayout, gridProps, attach, detach, pause, resume, setControl, toggleUpdates, refreshRows };
}
