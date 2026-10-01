<script setup lang="ts">
import { ref, nextTick, onMounted, onActivated, onBeforeUnmount } from 'vue';
import * as IGrid from 'aui-grid';
import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
// 파일 저장 도구와 PDF 출력 도구를 이 샘플에서도 직접 불러옵니다.
import 'file-saver';
import '@/static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import './SampleBandBody.css';

const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

// 레이아웃 모드는 aui-grid의 공식 속성 타입에서 가져옵니다.
type LayoutMode = NonNullable<IGrid.Props['bodyLayoutMode']>;
type BodyField = 'team' | 'position' | 'checked';

// WebDemo와 같은 계층을 사용하고 bodyCell의 초기값은 명시적으로 지정합니다.
const columnLayout: IGrid.Column[] = [
    {
        dataField: "id",
        headerText: "ID",
        width: 70,
        editable: false
    },
    {
        dataField: "team",
        headerText: "소속",
        bodyCell: true,
        style: "band-basic-team",
        children: [
            {
                dataField: "name",
                headerText: "이름",
                width: 130,
            },
            {
                dataField: "position",
                headerText: "직급",
                bodyCell: true,
                children: [
                    {
                        dataField: "age",
                        headerText: "나이",
                        width: 70,
                        dataType: "numeric",
                    },
                    {
                        dataField: "birth",
                        headerText: "생년월일",
                        width: 120,
                        dataType: "date",
                        dateInputFormat: "yyyy-mm-dd",
                        formatString: "yyyy/mm/dd"
                    }
                ]
            }
        ]
    },
    {
        // 확인은 출력용 상위 셀입니다. 자식 수량과 금액은 아래쪽에 나란히 표시합니다.
        dataField: "checked",
        headerText: "확인",
        bodyCell: true,
        editable: false,
        renderer: { type: IGrid.RendererKind.CheckBoxEditRenderer },
        children: [
            {
                dataField: "qty",
                headerText: "수량",
                width: 95,
                dataType: "numeric"
            },
            {
                dataField: "amount",
                headerText: "금액",
                width: 120,
                dataType: "numeric",
                formatString: "#,##0",
                style: "band-basic-number"
            }
        ]
    }
];

const gridProps: IGrid.Props = {
    width: '100%', height: 480,
    bodyLayoutMode: 'band', rowHeight: 120,
    editable: true, selectionMode: 'multipleCells'
};
const bodyFields: { field: BodyField; label: string }[] = [
    { field: 'team', label: '소속' },
    { field: 'position', label: '직급' },
    { field: 'checked', label: '확인' }
];

type GridInstance = InstanceType<typeof AUIGrid>;
const myGrid = ref<GridInstance | null>(null);
const mode = ref<LayoutMode>('band');
const bodyCells = ref({ team: true, position: true, checked: true });
const controller = new AbortController();

// WebDemo의 정적 JSON을 사용하고 실제 화면 종료 후 도착한 응답은 적용하지 않습니다.
async function requestGridData() {
    const grid = myGrid.value!;
    grid.showAjaxLoader();
    try {
        const response = await fetch(`${baseUrl}/data/band_body.json`, { signal: controller.signal });
        if (!response.ok) throw new Error('데이터 요청 실패');
        const rows = await response.json();
        if (!controller.signal.aborted) grid.setGridData(rows);
    } catch (error) {
        if (!controller.signal.aborted) alert('데이터를 불러오지 못했습니다. 페이지를 새로고침해 주세요.');
    } finally {
        if (!controller.signal.aborted) grid.removeAjaxLoader();
    }
}
// 입력값을 먼저 읽고 상위 칼럼의 바디 표시 여부만 변경합니다.
function changeBodyCell(field: BodyField, event: Event) {
    const show = (event.target as HTMLInputElement).checked;
    const props: IGrid.Column = { bodyCell: show };
    myGrid.value?.setColumnPropByDataField(field, props);
    myGrid.value?.refresh();
    bodyCells.value[field] = show;
}
// 데이터와 체크 상태를 보존하고 레이아웃 모드 및 행 높이만 변경합니다.
function changeBodyMode(value: LayoutMode) {
    myGrid.value?.setProp({ bodyLayoutMode: value, rowHeight: value === 'band' ? 120 : 30 });
    myGrid.value?.refresh();
    mode.value = value;
}
// 현재 레이아웃, 편집한 데이터와 셀 스타일을 그대로 Excel로 내보냅니다.
function exportExcel() {
    myGrid.value?.exportToXlsx({
        fileName: '밴드형_바디_레이아웃',
        sheetName: '밴드형 바디 레이아웃',
        exportWithStyle: true
    });
}
// 한글 글꼴과 가로 용지를 사용하여 현재 레이아웃을 PDF로 내보냅니다.
function exportPdf() {
    myGrid.value?.exportToPdf({
        fileName: '밴드형_바디_레이아웃',
        fontPath: `${baseUrl}/fonts/nyjgothic-medium.ttf`,
        orientation: 'landscape'
    });
}
onMounted(requestGridData);
// KeepAlive로 보관된 화면은 다시 로드하지 않고 현재 컨테이너 크기에 맞춥니다.
onActivated(() => nextTick(() => myGrid.value?.resize()));
onBeforeUnmount(() => controller.abort());
</script>

<template>
    <div>
        <div class="desc">
            <p>한 행의 데이터를 그룹형 헤더에서 정의한 구조대로 바디에도 표현합니다.</p>
            <p>bodyLayoutMode: "band"와 원하는 rowHeight를 설정합니다. 이 데모의 행 높이는 120입니다.</p>
            <p>그룹형 헤더 칼럼에 dataField와 bodyCell: true를 지정하면 해당 값을 상위 바디 셀에 표시합니다.</p>
            <p>밴드형에서 체크를 해제하면 해당 상위 바디 셀만 숨깁니다. 전체 칼럼 보기에서는 bodyCell 설정과 관계없이 표시합니다.</p>
            <p class="band-basic-controls"><strong>상위 바디 셀 표시: </strong>
                <label v-for="{ field, label } in bodyFields" :key="field">
                    <input type="checkbox" :checked="bodyCells[field]" :disabled="mode !== 'band'" @change="changeBodyCell(field, $event)" /> {{ label }}
                </label>
            </p>
            <p>setProp()으로 bodyLayoutMode를 바꾸고 refresh()로 적용합니다. 행 높이는 별도로 설정합니다.</p>
            <p class="band-basic-modes">
                <button :aria-pressed="mode === 'flat'" @click="changeBodyMode('flat')">기본(flat) 보기</button>
                <button :aria-pressed="mode === 'band'" @click="changeBodyMode('band')">밴드형(band) 보기</button>
                <button :aria-pressed="mode === 'flatAll'" @click="changeBodyMode('flatAll')">전체 칼럼 펼쳐서(flatAll) 보기</button>
            </p>
            <p class="band-basic-exports">
                <button @click="exportExcel">Excel 내보내기</button>
                <button @click="exportPdf">PDF 내보내기</button>
            </p>
        </div>
        <AUIGrid ref="myGrid" name="band-basic" :gridProps="gridProps" :columnLayout="columnLayout" />
    </div>
</template>
