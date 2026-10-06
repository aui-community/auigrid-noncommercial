<script setup>
import { ref, shallowRef, onMounted, onBeforeUnmount, onActivated, onDeactivated, nextTick } from 'vue';
import AUIGrid from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
import 'file-saver';
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import { createDemo, initialView } from './showcase4Model';
import './showcase-workspaces.css';

import './Showcase04.css';
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
    <div class="live-demo">
        <div class="live-heading">
            <div>
                <h2>서비스 운영 현황</h2>
                <p>가상 서비스의 운영 지표를 실시간으로 모니터링합니다.</p>
            </div>
            <span id="live-state" class="live-stream" role="status" :data-paused="view.paused">{{ view.state }}</span>
        </div>
        <dl class="live-summary" aria-label="서비스 운영 요약">
            <div class="live-metric">
                <dt>정상 서비스</dt>
                <dd>
                    <strong id="live-healthy" class="live-value">{{ view.healthy }}</strong
                    ><span id="live-total" class="live-unit">{{ view.total }}</span
                    ><span class="live-caption">현재 수신 상태 기준</span>
                </dd>
            </div>
            <div class="live-metric">
                <dt>처리 요청</dt>
                <dd>
                    <strong id="live-requests" class="live-value">{{ view.requests }}</strong
                    ><span class="live-unit">/초</span><span class="live-caption">전체 서비스 합계</span>
                </dd>
            </div>
            <div class="live-metric">
                <dt>평균 응답 시간</dt>
                <dd>
                    <strong id="live-latency" class="live-value">{{ view.latency }}</strong
                    ><span class="live-unit">ms</span><span class="live-caption">요청량 기준 가중 평균</span>
                </dd>
            </div>
            <div id="live-attention-card" class="live-metric live-attention" :data-active="view.attentionActive">
                <dt>확인 필요</dt>
                <dd>
                    <strong id="live-attention" class="live-value">{{ view.attention }}</strong
                    ><span class="live-unit">개</span><span class="live-caption">주의 또는 응답 지연</span>
                </dd>
            </div>
        </dl>
        <div class="live-toolbar">
            <div class="live-grid-title">
                <h3>서비스별 상태</h3>
                <span>요청 추이: 최근 12회 측정</span>
            </div>
            <div class="live-controls" role="group" aria-label="실시간 갱신 설정">
                <label
                    >트래픽<select
                        id="live-traffic"
                        :value="view.traffic"
                        @change="demo.setControl('traffic', $event.target.value)"
                    >
                        <option value="normal">평시</option>
                        <option value="peak">증가</option>
                    </select></label
                >
                <label
                    >갱신 주기<select
                        id="live-interval"
                        :value="view.interval"
                        @change="demo.setControl('interval', $event.target.value)"
                    >
                        <option value="500">0.5초</option>
                        <option value="1000">1초</option>
                        <option value="2000">2초</option>
                    </select></label
                >
                <button type="button" class="btn" id="live-toggle" @click="demo.toggleUpdates()">
                    {{ view.toggle }}
                </button>
                <button
                    type="button"
                    class="btn"
                    id="live-step"
                    :disabled="view.stepDisabled"
                    @click="demo.refreshRows()"
                >
                    한 번 갱신
                </button>
            </div>
        </div>
        <div class="showcase-grid">
            <AUIGrid ref="myGrid" name="showcase4" :columnLayout="demo.columnLayout" :gridProps="demo.gridProps" />
        </div>
        <div class="live-footnote">
            <p>
                <span class="live-key" aria-hidden="true"></span><span id="live-updated">{{ view.updated }}</span> /
                마지막 수신 <time id="live-last-update" :datetime="view.dateTime">{{ view.time }}</time>
            </p>
            <p>모의 데이터이며 외부 서버에 연결하지 않습니다.</p>
        </div>
        <div class="desc_bottom">
            <p><code>refreshRows()</code>로 변경된 행만 갱신하며, 선택한 행과 현재 화면을 유지합니다.</p>
        </div>
    </div>
</template>
