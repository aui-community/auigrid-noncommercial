/*
 * AUIGrid 사용자 정의 렌더러 - 구매 요청자 표시
 *
 * 요청자의 아바타, 이름과 소속을 표시하고 클릭하면 요청자 정보 조회를 페이지에 요청합니다.
 *
 * 연결 파일
 *   그리드 래퍼로 AUIGrid를 로드한 뒤 이 모듈을 import합니다.
 *   import RequesterRenderer from "../renderers/purchase_approval/RequesterRenderer";
 *   cell-utils.js는 이 모듈이 가져옵니다. src/showcases/Showcase07.css의 관련 스타일도 적용합니다.
 *   같은 폴더의 avatars/avatar-1.svg~avatar-4.svg를 함께 제공합니다.
 *
 * 사용법
 *   {
 *     dataField: "requester",
 *     renderer: {
 *       type: "CustomRenderer",
 *       jsClass: RequesterRenderer,
 *       extraProps: {
 *         onAction: function (event) {
 *           // event.id로 행을 찾고 event.action과 event.value에 맞게 화면 또는 데이터를 처리합니다.
 *         }
 *       }
 *     }
 *   }
 *   행 데이터 예: { id: "P01", requester: "김민수", team: "개발팀", tone: 0 }
 *
 * 데이터와 동작
 *   requester는 이름, team은 소속입니다. tone은 0 이상의 정수로 네 아바타 중 하나를 선택합니다.
 *   요청자 클릭: action은 "requester"이며 value는 undefined입니다.
 *   onAction은 { id, action, value }를 받습니다. 렌더러가 데이터를 직접 변경하지 않습니다.
 */
import PurchaseCellUtils from './cell-utils';
import avatar1 from './avatars/avatar-1.svg';
import avatar2 from './avatars/avatar-2.svg';
import avatar3 from './avatars/avatar-3.svg';
import avatar4 from './avatars/avatar-4.svg';
// 배포 경로에 맞는 SVG 주소는 번들러가 결정합니다.
var avatars = [avatar1, avatar2, avatar3, avatar4];
var RequesterRenderer = window.AUIGrid.Class({
	tagName: 'div',
	cssClass: 'aui-grid-renderer-base aui-grid-renderer-custom purchase-cell requester-cell',
	initialized: false,
	__button: null,
	__avatar: null,
	__name: null,
	__team: null,
	initialize: function () {
		// 셀 내부 버튼 콜백에서도 현재 렌더러를 참조합니다.
		var self = this;

		if (this.initialized) return;
		this.initialized = true;
		var ui = PurchaseCellUtils;
		this.__button = ui.button('requester-button');
		this.__avatar = ui.create('img', 'requester-avatar');
		this.__avatar.alt = ''; // 요청자 이름은 버튼의 접근성 이름에서 한 번만 읽습니다.

		this.__name = ui.create('strong', 'requester-name');
		this.__team = ui.create('span', 'requester-team');
		var text = ui.create('span', 'requester-text');
		text.append(this.__name, this.__team);

		this.__button.append(this.__avatar, text);

		this.__button.onclick = function (event) {
			event.stopPropagation();
			ui.emit(self, 'requester');
		};

		this.element.appendChild(this.__button);
	},
	update: function () {
		if (!this.initialized) this.initialize();
		var item = this.data;
		this.element.hidden = !item;
		if (!item) return; // 모든 텍스트는 textContent로 넣어 사용자 데이터가 HTML로 해석되지 않게 합니다.

		var avatar = avatars[item.tone % 4];
		if (this.__avatar.src !== avatar) this.__avatar.src = avatar;
		this.__name.textContent = item.requester;
		this.__team.textContent = item.team;

		this.__button.setAttribute('aria-label', `${item.requester}, ${item.team}, 요청자 정보`);
	},
	destroy: function (unload) {
		PurchaseCellUtils.clearButton(this.__button);
		this.__button = this.__avatar = this.__name = this.__team = null;
		this.$super.destroy(unload);
	}
}).extend(window.AUIGrid.RendererBase);

export default RequesterRenderer;
