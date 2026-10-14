/*
 * AUIGrid 사용자 정의 렌더러 - 구매 첨부파일 표시
 *
 * 첫 첨부파일 이름과 추가 파일 수를 표시합니다. 파일이 없으면 "첨부 없음"을 표시합니다.
 *
 * 연결 파일
 *   그리드 래퍼로 AUIGrid를 로드한 뒤 이 모듈을 import합니다.
 *   import AttachmentRenderer from "../renderers/purchase_approval/AttachmentRenderer";
 *   cell-utils.js는 이 모듈이 가져옵니다. src/showcases/Showcase07.css의 관련 스타일도 적용합니다.
 *
 * 사용법
 *   {
 *     dataField: "files",
 *     renderer: {
 *       type: "CustomRenderer",
 *       jsClass: AttachmentRenderer,
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
import PurchaseCellUtils from './cell-utils';
var AttachmentRenderer = window.AUIGrid.Class({
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

export default AttachmentRenderer;
