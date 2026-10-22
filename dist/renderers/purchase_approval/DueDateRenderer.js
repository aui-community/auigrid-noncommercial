/*!
 * AUIGrid Non-Commercial v3.0.20.2 - Purchase approval showcase renderer sample
 * Copyright (c) AUISoft Co., Ltd. All rights reserved.
 *
 * AUIGrid 예제 파일입니다. AUIGrid 사용권 범위 안에서 이 파일을 복사하거나 수정하여 사용할 수 있습니다.
 * 이 허용은 이 예제 파일에만 적용되며 AUIGrid.js에는 적용되지 않습니다.
 * This is an AUIGrid sample file. You may copy and modify it for use with AUIGrid within the
 * scope of your AUIGrid license. This permission applies only to this sample file, not to AUIGrid.js.
 * License: https://github.com/aui-community/auigrid-noncommercial/blob/main/LICENSE
 */
/*
 * AUIGrid 사용자 정의 렌더러 - 구매 납기 표시
 *
 * 납기와 남은 일수를 표시합니다. 지연, 임박, 일반 상태를 구분하고 발주 완료 시 완료 문구를 표시합니다.
 *
 * 연결 파일
 *   AUIGrid.js 다음에 js/renderers/purchase_approval/cell-utils.js와 DueDateRenderer.js 파일을 순서대로 연결합니다.
 *   showcase7.html의 purchase-cell 및 관련 자식 클래스 CSS를 함께 적용합니다. 별도 렌더러 CSS 파일은 없습니다.
 *
 * 사용법
 *   {
 *     dataField: "dueDate",
 *     renderer: {
 *       type: "CustomRenderer",
 *       jsClass: AUIGrid.PurchaseDueRenderer
 *     }
 *   }
 *   행 데이터 예: { dueDate: "2026-10-20", daysLeft: 6, stage: 1 }
 *
 * 데이터와 동작
 *   dueDate는 "YYYY-MM-DD" 문자열입니다. daysLeft는 페이지에서 계산한 남은 일수이며 음수는 지연입니다.
 *   stage가 4이면 "발주 완료"를 표시합니다. 이 렌더러는 클릭 콜백이나 extraProps 옵션이 없습니다.
 */
window.AUIGrid.PurchaseDueRenderer = window.AUIGrid.Class({
	tagName: 'div',
	cssClass: 'aui-grid-renderer-base aui-grid-renderer-custom purchase-cell due-cell',
	initialized: false,
	__date: null,
	__badge: null,
	initialize: function () {
		if (this.initialized) return;
		this.initialized = true;
		this.__date = PurchaseCellUtils.create('strong', 'due-date');
		this.__badge = PurchaseCellUtils.create('span', 'due-badge');
		this.element.append(this.__date, this.__badge);
	},
	update: function () {
		if (!this.initialized) this.initialize();
		var item = this.data;
		this.element.hidden = !item;
		if (!item) return;
		this.__date.textContent = item.dueDate.slice(5).replace('-', '.');
		this.__date.title = item.dueDate;
		var done = item.stage === 4;
		this.__badge.dataset.kind = done ? 'done' : item.daysLeft < 0 ? 'late' : item.daysLeft <= 2 ? 'soon' : 'normal';
		this.__badge.textContent = done ? '발주 완료' : item.daysLeft < 0 ? `${-item.daysLeft}일 지연` : item.daysLeft === 0 ? '오늘 납기' : `${item.daysLeft}일 남음`;
	},
	destroy: function (unload) {
		this.__date = this.__badge = null;
		this.$super.destroy(unload);
	}
}).extend(window.AUIGrid.RendererBase);
