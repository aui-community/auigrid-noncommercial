/*
 * AUIGrid 사용자 정의 렌더러 - 구매 결재 작업 버튼
 *
 * 현재 결재 상태에 맞는 작업 버튼과 상세 버튼을 표시합니다. 실제 상태 변경은 페이지에서 처리합니다.
 *
 * 연결 파일
 *   그리드 래퍼로 AUIGrid를 로드한 뒤 이 모듈을 import합니다.
 *   import ApprovalActionsRenderer from "../renderers/purchase_approval/ApprovalActionsRenderer";
 *   cell-utils.js는 이 모듈이 가져옵니다. src/showcases/Showcase07.css의 관련 스타일도 적용합니다.
 *
 * 사용법
 *   {
 *     dataField: "stage",
 *     renderer: {
 *       type: "CustomRenderer",
 *       jsClass: ApprovalActionsRenderer,
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
import PurchaseCellUtils from './cell-utils';
var ApprovalActionsRenderer = window.AUIGrid.Class({
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

export default ApprovalActionsRenderer;
