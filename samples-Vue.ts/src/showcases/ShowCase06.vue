<script setup lang="ts">
import { ref, shallowRef, onMounted, onBeforeUnmount, onActivated, onDeactivated, nextTick } from 'vue';
import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
import 'file-saver';
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import { createDemo, initialView } from './showcase6Model';
import './showcase-workspaces.css';
import './showcase-grid-features.css';

// public 자원은 Vite 배포 경로를 기준으로 읽습니다.
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

const myGrid = ref<InstanceType<typeof AUIGrid> | null>(null);
const view = shallowRef(initialView);
// 화면은 Vue 상태로 갱신하고 칼럼 및 데이터 처리는 별도 모델에 모읍니다.
const demo = createDemo((value) => {
    view.value = value;
}, baseUrl);
onMounted(() => demo.attach(myGrid.value!));
// KeepAlive에서도 숨겨진 화면의 갱신을 멈추고 복귀한 그리드 크기를 다시 계산합니다.
onDeactivated(() => demo.pause());
onActivated(() => nextTick(() => demo.resume()));
onBeforeUnmount(() => demo.detach());
</script>
<template>
    <div class="workspace-demo grid-feature-showcase revision-showcase">
        <div class="workspace-heading">
            <div>
                <h2>설계 변경 전후 대조표</h2>
                <p>부품은 세로로 묶고, 바뀌지 않은 값은 가로로 합쳐 변경 지점만 선명하게 보여줍니다.</p>
            </div>
            <span class="feature-volume">75개 부품 / 300개 비교 항목</span>
        </div>
        <div class="workspace-toolbar">
            <div class="workspace-controls">
                <input
                    id="revision-search"
                    class="workspace-search"
                    type="search"
                    placeholder="부품 번호 또는 이름 검색"
                    aria-label="부품 검색"
                    :value="view.query"
                    @input="demo.setControl('query', ($event.target as HTMLInputElement).value)"
                />
                <label
                    ><input
                        id="changes-only"
                        type="checkbox"
                        :checked="view.changesOnly"
                        @change="demo.setControl('changesOnly', ($event.target as HTMLInputElement).checked)"
                    />
                    변경 항목만</label
                >
                <label
                    ><input
                        id="merge-cells"
                        type="checkbox"
                        :checked="view.merge"
                        @change="demo.setControl('merge', ($event.target as HTMLInputElement).checked)"
                    />
                    셀 병합</label
                >
            </div>
            <div class="workspace-controls">
                <button type="button" class="btn" @click="demo.exportReport('xlsx')">Excel 내보내기</button>
                <button type="button" class="btn" @click="demo.exportReport('pdf')">PDF 내보내기</button>
            </div>
        </div>
        <div class="comparison-caption">
            <span>가로 및 세로 병합 / 조건부 서식 / 필터 / 체크박스</span
            ><span class="revision-legend"
                ><i class="revision-before-key"></i>변경 전<i class="revision-after-key"></i>변경 후</span
            >
        </div>
        <div class="showcase-grid">
            <AUIGrid ref="myGrid" name="showcase6" :columnLayout="demo.columnLayout" :gridProps="demo.gridProps" />
        </div>
        <div class="workspace-note">
            <span id="revision-status" role="status">{{ view.status }}</span
            ><span>가상의 설계 변경 자료입니다. 검토 체크는 현재 페이지에서만 유지됩니다.</span>
        </div>
    </div>
</template>
