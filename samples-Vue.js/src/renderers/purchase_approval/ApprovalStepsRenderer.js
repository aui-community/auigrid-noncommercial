import PurchaseCellUtils from './cell-utils';
/* 접수 → 검토 → 결재 → 발주의 상태와 단계별 상세 보기를 표현합니다. */
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
