/* 행 상태에 맞는 작업과 상세 보기를 제공합니다. 데이터 변경은 페이지에 위임합니다. */
window.AUIGrid.ApprovalActionsRenderer = window.AUIGrid.Class({
	tagName: 'div',
	cssClass: 'aui-grid-renderer-base aui-grid-renderer-custom purchase-cell actions-cell',
	initialized: false,
	__advance: null,
	__detail: null,
	initialize: function () {
		// 셀 내부 버튼 콜백에서도 현재 렌더러를 참조합니다.
		var self = this;

		if (this.initialized) return;
		this.initialized = true;
		var ui = PurchaseCellUtils;
		this.__advance = ui.button('approval-action');
		this.__detail = ui.button('approval-detail');
		this.__detail.textContent = '상세';

		this.__advance.onclick = function (event) {
			event.stopPropagation();
			ui.emit(self, 'advance');
		};

		this.__detail.onclick = function (event) {
			event.stopPropagation();
			ui.emit(self, 'detail');
		};

		this.element.append(this.__advance, this.__detail);
	},
	update: function () {
		if (!this.initialized) this.initialize();
		var item = this.data;
		this.element.hidden = !item;
		if (!item) return;
		// 발주를 마친 요청에는 실행할 작업이 없으므로 상세 버튼만 남깁니다.
		this.__advance.hidden = item.stage === 4;
		this.__advance.disabled = item.stage === 4;
		this.__advance.textContent = item.rejected ? '재상신' : ['검토 시작', '검토 완료', '승인', '발주 완료', '완료'][item.stage];
		this.__advance.dataset.retry = String(item.rejected);

		this.__advance.setAttribute('aria-label', `${item.id} ${this.__advance.textContent}`);

		this.__detail.setAttribute('aria-label', `${item.id} 요청 상세 보기`);
	},
	destroy: function (unload) {
		PurchaseCellUtils.clearButton(this.__advance);
		PurchaseCellUtils.clearButton(this.__detail);
		this.__advance = this.__detail = null;
		this.$super.destroy(unload);
	}
}).extend(window.AUIGrid.RendererBase);
