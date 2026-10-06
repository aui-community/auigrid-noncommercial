<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onActivated, onBeforeUnmount, onDeactivated } from 'vue';
import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
import 'file-saver';
import '@/static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import { createPurchaseDemo, filters, gridProps, initialView } from './purchaseDemo';
import './Showcase07.css';
import './showcase-options.css';

type GridInstance = InstanceType<typeof AUIGrid>;
var myGrid = ref<GridInstance | null>(null);
var dialog = ref<HTMLDialogElement | null>(null);
var view = ref(initialView);
var demo = createPurchaseDemo(
    function (value) {
        view.value = value;
    },
    import.meta.env.BASE_URL.replace(/\/$/, '')
);
onMounted(function () {
    demo.attach(myGrid.value!);
});
// 캐시된 화면으로 돌아오면 현재 폭에 맞추되 데이터와 결재 상태는 유지합니다.
onActivated(function () {
    nextTick(function () {
        myGrid.value?.resize();
    });
});
onBeforeUnmount(function () {
    demo.detach();
});
onDeactivated(function () {
    dialog.value?.close();
    demo.closeDialog();
});
// DOM 반영을 기다리는 동안 창이 닫혔다면 이전 내용을 다시 열지 않습니다.
watch(
    function () {
        return view.value.dialog;
    },
    async function (detail) {
        await nextTick();
        if (view.value.dialog !== detail) return;
        if (detail && !dialog.value?.open) dialog.value?.showModal();
        else if (!detail && dialog.value?.open) dialog.value.close();
    }
);
function actOnDialog(action: string) {
    dialog.value?.close();
    demo.actOnDialog(action);
}
</script>

<template>
    <div class="showcase7-demo">
        <div class="desc">
            <p>
                밴드형 바디 레이아웃과 사용자 정의 렌더러(CustomRenderer)로 요청자, 결재 단계, 첨부파일과 납기 상태를
                표시합니다.
            </p>
            <p>헤더를 눌러 정렬하고 필터 아이콘으로 검색할 수 있습니다.</p>
            <div class="demo-options">
                <div class="demo-option-row demo-option-row--split">
                    <div class="demo-option-group">
                        <label
                            ><span class="demo-option-label">진행 상태</span
                            ><select id="showcase7-status" v-model="view.status" @change="demo.setStatus(view.status)">
                                <option v-for="filter in filters" :key="filter.value" :value="filter.value">
                                    {{ filter.label }}
                                </option>
                            </select></label
                        >
                        <label
                            ><span class="demo-option-label">셀 배치</span
                            ><select id="showcase7-layout" v-model="view.mode" @change="demo.setLayout(view.mode)">
                                <option value="band">밴드형</option>
                                <option value="flatAll">일반형</option>
                            </select></label
                        >
                        <button type="button" class="btn" @click="demo.clearGridView">정렬 및 필터 해제</button>
                    </div>
                    <div class="demo-option-group" role="group" aria-label="내보내기">
                        <button type="button" class="btn" :disabled="!view.count" @click="demo.exportExcel">
                            엑셀(xlsx)로 저장
                        </button>
                        <button type="button" class="btn" :disabled="!view.count" @click="demo.exportPdf">
                            PDF로 저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div><AUIGrid ref="myGrid" name="showcase7" :gridProps="gridProps" :columnLayout="demo.columns" /></div>
        <div class="desc_bottom">
            <div class="purchase-summary">
                <div class="purchase-legend" aria-label="결재 단계 안내">
                    <span><span class="purchase-legend-marker" data-state="done" aria-hidden="true">✓</span>완료</span>
                    <span
                        ><span class="purchase-legend-marker" data-state="current" aria-hidden="true"></span>현재
                        단계</span
                    >
                    <span
                        ><span class="purchase-legend-marker" data-state="rejected" aria-hidden="true">!</span
                        >반려</span
                    >
                    <span><span class="purchase-legend-marker" aria-hidden="true"></span>대기</span>
                </div>
                <span class="purchase-layout-note">일반형과 밴드형에 같은 렌더러를 사용합니다.</span>
            </div>
            <p aria-live="polite">
                {{ filters.find((filter) => filter.value === view.status)?.label }} {{ view.count }}건 /
                {{ view.total }}건
            </p>
        </div>
        <dialog
            ref="dialog"
            class="request-dialog"
            :aria-label="view.dialog?.title || '구매 요청 상세'"
            @cancel="demo.closeDialog"
            @close="demo.closeDialog"
        >
            <template v-if="view.dialog">
                <p>
                    <strong>{{ view.dialog.title }}</strong>
                </p>
                <div>
                    <button
                        v-for="(file, value) in view.dialog.files"
                        :key="file.name"
                        type="button"
                        class="btn"
                        @click="demo.handleAction({ id: view.dialog.id, action: 'file', value: value })"
                    >
                        {{ file.name }}
                    </button>
                    <p v-for="[name, value] in view.dialog.facts" :key="name">{{ name }} : {{ value }}</p>
                </div>
                <p style="text-align: right">
                    <button
                        type="button"
                        class="btn"
                        :hidden="!view.dialog.editable"
                        :disabled="view.dialog.completed || view.dialog.rejected"
                        @click="actOnDialog('reject')"
                    >
                        반려 처리
                    </button>
                    <button
                        type="button"
                        class="btn"
                        :hidden="!view.dialog.editable"
                        :disabled="view.dialog.completed"
                        @click="actOnDialog('advance')"
                    >
                        {{ view.dialog.advanceLabel }}
                    </button>
                    <button type="button" class="btn" @click="demo.closeDialog">닫기</button>
                </p>
            </template>
        </dialog>
    </div>
</template>
