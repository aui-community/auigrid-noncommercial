<script setup lang="ts">
import { ref, computed, onMounted, onActivated, nextTick, watch } from 'vue';
import * as IGrid from 'aui-grid';
import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
import MyCalendarRenderer from '@/renderers/MyCalendarRenderer';
import 'file-saver';
import '@/static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import './Showcase08.css';

// 하위 경로에 배포해도 공개 폴더의 한글 폰트를 찾을 수 있게 합니다.
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

type CalendarWeek = ({ date: number; value: number; dateLabel: string; isToday: boolean } | null)[];

// 날짜 비교의 기준은 화면을 연 시점의 오늘입니다.
const today = new Date();
// 표시 월의 주별 데이터를 생성합니다. 앞쪽 빈 셀과 마지막 주의 길이를 유지합니다.
function genGridData(inputDate: Date): CalendarWeek[] {
    const year = inputDate.getFullYear();
    const month = inputDate.getMonth();
    const startWeekday = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const weeks: CalendarWeek[] = [];
    let week: CalendarWeek = [];
    for (let i = 0; i < startWeekday; i++) week.push(null);
    for (let day = 1; day <= totalDays; day++) {
        // 월을 다시 방문해도 같은 예제 값을 보여주도록 날짜로 값을 계산합니다.
        week.push({
            date: day,
            value: (year * 13 + month * 31 + day * 47) % 101,
            dateLabel: `${year}년 ${month + 1}월 ${day}일`,
            isToday: year === today.getFullYear() && month === today.getMonth() && day === today.getDate()
        });
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    }
    if (week.length > 0) weeks.push(week);
    return weeks;
}

// 모든 요일에 같은 렌더러를 적용하고 좁은 화면의 읽기 폭을 유지합니다.
const columnLayout: IGrid.Column[] = ['일', '월', '화', '수', '목', '금', '토'].map((day, index): IGrid.Column => ({
    dataField: String(index),
    headerText: day,
    minWidth: 72,
    style: index === 0 ? 'my-sunday-style' : index === 6 ? 'my-saturday-style' : '',
    headerStyle: index === 0 ? 'my-sunday-style' : index === 6 ? 'my-saturday-style' : '',
    renderer: {
        type: IGrid.RendererKind.CustomRenderer,
        jsClass: MyCalendarRenderer,
        // 화면의 날짜/막대 객체를 파일에서는 날짜와 목표 달성률 두 줄로 표시합니다.
        aliasFunction: function (rowIndex, columnIndex, value) {
            return value ? value.dateLabel + '\n목표 달성률: ' + value.value + '%' : '';
        }
    }
}));

// 주 수에 따라 높이를 자동으로 조절하여 마지막 주가 잘리지 않게 합니다.
const gridProps: IGrid.Props = {
    width: '100%',
    height: 540,
    selectionMode: 'none',
    enableSorting: false,
    showRowNumColumn: false,
    enableColumnResize: false,
    rowHeight: 112,
    headerHeight: 36,
    autoGridHeight: true
};

const myGrid = ref<InstanceType<typeof AUIGrid> | null>(null);
const originDate = ref(new Date(today.getFullYear(), today.getMonth(), 1));
const formatOriginDate = computed(() => `${originDate.value.getFullYear()}년 ${originDate.value.getMonth() + 1}월`);

// 월 상태 변경은 데이터만 갱신하고 그리드 생성과 정리는 래퍼에 맡깁니다.
function loadGridData() {
    myGrid.value?.setGridData(genGridData(originDate.value));
}
// 항상 1일을 기준으로 이동하여 월말에도 다음 달을 건너뛰지 않습니다.
function changeData(direction: number) {
    originDate.value = new Date(originDate.value.getFullYear(), originDate.value.getMonth() + direction, 1);
}
function goToThisMonth() {
    originDate.value = new Date(today.getFullYear(), today.getMonth(), 1);
}
// 현재 보고 있는 월의 요일 배치와 빈 날짜를 유지하여 Excel로 저장합니다.
function exportClick() {
    var month = originDate.value.getFullYear() + '년 ' + (originDate.value.getMonth() + 1) + '월';
    myGrid.value?.exportToXlsx({
        fileName: '일별_목표치_달성률_' + month,
        sheetName: month,
        rowHeight: 64,
        headers: [
            {
                text: month + ' 일별 목표치 달성률',
                height: 32,
                style: { fontSize: 16, textAlign: 'center', fontWeight: 'bold' }
            }
        ],
        useExportStyle: true,
        exportStyle: {
            'my-sunday-style': { color: '#dc5262' },
            'my-saturday-style': { color: '#2563eb' }
        }
    });
}

// 6주인 달도 한 페이지에서 읽을 수 있도록 가로 용지와 두 줄 셀 높이를 지정합니다.
function exportPdfClick() {
    var month = originDate.value.getFullYear() + '년 ' + (originDate.value.getMonth() + 1) + '월';
    myGrid.value?.exportToPdf({
        fileName: '일별_목표치_달성률_' + month,
        fontPath: baseUrl + '/fonts/nyjgothic-medium.ttf',
        layout: 'landscape',
        rowHeight: 80,
        fontSize: 12,
        headers: [
            {
                text: month + ' 일별 목표치 달성률',
                height: 32,
                style: { fontSize: 16, textAlign: 'center', fontWeight: 'bold' }
            }
        ],
        useExportStyle: true,
        exportStyle: {
            'my-sunday-style': { color: '#dc5262' },
            'my-saturday-style': { color: '#2563eb' }
        }
    });
}

onMounted(loadGridData);
// 캐시된 달력으로 돌아오면 현재 화면 폭에 맞춥니다.
onActivated(() => nextTick(() => myGrid.value?.resize()));
watch(originDate, loadGridData);
</script>
<template>
    <div class="showcase-calendar">
        <div class="calendar-heading">
            <p>한 달의 성과를 달력으로 살펴보세요. 날짜마다 목표 달성률을 숫자와 막대로 표시합니다.</p>
            <p>그리드에 출력되는 셀은 사용자 정의 렌더러(CustomRenderer)를 사용하였습니다.</p>
            <p>이와 같이 사용자가 원하는 셀 형식을 자바스크립트로 작성할 수 있습니다.</p>
        </div>
        <div class="calendar-export">
            <button type="button" class="btn" @click="exportClick">엑셀(xlsx)로 저장</button>
            <button type="button" class="btn" @click="exportPdfClick">PDF로 저장</button>
        </div>
        <section class="calendar-card" aria-label="월별 목표 달성률 달력">
            <div class="calendar-toolbar">
                <div class="calendar-month">
                    <button type="button" class="calendar-nav" @click="changeData(-1)" aria-label="이전 달">
                        &#8249;
                    </button>
                    <h2 class="calendar-date" aria-live="polite">{{ formatOriginDate }}</h2>
                    <button type="button" class="calendar-nav" @click="changeData(1)" aria-label="다음 달">
                        &#8250;
                    </button>
                    <button type="button" class="calendar-nav" @click="goToThisMonth()">이번 달</button>
                </div>
                <div class="calendar-legend" aria-label="목표 달성률 색상 범례">
                    <span><i class="legend-dot" style="--goal-color: #df6474"></i>20% 미만</span>
                    <span><i class="legend-dot" style="--goal-color: #b88026"></i>20~49%</span>
                    <span><i class="legend-dot" style="--goal-color: #4b85ce"></i>50~74%</span>
                    <span><i class="legend-dot" style="--goal-color: #299579"></i>75% 이상</span>
                </div>
            </div>
            <!-- 그리드가 날짜와 사용자 정의 렌더러를 배치합니다. -->
            <div class="calendar-grid">
                <AUIGrid name="showcase8" ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" />
            </div>
        </section>
    </div>
</template>
