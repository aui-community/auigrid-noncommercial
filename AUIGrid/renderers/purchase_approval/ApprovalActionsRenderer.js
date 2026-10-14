/*!
 * AUIGrid Non-Commercial v3.0.20.0 - Purchase approval showcase renderer sample
 * Copyright (c) AUISoft Co., Ltd. All rights reserved.
 *
 * AUIGrid 예제 파일입니다. AUIGrid 사용권 범위 안에서 이 파일을 복사하거나 수정하여 사용할 수 있습니다.
 * 이 허용은 이 예제 파일에만 적용되며 AUIGrid.js에는 적용되지 않습니다.
 * This is an AUIGrid sample file. You may copy and modify it for use with AUIGrid within the
 * scope of your AUIGrid license. This permission applies only to this sample file, not to AUIGrid.js.
 * License: https://github.com/aui-community/auigrid-noncommercial/blob/main/LICENSE
 */
/*
 * AUIGrid 사용자 정의 렌더러 - 구매 결재 작업 버튼
 *
 * 현재 결재 상태에 맞는 작업 버튼과 상세 버튼을 표시합니다. 실제 상태 변경은 페이지에서 처리합니다.
 *
 * 연결 파일
 *   AUIGrid.js 다음에 js/renderers/purchase_approval/cell-utils.js와 ApprovalActionsRenderer.js 파일을 순서대로 연결합니다.
 *   showcase7.html의 purchase-cell 및 관련 자식 클래스 CSS를 함께 적용합니다. 별도 렌더러 CSS 파일은 없습니다.
 *
 * 사용법
 *   {
 *     dataField: "stage",
 *     renderer: {
 *       type: "CustomRenderer",
 *       jsClass: AUIGrid.ApprovalActionsRenderer,
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
 *   stage는 현재 단계 0~3이며 4이면 작업 버튼을 숨깁니다. rejected: true이면 "재상신" 버튼을 표시합니다.
 *   작업 버튼은 action: "advance", 상세 버튼은 action: "detail"이며 value는 undefined입니다.
 *   onAction은 { id, action, value }를 받습니다. 렌더러가 데이터를 직접 변경하지 않습니다.
 */
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
