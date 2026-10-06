import * as IGrid from 'aui-grid';
import type { GridInstance } from './showcaseTypes';
// 이 데모의 행 구조와 화면 상태를 구분해 편집 값과 요약을 함께 관리합니다.
interface EnergyRow {
    id: string;
    region: string;
    name: string;
    source: string;
    siteId: string;
    metric: string;
    label: string;
    total: number;
    [field: `m${number}`]: number;
}

export const initialView = {
    region: '전체',
    source: '전체',
    period: '4',
    total: '',
    achievement: '',
    reportPeriod: '',
    count: '',
    rateOnly: false
};
export type DemoView = typeof initialView;
type ControlKey = 'region' | 'source' | 'period';
type GridPort = Pick<
    GridInstance,
    'changeColumnLayout' | 'exportToPdf' | 'exportToXlsx' | 'isCreated' | 'resize' | 'setGridData' | 'unbind'
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
    const sites = [
        {
            id: 'E01',
            name: '해남 솔라파크',
            region: '호남',
            source: '태양광',
            capacity: 12,
            target: 1450,
            ratio: 1.04
        },
        {
            id: 'E02',
            name: '영암 에너지팜',
            region: '호남',
            source: '태양광',
            capacity: 8,
            target: 960,
            ratio: 0.92
        },
        {
            id: 'E03',
            name: '신안 윈드파크',
            region: '호남',
            source: '풍력',
            capacity: 24,
            target: 4900,
            ratio: 1.08
        },
        {
            id: 'E04',
            name: '김제 솔라루프',
            region: '호남',
            source: '태양광',
            capacity: 5,
            target: 610,
            ratio: 0.98
        },
        {
            id: 'E05',
            name: '영덕 윈드힐',
            region: '영남',
            source: '풍력',
            capacity: 18,
            target: 3650,
            ratio: 0.88
        },
        {
            id: 'E06',
            name: '울산 솔라루프',
            region: '영남',
            source: '태양광',
            capacity: 6,
            target: 730,
            ratio: 1.03
        },
        {
            id: 'E07',
            name: '합천 에너지팜',
            region: '영남',
            source: '태양광',
            capacity: 9,
            target: 1100,
            ratio: 0.94
        },
        {
            id: 'E08',
            name: '태백 윈드릿지',
            region: '강원',
            source: '풍력',
            capacity: 30,
            target: 6150,
            ratio: 1.12
        },
        {
            id: 'E09',
            name: '평창 윈드밸리',
            region: '강원',
            source: '풍력',
            capacity: 16,
            target: 3280,
            ratio: 0.96
        },
        {
            id: 'E10',
            name: '원주 솔라루프',
            region: '강원',
            source: '태양광',
            capacity: 4,
            target: 490,
            ratio: 1.01
        },
        {
            id: 'E11',
            name: '제주 윈드코스트',
            region: '제주',
            source: '풍력',
            capacity: 22,
            target: 4500,
            ratio: 1.07
        },
        {
            id: 'E12',
            name: '서귀포 솔라팜',
            region: '제주',
            source: '태양광',
            capacity: 7,
            target: 850,
            ratio: 0.91
        },
        {
            id: 'E13',
            name: '군산 솔라파크',
            region: '호남',
            source: '태양광',
            capacity: 10,
            target: 1210,
            ratio: 1.02
        },
        {
            id: 'E14',
            name: '무안 에너지팜',
            region: '호남',
            source: '태양광',
            capacity: 7,
            target: 860,
            ratio: 0.97
        },
        {
            id: 'E15',
            name: '고흥 윈드베이',
            region: '호남',
            source: '풍력',
            capacity: 20,
            target: 4080,
            ratio: 1.05
        },
        {
            id: 'E16',
            name: '장흥 솔라루프',
            region: '호남',
            source: '태양광',
            capacity: 6,
            target: 740,
            ratio: 0.93
        },
        {
            id: 'E17',
            name: '포항 윈드팜',
            region: '영남',
            source: '풍력',
            capacity: 26,
            target: 5320,
            ratio: 1.09
        },
        {
            id: 'E18',
            name: '밀양 솔라파크',
            region: '영남',
            source: '태양광',
            capacity: 11,
            target: 1330,
            ratio: 0.96
        },
        {
            id: 'E19',
            name: '경주 에너지팜',
            region: '영남',
            source: '태양광',
            capacity: 8,
            target: 970,
            ratio: 1.01
        },
        {
            id: 'E20',
            name: '정선 윈드릿지',
            region: '강원',
            source: '풍력',
            capacity: 28,
            target: 5740,
            ratio: 1.06
        },
        {
            id: 'E21',
            name: '삼척 윈드밸리',
            region: '강원',
            source: '풍력',
            capacity: 18,
            target: 3670,
            ratio: 0.91
        },
        {
            id: 'E22',
            name: '횡성 솔라루프',
            region: '강원',
            source: '태양광',
            capacity: 5,
            target: 600,
            ratio: 0.99
        },
        {
            id: 'E23',
            name: '한림 윈드코스트',
            region: '제주',
            source: '풍력',
            capacity: 24,
            target: 4920,
            ratio: 1.1
        },
        {
            id: 'E24',
            name: '성산 솔라팜',
            region: '제주',
            source: '태양광',
            capacity: 9,
            target: 1080,
            ratio: 0.95
        }
    ];

    // 추가한 발전소도 기존 권역의 바로 뒤에 배치하여 세로 병합을 유지합니다.
    sites.sort(
        (a, b) =>
            ['호남', '영남', '강원', '제주'].indexOf(a.region) - ['호남', '영남', '강원', '제주'].indexOf(b.region)
    );

    let rateOnly = false;
    let firstMonth = 4;
    const numberFormat = new Intl.NumberFormat('ko-KR');
    // 월별 목표와 실적은 같은 원천 자료에서 생성하며 화면과 내보내기에 함께 사용합니다.
    function monthly(site: (typeof sites)[number], month: number) {
        const seasonal = [0.78, 0.82, 0.96, 1.05, 1.14, 1.08, 1.03, 1.02, 0.94, 0.86, 0.76, 0.72][month - 1];
        const target = Math.round(site.target * seasonal);
        // 목록 순서가 바뀌어도 기존 발전소의 실적이 달라지지 않도록 고유 번호를 사용합니다.
        const actual = Math.round(target * (site.ratio + (((month + Number(site.id.slice(1)) - 1) % 5) - 2) * 0.035));
        return { target, actual };
    }
    function valueLabel(row: number, col: number, value: number, header: string, item: EnergyRow) {
        return item.metric === 'rate' ? Number(value).toFixed(1) : numberFormat.format(value);
    }
    function valueStyle(row: number, col: number, value: number, header: string, item: EnergyRow) {
        if (item.metric === 'rate')
            return value < 95 ? 'energy-rate-low' : value < 100 ? 'energy-rate-mid' : 'energy-rate-high';
        return item.metric === 'target' ? 'energy-target-row workspace-number' : 'workspace-number';
    }
    function reportLayout(): IGrid.Column[] {
        const layout: IGrid.Column[] = [
            {
                dataField: 'region',
                headerText: '권역',
                width: '5.5%',
                minWidth: 65,
                cellMerge: true,
                style: 'energy-region'
            },
            {
                dataField: 'name',
                headerText: '발전소',
                width: '13%',
                minWidth: 145,
                cellMerge: true,
                mergePolicy: 'restrict',
                mergeRef: 'region',
                style: 'energy-site'
            },
            {
                dataField: 'label',
                headerText: '지표 / 단위',
                width: '10%',
                minWidth: 110,
                style: 'workspace-left'
            }
        ];
        // 분기 헤더 아래의 월별 칼럼을 만들고 누계는 비율 합계가 아닌 실적/목표 합계로 계산합니다.
        for (let quarter = 0; quarter < 2; quarter++) {
            const start = firstMonth + quarter * 3;
            layout.push({
                headerText: Math.ceil(start / 3) + '분기',
                children: Array.from({ length: 3 }, (_, index) => ({
                    dataField: 'm' + (start + index),
                    headerText: start + index + '월',
                    width: '10%',
                    minWidth: 78,
                    dataType: 'numeric',
                    labelFunction: valueLabel,
                    styleFunction: valueStyle
                }))
            });
        }
        layout.push({
            dataField: 'total',
            headerText: '기간 누계',
            width: '11.5%',
            minWidth: 105,
            dataType: 'numeric',
            style: 'energy-cumulative',
            labelFunction: valueLabel,
            styleFunction: valueStyle
        });
        return layout;
    }
    function refreshReport() {
        const region = view.region,
            source = view.source;
        const nextMonth = Number(view.period);
        if (nextMonth !== firstMonth) {
            firstMonth = nextMonth;
            grid().changeColumnLayout(reportLayout());
        }
        const data: EnergyRow[] = [],
            total = { actual: 0, target: 0 };
        let count = 0;
        sites.forEach((site) => {
            if ((region !== '전체' && region !== site.region) || (source !== '전체' && source !== site.source)) return;
            count++;
            const base = { region: site.region, name: site.name, source: site.source, siteId: site.id };
            const actual: EnergyRow = {
                ...base,
                id: site.id + '-actual',
                metric: 'actual',
                label: '발전량 (MWh)',
                total: 0
            };
            const target: EnergyRow = {
                ...base,
                id: site.id + '-target',
                metric: 'target',
                label: '목표 (MWh)',
                total: 0
            };
            const rate: EnergyRow = { total: 0, ...base, id: site.id + '-rate', metric: 'rate', label: '달성률 (%)' };
            for (let month = firstMonth; month < firstMonth + 6; month++) {
                const values = monthly(site, month),
                    field = `m${month}` as const;
                actual[field] = values.actual;
                target[field] = values.target;
                rate[field] = (values.actual / values.target) * 100;
                actual.total += values.actual;
                target.total += values.target;
            }
            rate.total = (actual.total / target.total) * 100;
            total.actual += actual.total;
            total.target += target.total;
            data.push(...(rateOnly ? [rate] : [actual, target, rate]));
        });
        grid().setGridData(data);
        view.total = numberFormat.format(total.actual) + ' MWh';
        view.achievement = '목표 대비 ' + (total.target ? (total.actual / total.target) * 100 : 0).toFixed(1) + '%';
        view.reportPeriod = '2026년 ' + firstMonth + '월 — ' + (firstMonth + 5) + '월 운영 보고서';
        view.count = count + '개 발전소 / ' + (rateOnly ? '달성률 비교' : '발전량, 목표, 달성률 비교');
        publish();
    }
    function setReportView(value: boolean) {
        rateOnly = value;
        view.rateOnly = value;
        refreshReport();
    }
    function exportReport(format: 'xlsx' | 'pdf') {
        const props = { fileName: '재생에너지_2026_' + firstMonth + '-' + (firstMonth + 5) };
        if (format === 'pdf') grid().exportToPdf({ ...props, fontPath: `${baseUrl}/fonts/nyjgothic-medium.ttf` });
        else grid().exportToXlsx(props);
    }

    const columnLayout: IGrid.Column[] = reportLayout();
    const gridProps: IGrid.Props = {
        width: '100%',
        height: 590,

        rowIdField: 'id',
        rowIdTrustMode: true,
        showRowNumColumn: false,
        showStateColumn: false,
        rowHeight: 28,
        headerHeight: 28,
        enableCellMerge: true,
        cellMergeRowSpan: true,
        selectionMode: 'multipleCells',
        enableSorting: false
    };

    function initialize() {
        refreshReport();
    }

    function setControl<K extends ControlKey>(key: K, value: DemoView[K]) {
        view[key] = value;
        refreshReport();
        publish();
    }
    function attach(api: GridPort) {
        instance = api;

        initialize();
        publish();
    }
    // 인스턴스 생성/파괴는 래퍼에 맡기고 이 모델의 이벤트와 타이머만 정리합니다.
    function detach() {
        instance = null;
    }
    function pause() {}
    function resume() {
        if (instance?.isCreated()) instance.resize();
    }
    return { columnLayout, gridProps, attach, detach, pause, resume, setControl, setReportView, exportReport };
}
