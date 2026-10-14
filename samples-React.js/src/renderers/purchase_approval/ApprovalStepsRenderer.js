/*
 * AUIGrid 사용자 정의 렌더러 - 구매 결재 단계 표시
 *
 * 접수, 검토, 결재, 발주 단계를 표시하고 각 단계를 누르면 상세 조회를 페이지에 요청합니다.
 *
 * 연결 파일
 *   그리드 래퍼로 AUIGrid를 로드한 뒤 이 모듈을 import합니다.
 *   import ApprovalStepsRenderer from "../renderers/purchase_approval/ApprovalStepsRenderer";
 *   cell-utils.js는 이 모듈이 가져옵니다. src/showcases/Showcase07.css의 관련 스타일도 적용합니다.
 *
 * 사용법
 *   {
 *     dataField: "stage",
 *     renderer: {
 *       type: "CustomRenderer",
 *       jsClass: ApprovalStepsRenderer,
 *       extraProps: {
 *         onAction: function (event) {
 *           // event.id로 행을 찾고 event.action과 event.value에 맞게 화면 또는 데이터를 처리합니다.
 *         }
 *       }
 *     }
 *   }
 *   행 데이터 예: { id: "P01", stage: 1, rejected: false }
 *
 * 데이터와 동작
 *   stage는 현재 단계 0~3, 4는 전체 완료입니다. rejected: true이면 현재 단계를 반려 상태로 표시합니다.
 *   단계 클릭: action은 "step", value는 클릭한 단계 번호 0~3입니다.
 *   onAction은 { id, action, value }를 받습니다. 렌더러가 데이터를 직접 변경하지 않습니다.
 */
import PurchaseCellUtils from './cell-utils';
var ApprovalStepsRenderer = window.AUIGrid.Class({
	tagName: 'div',
	cssClass: 'aui-grid-renderer-base aui-grid-renderer-custom purchase-cell approval-cell',
	initialized: false,
	__steps: null,
	__caption: null,
	__status: null,
	__progress: null,
	initialize: function () {
		// 셀 내부 버튼 콜백에서도 현재 렌더러를 참조합니다.
		var self = this;

		if (this.initialized) return;
		this.initialized = true;
		var ui = PurchaseCellUtils;
		var line = ui.create('div', 'approval-track');
		// DOM은 한 번만 생성하고 update에서 상태, 문구와 접근성 정보를 모두 갱신합니다.

		this.__steps = ['접수', '검토', '결재', '발주'].map(function (label, index) {
			var button = ui.button('approval-step');
			var marker = ui.create('span', 'approval-marker');
			button.append(marker, ui.create('span', 'approval-label', label));

			button.onclick = function (event) {
				event.stopPropagation();
				ui.emit(self, 'step', index);
			};

			line.appendChild(button);
			return {
				button: button,
				marker: marker,
				label: label
			};
		});
		this.__caption = ui.create('div', 'approval-caption');
		// 진행 단계 옆에서 현재 상태와 단계 수를 읽을 수 있게 두 줄로 분리합니다.
		this.__status = ui.create('strong', 'approval-status');
		this.__progress = ui.create('span', 'approval-progress');
		this.__caption.append(this.__status, this.__progress);
		this.element.append(line, this.__caption);
	},
	update: function () {
		if (!this.initialized) this.initialize();
		var item = this.data;
		this.element.hidden = !item;
		if (!item) return;

		this.__steps.forEach(function (step, index) {
			var button = step.button;
			var marker = step.marker;
			var label = step.label;
			var state = index < item.stage ? 'done' : index === item.stage ? item.rejected ? 'rejected' : 'current' : 'waiting';
			button.dataset.state = state;
			marker.textContent = state === 'done' ? '✓' : state === 'rejected' ? '!' : String(index + 1);
			var stateText = {
				done: '완료',
				rejected: '반려',
				current: '진행 중',
				waiting: '대기'
			}[state];
			button.setAttribute('aria-label', `${item.id} ${label} ${stateText}, 단계 상세`);
			if (index === item.stage) button.setAttribute('aria-current', 'step');
			else button.removeAttribute('aria-current');
		});

		// 재사용되는 셀은 반려, 완료 및 진행 상태와 보조 문구를 모두 다시 설정합니다.
		this.__caption.dataset.state = item.rejected ? 'rejected' : item.stage === 4 ? 'done' : 'current';
		this.__status.textContent = item.rejected ? '반려' : item.stage === 4 ? '발주 완료' : `${['구매 접수', '구매 담당 검토', '팀장 결재', '발주 준비'][item.stage]} 중`;
		this.__progress.textContent = item.rejected ? '요청 내용 보완 필요' : `${Math.min(item.stage + 1, 4)} / 4 단계`;
	},
	destroy: function (unload) {
		(this.__steps || []).forEach(function (step) {
			return PurchaseCellUtils.clearButton(step.button);
		});
		this.__steps = this.__caption = this.__status = this.__progress = null;
		this.$super.destroy(unload);
	}
}).extend(window.AUIGrid.RendererBase);

export default ApprovalStepsRenderer;
