import PurchaseCellUtils from './cell-utils';
/* 납기와 남은 날짜를 함께 표시합니다. 오늘 기준 값은 페이지에서 계산해 전달합니다. */
var PurchaseDueRenderer = window.AUIGrid.Class({
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

export default PurchaseDueRenderer;
