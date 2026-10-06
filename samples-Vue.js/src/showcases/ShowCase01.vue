<script setup>
import { ref, shallowRef, onMounted, onBeforeUnmount, onActivated, onDeactivated, nextTick } from 'vue';
import AUIGrid from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
import 'file-saver';
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import { createDemo, initialView } from './showcase1Model';
import './showcase-workspaces.css';

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
    <div class="workspace-demo resource-planner">
        <div class="workspace-heading">
            <div>
                <h2>산업 장비 자원 운영표</h2>
                <p>600개 장비의 날짜별 가동, 예약과 점검 일정을 한눈에 관리하세요.</p>
            </div>
            <strong class="resource-month">2026년 10월</strong>
        </div>
        <div class="workspace-toolbar">
            <div class="workspace-controls">
                <label
                    >거점<select
                        id="resource-site"
                        :value="view.site"
                        @change="demo.setControl('site', $event.target.value)"
                    >
                        <option>전체</option>
                        <option>수도권 센터</option>
                        <option>중부 센터</option>
                        <option>남부 센터</option>
                        <option>동부 센터</option>
                        <option>서부 센터</option>
                    </select></label
                ><label
                    >자원 종류<select
                        id="resource-type"
                        :value="view.category"
                        @change="demo.setControl('category', $event.target.value)"
                    >
                        <option>전체</option>
                        <option>자율이동 로봇</option>
                        <option>무인 운반차</option>
                        <option>전동 지게차</option>
                        <option>3D 프린터</option>
                        <option>정밀 측정기</option>
                        <option>비전 검사기</option>
                    </select></label
                ><input
                    type="search"
                    id="resource-search"
                    class="workspace-search"
                    placeholder="자원명 또는 번호 검색"
                    aria-label="자원 검색"
                    :value="view.query"
                    @input="demo.setControl('query', $event.target.value)"
                />
            </div>
            <span id="resource-count">{{ view.count }}</span>
        </div>
        <div class="resource-legend" aria-label="운영 상태 범례">
            <span class="resource-active">가동</span><span class="resource-reserved">예약</span
            ><span class="resource-maintenance">점검</span><span class="resource-idle">유휴</span
            ><small>날짜를 더블클릭해 상태를 변경하세요. 집계는 자동 계산됩니다.</small>
        </div>
        <div class="workspace-toolbar">
            <div class="workspace-controls">
                <select
                    id="resource-state"
                    aria-label="범위에 적용할 상태"
                    :value="view.state"
                    @change="demo.setControl('state', $event.target.value)"
                >
                    <option>가동</option>
                    <option>예약</option>
                    <option>점검</option>
                    <option>유휴</option></select
                ><button type="button" class="btn" @click="demo.applyState()">선택 날짜에 적용</button
                ><button
                    type="button"
                    class="btn"
                    id="resource-undo"
                    :disabled="view.undoDisabled"
                    @click="demo.undoResource()"
                >
                    실행 취소
                </button>
            </div>
            <div class="workspace-controls">
                <button type="button" class="btn" @click="demo.addResource()">자원 추가</button
                ><button type="button" class="btn" @click="demo.removeResource()">선택 삭제</button
                ><button type="button" class="btn" @click="demo.exportReport('xlsx')">Excel 내보내기</button
                ><button type="button" class="btn" @click="demo.exportReport('pdf')">PDF 내보내기</button>
            </div>
        </div>
        <div class="showcase-grid">
            <AUIGrid ref="myGrid" name="showcase1" :columnLayout="demo.columnLayout" :gridProps="demo.gridProps" />
        </div>
        <div class="workspace-note">
            <p id="resource-message" role="status">{{ view.message }}</p>
            <p>가상 자원 데이터 / 가동률 = 가동 일수 ÷ 31일</p>
        </div>
    </div>
</template>
