<script setup>
// 현재 WebDemo 쇼케이스 9을 Vue 샘플 8번으로 제공합니다.
import AUIGrid from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
import { ref, computed, watch, nextTick, onMounted, onActivated, onDeactivated, onBeforeUnmount } from 'vue';
import 'file-saver';
import '@/static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import './Showcase08.css';
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
// 데이터의 문자가 셀 안에서 HTML 태그로 해석되지 않게 합니다.
function escapeText(value) {
    return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
// 하위 칼럼은 남은 폭을 25%씩 나누고, 좁은 화면에서도 최소 66px을 유지합니다.
// 전체 펼치기에서는 applyRestPercentWidth로 상위 칼럼의 고정 폭을 제외합니다.
const columnLayout = [{
        dataField: 'project', headerText: '프로젝트', bodyCell: true, width: 215,
        style: 'sc-project-cell',
        renderer: {
            type: 'TemplateRenderer',
            // 화면의 번호, 프로젝트명과 ID를 Excel 및 PDF에서는 두 줄의 텍스트로 표시합니다.
            aliasFunction: function (row, col, value, header, item) {
                return item.code + ' ' + value + '\n' + item.id;
            }
        },
        labelFunction: function (row, col, value, header, item) {
            return '<div class="sc-project-label"><span class="sc-project-icon">' + escapeText(item.code) + '</span><span><b>' + escapeText(value) + '</b><small>' + escapeText(item.id) + '</small></span></div>';
        },
        children: [{
                dataField: 'client', headerText: '고객사', bodyCell: true, width: 145, style: 'sc-client-cell',
                children: [
                    { dataField: 'owner', headerText: '담당자', width: '25%', minWidth: 66 },
                    { dataField: 'due', headerText: '목표일', width: '25%', minWidth: 66, dataType: 'date', dateInputFormat: 'yyyy-mm-dd', formatString: 'mm/dd' }
                ]
            }, {
                dataField: 'status', headerText: '진행 상태', bodyCell: true, width: 110,
                renderer: { type: 'TemplateRenderer' },
                labelFunction: function (row, col, value) {
                    const kind = value === '완료' ? 'done' : value === '검토중' ? 'review' : '';
                    return '<span class="sc-status ' + kind + '">' + escapeText(value) + '</span>';
                },
                children: [{
                        dataField: 'progress', headerText: '진행률', width: '25%', minWidth: 66, dataType: 'numeric',
                        renderer: { type: 'TemplateRenderer' },
                        labelFunction: function (row, col, value) {
                            const percent = Math.max(0, Math.min(100, Number(value) || 0));
                            return '<div class="sc-progress"><div class="sc-progress-track"><i style="width:' + percent + '%"></i></div><span>' + percent + '%</span></div>';
                        }
                    }, {
                        dataField: 'budget', headerText: '예산(백만)', width: '25%', minWidth: 66, dataType: 'numeric', formatString: '#,##0'
                    }]
            }]
    }];
const gridProps = {
    bodyLayoutMode: 'band', rowHeight: 122, headerHeight: 28, showRowNumColumn: false,
    rowIdField: 'id', selectionMode: 'singleRow', enableSorting: true, applyRestPercentWidth: true,
    showStateColumn: false,
    width: '100%', height: 430
};
const modeNames = { band: '밴드형', flat: '일반형', flatAll: '전체 펼치기' };
const modeHints = {
    band: '프로젝트와 고객 정보를 위아래로 쌓아 한눈에.',
    flat: '담당자, 일정, 진행률, 예산을 간결하게 비교.',
    flatAll: '상위 필드까지 모두 펼쳐 가로로 비교.'
};
const modes = ['band', 'flat', 'flatAll'];
const myGrid = ref(null);
const description = ref(null);
const availableWidth = ref(1200);
// null이면 화면 전체 폭을 사용하며, 직접 선택한 폭은 화면 안에서 유지합니다.
const requestedWidth = ref(null);
const automatic = ref(true);
const manualMode = ref('band');
const width = computed(() => Math.min(requestedWidth.value ?? availableWidth.value, availableWidth.value));
const mode = computed(() => automatic.value
    ? (width.value < 600 ? 'band' : width.value < 920 ? 'flat' : 'flatAll') : manualMode.value);
let observer = null;
let resizeFrame = 0;
let inputFrame = 0;
let active = false;
const controller = new AbortController();
// 메뉴 복귀 시 현재 화면 크기를 다시 측정합니다.
function observeWidth() {
    active = true;
    if (observer)
        return;
    const measure = () => {
        const available = Math.floor(description.value?.clientWidth ?? 0);
        if (available > 0)
            availableWidth.value = available;
        nextTick(applyLayout);
    };
    observer = new ResizeObserver(() => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(measure);
    });
    if (description.value)
        observer.observe(description.value);
    measure();
}
function stopObserving() {
    active = false;
    observer?.disconnect();
    observer = null;
    cancelAnimationFrame(resizeFrame);
    cancelAnimationFrame(inputFrame);
}
// 슬라이더의 폭이 반영되면 표시 구조를 전환하고 그리드의 크기를 갱신합니다.
function applyLayout() {
    const grid = myGrid.value;
    if (!active || !grid || !width.value)
        return;
    if (grid.getProp('bodyLayoutMode') !== mode.value) {
        grid.setProp({ bodyLayoutMode: mode.value, rowHeight: mode.value === 'band' ? 122 : 52 });
        grid.refresh();
    }
    grid.resize();
}
function changeWidth(event) {
    const value = Number(event.target.value);
    cancelAnimationFrame(inputFrame);
    inputFrame = requestAnimationFrame(() => {
        requestedWidth.value = value === availableWidth.value ? null : value;
        automatic.value = true;
    });
}
function changeLayout(value) {
    manualMode.value = value;
    automatic.value = false;
}
function toggleAutomatic() {
    manualMode.value = mode.value;
    automatic.value = !automatic.value;
}
async function loadProjects() {
    const grid = myGrid.value;
    grid.showAjaxLoader();
    try {
        const response = await fetch(`${baseUrl}/data/showcase8.json`, { signal: controller.signal });
        if (!response.ok)
            throw new Error('데이터 요청 실패');
        const rows = await response.json();
        if (controller.signal.aborted)
            return;
        grid.setGridData(rows);
    }
    catch (error) {
        if (!controller.signal.aborted)
            alert('프로젝트 데이터를 불러오지 못했습니다. 페이지를 새로고침해 주세요.');
    }
    finally {
        if (!controller.signal.aborted)
            grid.removeAjaxLoader();
    }
}
function exportExcel() {
    myGrid.value?.exportToXlsx({ fileName: '프로젝트_현황', sheetName: '프로젝트 현황' });
}
function exportPdf() {
    // 프로젝트명과 ID가 두 줄로 들어가는 전체 펼치기에서는 PDF 행 높이를 지정합니다.
    myGrid.value?.exportToPdf({ fileName: '프로젝트_현황', fontPath: `${baseUrl}/fonts/nyjgothic-medium.ttf`,
        orientation: 'landscape', ...(mode.value === 'flatAll' ? { rowHeight: 52 } : {}) });
}
watch([mode, width], applyLayout, { flush: 'post' });
onMounted(() => { observeWidth(); loadProjects(); });
onActivated(observeWidth);
onDeactivated(stopObserving);
// KeepAlive 비활성화는 관찰만 중지하고, 실제 종료일 때 데이터 요청도 취소합니다.
onBeforeUnmount(() => { controller.abort(); stopObserving(); });
</script>

<template>
    <div>
        <div class="desc" ref="description">
            <p>슬라이더로 폭을 줄이거나 넓혀 반응형 레이아웃을 확인해 보세요.</p>
            <p>좁은 화면은 밴드형, 중간 화면은 일반형, 넓은 화면은 전체 펼치기로 실시간 전환됩니다.</p>
            <div class="showcase8-width">
                <label for="showcase8-width">그리드 폭</label>
                <input id="showcase8-width" type="range" :min="Math.min(320, availableWidth)" :max="availableWidth" step="1" :value="width" @input="changeWidth" />
                <output for="showcase8-width">{{ width }} px</output>
            </div>
            <p class="showcase8-controls">
                <button v-for="value in modes" :key="value" :aria-pressed="mode === value" @click="changeLayout(value)">{{ modeNames[value] }}</button>
                <button :aria-pressed="automatic" @click="toggleAutomatic">화면에 맞게</button>
            </p>
            <p class="showcase8-controls"><button @click="exportExcel">Excel 내보내기</button><button @click="exportPdf">PDF 내보내기</button></p>
            <p>{{ modeHints[mode] }} ({{ automatic ? '자동 전환' : '직접 선택' }} / {{ modeNames[mode] }})</p>
        </div>
        <div class="showcase8-preview" :style="{ maxWidth: width + 'px' }">
            <AUIGrid ref="myGrid" name="showcase8" :gridProps="gridProps" :columnLayout="columnLayout" :autoResize="false" />
        </div>
    </div>
</template>
