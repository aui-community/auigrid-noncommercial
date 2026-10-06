<script setup>
import { ref, shallowRef, onMounted, onBeforeUnmount, onActivated, onDeactivated, nextTick } from 'vue';
import AUIGrid from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
import 'file-saver';
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import { createDemo, initialView } from './showcase5Model';
import './showcase-workspaces.css';
import './showcase-grid-features.css';

// public 자원은 Vite 배포 경로를 기준으로 읽습니다.
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

const myGrid = ref(null);
const view = shallowRef(initialView);
// 화면은 Vue 상태로 갱신하고 칼럼 및 데이터 처리는 별도 모델에 모읍니다.
const demo = createDemo((value) => {
    view.value = value;
}, baseUrl);
onMounted(() => demo.attach(myGrid.value));
// KeepAlive에서도 숨겨진 화면의 갱신을 멈추고 복귀한 그리드 크기를 다시 계산합니다.
onDeactivated(() => demo.pause());
onActivated(() => nextTick(() => demo.resume()));
onBeforeUnmount(() => demo.detach());
</script>
<template>
    <div class="workspace-demo grid-feature-showcase benchmark-showcase">
        <div class="workspace-heading">
            <div>
                <h2>AI 모델 벤치마크 비교</h2>
                <p>지표는 세로로, 모델은 가로로. 같은 항목의 수치를 한 줄에서 비교하세요.</p>
            </div>
            <span class="feature-volume">18개 지표 × 4개 모델</span>
        </div>
        <div class="workspace-toolbar">
            <div class="workspace-controls" aria-label="비교 모델 선택">
                <label
                    ><input
                        type="checkbox"
                        data-model="aster"
                        :checked="view.aster"
                        @change="demo.setControl('aster', $event.target.checked)"
                    />
                    ASTER 32B</label
                >
                <label
                    ><input
                        type="checkbox"
                        data-model="orbit"
                        :checked="view.orbit"
                        @change="demo.setControl('orbit', $event.target.checked)"
                    />
                    ORBIT 70B</label
                >
                <label
                    ><input
                        type="checkbox"
                        data-model="pico"
                        :checked="view.pico"
                        @change="demo.setControl('pico', $event.target.checked)"
                    />
                    PICO 8B</label
                >
                <label
                    ><input
                        type="checkbox"
                        data-model="nova"
                        :checked="view.nova"
                        @change="demo.setControl('nova', $event.target.checked)"
                    />
                    NOVA 14B</label
                >
            </div>
            <div class="workspace-controls">
                <button type="button" class="btn" @click="demo.exportReport('xlsx')">Excel 내보내기</button>
                <button type="button" class="btn" @click="demo.exportReport('pdf')">PDF 내보내기</button>
            </div>
        </div>
        <div class="comparison-caption">
            <span>셀 템플릿 / 세로 병합 / 고정 칼럼 / 칼럼 표시 전환</span
            ><span class="benchmark-key">최고값 강조 (동점 포함)</span>
        </div>
        <div class="showcase-grid">
            <AUIGrid ref="myGrid" name="showcase5" :columnLayout="demo.columnLayout" :gridProps="demo.gridProps" />
        </div>
        <div class="workspace-note">
            <span id="benchmark-status" role="status">{{ view.status }}</span
            ><span>모델과 측정값은 기능 설명을 위한 가상 데이터입니다.</span>
        </div>
    </div>
</template>
