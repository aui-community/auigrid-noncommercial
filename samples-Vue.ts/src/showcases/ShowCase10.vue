<script setup lang="ts">
import { ref, nextTick, onMounted, onActivated, onBeforeUnmount } from 'vue';
import * as IGrid from 'aui-grid';
import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
import 'file-saver';
import '@/static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import './Showcase10.css';
import './showcase-options.css';

// 현재 WebDemo와 같은 순번인 쇼케이스 10을 Vue 샘플로 제공합니다.
type GridInstance = InstanceType<typeof AUIGrid>;
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

// 레이아웃 모드는 aui-grid의 공식 속성 타입에서 가져옵니다.
type LayoutMode = NonNullable<IGrid.Props['bodyLayoutMode']>;

// 데이터의 문자가 셀 안에서 HTML 태그로 해석되지 않게 합니다.
function escapeText(value: unknown) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// 현재 WebDemo의 칼럼 정의를 세 레이아웃에서 함께 사용합니다.
const columnLayout: IGrid.Column[] = [
    // 발주 라인은 행의 고유 ID이므로 편집하지 않습니다.
    { dataField: 'lineId', headerText: '발주 라인', width: 150, editable: false },
    {
        dataField: 'supplier',
        headerText: '공급사',
        bodyCell: true,
        bodyCellHeight: 30,
        width: 150,
        style: 'po-supplier',
        // editRenderer는 더블클릭하거나 F2를 누를 때 열립니다. 상위 셀에도 지정할 수 있습니다.
        editRenderer: {
            type: IGrid.EditRendererKind.DropDownListRenderer,
            list: ['(주)대성정밀', '한빛전자(주)', '우진패키징(주)', '세림모션', '이음테크', '한결소재']
        },
        children: [
            {
                dataField: 'material',
                headerText: '자재명',
                width: 140,
                editRenderer: { type: IGrid.EditRendererKind.InputEditRenderer, maxlength: 50 }
            },
            {
                dataField: 'category',
                headerText: '자재 분류',
                bodyCell: true,
                bodyCellHeight: 30,
                width: 115,
                // renderer는 셀에 항상 표시됩니다. 목록을 눌러 바로 값을 바꿉니다.
                renderer: {
                    type: IGrid.RendererKind.DropDownListRenderer,
                    list: ['기구 부품', '체결류', '전자 부품', '센서', '포장재', '구동 부품']
                },
                children: [
                    {
                        dataField: 'spec',
                        headerText: '규격',
                        width: 130,
                        editRenderer: { type: IGrid.EditRendererKind.InputEditRenderer, maxlength: 80 }
                    },
                    {
                        dataField: 'due',
                        headerText: '납기 요청일',
                        width: 105,
                        dataType: 'date',
                        dateInputFormat: 'yyyy-mm-dd',
                        formatString: 'yyyy/mm/dd',
                        // 달력에서 고른 날짜는 JSON과 같은 형식으로 저장합니다.
                        editRenderer: {
                            type: IGrid.EditRendererKind.CalendarRenderer,
                            defaultFormat: 'yyyy-mm-dd',
                            onlyCalendar: true
                        }
                    }
                ]
            }
        ]
    },
    {
        dataField: 'confirmed',
        headerText: '발주',
        bodyCell: true,
        bodyCellHeight: 30,
        width: 85,
        // 그리드의 기본 체크박스로 값을 변경합니다.
        renderer: { type: IGrid.RendererKind.CheckBoxEditRenderer, editable: true },
        // 파일에는 체크 상태를 읽기 쉬운 텍스트로 표시합니다.
        labelFunction: function (row, col, value) {
            return value ? '확정' : '미확정';
        },
        children: [
            {
                dataField: 'orderQty',
                headerText: '발주 수량',
                width: 90,
                dataType: 'numeric',
                formatString: '#,##0',
                renderer: { type: IGrid.RendererKind.NumberStepRenderer, min: 0, max: 1000000, step: 1 }
            },
            {
                dataField: 'orderAmount',
                headerText: '발주 금액',
                width: 115,
                dataType: 'numeric',
                formatString: '#,##0',
                style: 'po-number',
                editable: false,
                // 수량을 편집하면 단가를 곱한 금액과 푸터 합계도 함께 갱신됩니다.
                expFunction: function (row, col, item) {
                    return item.orderQty * item.unitPrice;
                }
            }
        ]
    },
    {
        dataField: 'receipt',
        headerText: '입고',
        bodyCell: true,
        bodyCellHeight: 30,
        width: 110,
        editable: false,
        renderer: {
            type: IGrid.RendererKind.ButtonRenderer,
            disabledFunction: function (row, col, value, item) {
                return item.receivedQty === 0;
            },
            // 모달 대신 클릭한 발주 라인을 간단히 알립니다.
            onClick: function (event) {
                alert(event.item.lineId + ' 입고 전표 클릭');
            }
        },
        labelFunction: function (row, col, value) {
            return value ? '입고 전표' : '미입고';
        },
        children: [
            {
                dataField: 'receivedQty',
                headerText: '입고 수량',
                width: 90,
                dataType: 'numeric',
                formatString: '#,##0',
                // 수량은 셀에 표시된 숫자 입력과 증감 버튼으로 바로 변경합니다.
                renderer: { type: IGrid.RendererKind.NumberStepRenderer, min: 0, max: 1000000, step: 1 }
            },
            {
                dataField: 'receivedAmount',
                headerText: '입고 금액',
                width: 115,
                dataType: 'numeric',
                formatString: '#,##0',
                style: 'po-number',
                editable: false,
                expFunction: function (row, col, item) {
                    return item.receivedQty * item.unitPrice;
                }
            }
        ]
    },
    {
        dataField: 'inspection',
        headerText: '검수',
        bodyCell: true,
        bodyCellHeight: 30,
        width: 85,
        renderer: { type: IGrid.RendererKind.TemplateRenderer },
        // 평소에는 배지로 표시하고 편집 시에는 선택 목록을 엽니다.
        editRenderer: { type: IGrid.EditRendererKind.DropDownListRenderer, list: ['합격', '보류', '대기'] },
        labelFunction: function (row, col, value) {
            const color = value === '합격' ? 'pass' : value === '보류' ? 'hold' : 'wait';
            return '<span class="po-badge ' + color + '">' + escapeText(value) + '</span>';
        },
        children: [
            {
                dataField: 'passedQty',
                headerText: '합격 수량',
                width: 90,
                dataType: 'numeric',
                formatString: '#,##0',
                renderer: { type: IGrid.RendererKind.NumberStepRenderer, min: 0, max: 1000000, step: 1 },
                styleFunction: function (row, col, value, header, item) {
                    return value < item.receivedQty ? 'po-shortage' : '';
                }
            },
            {
                dataField: 'passedAmount',
                headerText: '합격 금액',
                width: 115,
                dataType: 'numeric',
                formatString: '#,##0',
                style: 'po-number',
                editable: false,
                expFunction: function (row, col, item) {
                    return item.passedQty * item.unitPrice;
                }
            }
        ]
    }
];

const gridProps: IGrid.Props = {
    bodyLayoutMode: 'band',
    rowHeight: 90,
    headerHeight: 28,
    rowIdField: 'lineId',
    rowIdTrustMode: true,
    selectionMode: 'singleRow',
    enableSorting: true,
    editable: true,
    editBeginMode: 'doubleClick',
    showFooter: true,
    footerHeight: 32,
    showStateColumn: false,
    width: '100%',
    height: 570
};

// 공식 푸터 타입으로 합계 항목을 만들며, 수량 편집 시 금액 식과 합계도 함께 갱신됩니다.
const footerLayout: IGrid.Footer[] = [
    { positionField: 'lineId', labelText: '조회 합계' },
    ...['orderQty', 'orderAmount', 'receivedQty', 'receivedAmount', 'passedQty', 'passedAmount'].map<IGrid.Footer>(
        (field) => ({
            positionField: field,
            dataField: field,
            operation: 'SUM',
            formatString: '#,##0'
        })
    )
];

const myGrid = ref<GridInstance | null>(null);
const mode = ref<LayoutMode>('band');
const controller = new AbortController();

// 체크 상태가 실제로 변경된 뒤 해당 발주 라인과 결과만 알립니다.
function onCellEditEnd(event: IGrid.CellEditEndEvent) {
    if (event.dataField === 'confirmed') alert(event.item.lineId + ' 발주 체크 ' + (event.value ? '설정' : '해제'));
}
async function loadOrders() {
    const grid = myGrid.value!;
    grid.showAjaxLoader();
    try {
        const response = await fetch(`${baseUrl}/data/showcase10.json`, { signal: controller.signal });
        if (!response.ok) throw new Error('데이터 요청 실패');
        const rows = await response.json();
        if (!controller.signal.aborted) grid.setGridData(rows);
    } catch (error) {
        if (!controller.signal.aborted) alert('발주 데이터를 불러오지 못했습니다. 페이지를 새로고침해 주세요.');
    } finally {
        if (!controller.signal.aborted) grid.removeAjaxLoader();
    }
}
// 같은 그리드의 표시 구조만 바꾸므로 편집한 값과 정렬이 유지됩니다.
function changeLayout(value: LayoutMode) {
    myGrid.value?.setProp({ bodyLayoutMode: value, rowHeight: value === 'band' ? 90 : 36 });
    myGrid.value?.refresh();
    mode.value = value;
}
function exportExcel() {
    myGrid.value?.exportToXlsx({ fileName: '자재_발주_입고_검수', sheetName: '자재 구매 현황', exportWithStyle: true });
}
function exportPdf() {
    myGrid.value?.exportToPdf({
        fileName: '자재_발주_입고_검수',
        fontPath: `${baseUrl}/fonts/nyjgothic-medium.ttf`,
        orientation: 'landscape'
    });
}
onMounted(loadOrders);
// 캐시된 화면으로 돌아오면 부모의 현재 폭에 맞춰 다시 배치합니다.
onActivated(() => nextTick(() => myGrid.value?.resize()));
onBeforeUnmount(() => controller.abort());
</script>

<template>
    <div>
        <div class="desc">
            <p>
                <strong>자재 발주 및 입고 검수 관리</strong> — 발주부터 입고와 검수까지, 자재 구매 현황을 한 행에서
                확인합니다.
            </p>
            <p>
                목록과 숫자 증감 버튼을 직접 조작하거나, 셀을 더블클릭하여 드롭다운과 달력 등 다양한 편집기를 사용해
                보세요.
            </p>
            <div class="demo-options">
                <div class="demo-option-row demo-option-row--split">
                    <div class="demo-option-group">
                        <span class="demo-option-label">레이아웃</span>
                        <div class="demo-segments" role="group" aria-label="그리드 레이아웃">
                            <button
                                type="button"
                                class="btn"
                                :aria-pressed="mode === 'band'"
                                @click="changeLayout('band')"
                            >
                                밴드형 보기
                            </button>
                            <button
                                type="button"
                                class="btn"
                                :aria-pressed="mode === 'flat'"
                                @click="changeLayout('flat')"
                            >
                                일반형 보기
                            </button>
                            <button
                                type="button"
                                class="btn"
                                :aria-pressed="mode === 'flatAll'"
                                @click="changeLayout('flatAll')"
                            >
                                전체 펼치기
                            </button>
                        </div>
                    </div>
                    <div class="demo-option-group" role="group" aria-label="내보내기">
                        <button type="button" class="btn" @click="exportExcel">Excel 내보내기</button
                        ><button type="button" class="btn" @click="exportPdf">PDF 내보내기</button>
                    </div>
                </div>
            </div>
        </div>
        <AUIGrid
            ref="myGrid"
            name="showcase10"
            :gridProps="gridProps"
            :columnLayout="columnLayout"
            :footerLayout="footerLayout"
            @cellEditEnd="onCellEditEnd"
        />
    </div>
</template>
