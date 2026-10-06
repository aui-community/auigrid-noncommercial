<script setup lang="ts">
import { ref, shallowRef, onMounted, onBeforeUnmount, onActivated, onDeactivated, nextTick } from 'vue';
import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
import 'file-saver';
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import { createDemo, initialView } from './showcase2Model';
import './showcase-workspaces.css';

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
    <div class="workspace-demo bom-workspace">
        <div class="workspace-heading">
            <div>
                <h2>자율주행 로봇 BOM 원가 시뮬레이터</h2>
                <p>제품 20개, 조립체 80개, 부품 320개. 부품 단가와 투입 수량을 바꾸며 원가를 검토하세요.</p>
            </div>
        </div>
        <div class="bom-summary">
            <div>
                <span>선택 제품 / 1대 기준</span>
                <h3 id="bom-product">{{ view.product }}</h3>
                <small id="bom-lead">{{ view.lead }}</small>
            </div>
            <div class="bom-total">
                <span>자재 원가</span><strong id="bom-cost">{{ view.cost }}</strong>
            </div>
        </div>
        <div class="workspace-toolbar">
            <div class="workspace-controls">
                <label
                    >구성 보기<select
                        id="bom-depth"
                        :value="view.depth"
                        @change="demo.setControl('depth', ($event.target as HTMLSelectElement).value)"
                    >
                        <option value="all">부품까지</option>
                        <option value="2">조립체까지</option>
                        <option value="1">제품만</option>
                    </select></label
                ><span id="bom-visible">{{ view.visible }}</span
                ><button type="button" class="btn" @click="demo.resetCosts()">입력 초기화</button>
            </div>
            <div class="workspace-controls">
                <button type="button" class="btn" @click="demo.exportReport('xlsx')">Excel 내보내기</button
                ><button type="button" class="btn" @click="demo.exportReport('pdf')">PDF 내보내기</button>
            </div>
        </div>
        <div class="showcase-grid">
            <AUIGrid ref="myGrid" name="showcase2" :columnLayout="demo.columnLayout" :gridProps="demo.gridProps" />
        </div>
        <div class="workspace-note">
            <p>파란 수량과 단가를 더블클릭하거나 F2로 편집하세요. 상위 금액은 자동 합산됩니다.</p>
            <p>가상 BOM / 부품 비용만 반영, 가공비 및 세금 제외</p>
        </div>
    </div>
</template>
