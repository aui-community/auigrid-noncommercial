<script setup lang="ts">
import { ref, shallowRef, onMounted, onBeforeUnmount, onActivated, onDeactivated, nextTick } from 'vue';
import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
import 'file-saver';
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import { createDemo, initialView } from './showcase3Model';
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
    <div class="workspace-demo energy-report">
        <div class="energy-masthead">
            <div>
                <div id="energy-report-period" class="energy-period">{{ view.reportPeriod }}</div>
                <h2>재생에너지 월별 성과 리포트</h2>
                <p>발전량과 목표를 함께 읽고, 색상으로 월별 달성률을 비교하세요.</p>
            </div>
            <div class="energy-total">
                기간 발전량<strong id="energy-total">{{ view.total }}</strong
                ><small id="energy-achievement">{{ view.achievement }}</small>
            </div>
        </div>
        <div class="workspace-toolbar">
            <div class="workspace-controls">
                <label
                    >기간<select
                        id="energy-period"
                        :value="view.period"
                        @change="demo.setControl('period', ($event.target as HTMLSelectElement).value)"
                    >
                        <option value="1">1~6월</option>
                        <option value="4">4~9월</option>
                    </select></label
                ><label
                    >권역<select
                        id="energy-region"
                        :value="view.region"
                        @change="demo.setControl('region', ($event.target as HTMLSelectElement).value)"
                    >
                        <option>전체</option>
                        <option>호남</option>
                        <option>영남</option>
                        <option>강원</option>
                        <option>제주</option>
                    </select></label
                ><label
                    >발전원<select
                        id="energy-source"
                        :value="view.source"
                        @change="demo.setControl('source', ($event.target as HTMLSelectElement).value)"
                    >
                        <option>전체</option>
                        <option>태양광</option>
                        <option>풍력</option>
                    </select></label
                >
            </div>
            <div class="workspace-controls">
                <button class="btn" type="button" @click="demo.exportReport('xlsx')">Excel 내보내기</button
                ><button class="btn" type="button" @click="demo.exportReport('pdf')">PDF 내보내기</button>
            </div>
        </div>
        <div class="energy-options">
            <span id="energy-count">{{ view.count }}</span>
            <div class="energy-views" aria-label="리포트 표시 지표">
                <button
                    type="button"
                    data-report-view="all"
                    :aria-pressed="!view.rateOnly"
                    @click="demo.setReportView(false)"
                >
                    전체 지표</button
                ><button
                    type="button"
                    data-report-view="rate"
                    :aria-pressed="view.rateOnly"
                    @click="demo.setReportView(true)"
                >
                    달성률만
                </button>
            </div>
        </div>
        <div class="energy-legend">
            <span>달성률</span><span><i style="background: #fcf0dd"></i>95% 미만</span
            ><span><i style="background: #edf4fb"></i>95~100% 미만</span
            ><span><i style="background: #def1ea"></i>100% 이상</span>
        </div>
        <div class="showcase-grid">
            <AUIGrid ref="myGrid" name="showcase3" :columnLayout="demo.columnLayout" :gridProps="demo.gridProps" />
        </div>
        <div class="workspace-note">
            <p>누계 달성률 = 기간 발전량 합계 ÷ 기간 목표 합계 × 100</p>
            <p>가상 발전 데이터 / MWh, %</p>
        </div>
    </div>
</template>
