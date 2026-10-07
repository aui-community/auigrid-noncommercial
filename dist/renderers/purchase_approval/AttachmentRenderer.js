/* 첫 첨부와 추가 파일 수를 표시합니다. 미리보기는 페이지 콜백에서 처리합니다. */
window.AUIGrid.AttachmentRenderer = window.AUIGrid.Class({
	tagName: 'div',
	cssClass: 'aui-grid-renderer-base aui-grid-renderer-custom purchase-cell attachment-cell',
	initialized: false,
	__file: null,
	__more: null,
	__empty: null,
	initialize: function () {
		// 셀 내부 버튼 콜백에서도 현재 렌더러를 참조합니다.
		var self = this;

		if (this.initialized) return;
		this.initialized = true;
		var ui = PurchaseCellUtils;
		this.__file = ui.button('attachment-file');
		this.__more = ui.button('attachment-more');
		this.__empty = ui.create('span', 'muted', '첨부 없음');

		this.__file.onclick = function (event) {
			event.stopPropagation();
			ui.emit(self, 'file', 0);
		};

		this.__more.onclick = function (event) {
			event.stopPropagation();
			ui.emit(self, 'files');
		};

		this.element.append(this.__file, this.__more, this.__empty);
	},
	update: function () {
		if (!this.initialized) this.initialize();
		var files = this.data?.files || []; // 가상 스크롤로 재사용되는 셀에 이전 파일이나 버튼이 남지 않게 모두 설정합니다.

		this.__file.hidden = files.length === 0;
		this.__more.hidden = files.length < 2;
		this.__empty.hidden = files.length > 0;
		this.__file.textContent = files[0]?.name || '';
		this.__file.title = files[0]?.name || '';

		this.__file.setAttribute('aria-label', `${files[0]?.name || '첨부 없음'} 미리보기`);

		this.__more.textContent = `외 ${Math.max(0, files.length - 1)}개`;

		this.__more.setAttribute('aria-label', `첨부파일 ${files.length}개 모두 보기`);
	},
	destroy: function (unload) {
		PurchaseCellUtils.clearButton(this.__file);
		PurchaseCellUtils.clearButton(this.__more);
		this.__file = this.__more = this.__empty = null;
		this.$super.destroy(unload);
	}
}).extend(window.AUIGrid.RendererBase);
