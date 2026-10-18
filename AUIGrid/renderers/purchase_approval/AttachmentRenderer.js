/*!
 * AUIGrid Non-Commercial v3.0.20.1 - Purchase approval showcase renderer sample
 * Copyright (c) AUISoft Co., Ltd. All rights reserved.
 *
 * AUIGrid 예제 파일입니다. AUIGrid 사용권 범위 안에서 이 파일을 복사하거나 수정하여 사용할 수 있습니다.
 * 이 허용은 이 예제 파일에만 적용되며 AUIGrid.js에는 적용되지 않습니다.
 * This is an AUIGrid sample file. You may copy and modify it for use with AUIGrid within the
 * scope of your AUIGrid license. This permission applies only to this sample file, not to AUIGrid.js.
 * License: https://github.com/aui-community/auigrid-noncommercial/blob/main/LICENSE
 */
/*
 * AUIGrid 사용자 정의 렌더러 - 구매 첨부파일 표시
 *
 * 첫 첨부파일 이름과 추가 파일 수를 표시합니다. 파일이 없으면 "첨부 없음"을 표시합니다.
 *
 * 연결 파일
 *   AUIGrid.js 다음에 js/renderers/purchase_approval/cell-utils.js와 AttachmentRenderer.js 파일을 순서대로 연결합니다.
 *   showcase7.html의 purchase-cell 및 관련 자식 클래스 CSS를 함께 적용합니다. 별도 렌더러 CSS 파일은 없습니다.
 *
 * 사용법
 *   {
 *     dataField: "files",
 *     renderer: {
 *       type: "CustomRenderer",
 *       jsClass: AUIGrid.AttachmentRenderer,
 *       extraProps: {
 *         onAction: function (event) {
 *           // event.id로 행을 찾고 event.action과 event.value에 맞게 화면 또는 데이터를 처리합니다.
 *         }
 *       }
 *     }
 *   }
 *   행 데이터 예: { id: "P01", files: [{ name: "견적서.pdf" }, { name: "사양서.pdf" }] }
 *
 * 데이터와 동작
 *   files는 파일 객체 배열이며 name을 표시합니다. 파일 주소와 실제 미리보기 처리는 페이지에서 관리합니다.
 *   첫 파일 클릭은 action: "file", value: 0이며, 추가 파일 클릭은 action: "files"입니다.
 *   onAction은 { id, action, value }를 받습니다. 렌더러가 데이터를 직접 변경하지 않습니다.
 */
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
