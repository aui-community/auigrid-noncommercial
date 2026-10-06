/* 요청자의 SVG 아바타, 이름과 소속을 표시합니다. 자체 제작한 로컬 이미지를 사용합니다. */
var purchaseAvatarBase = new URL("./avatars/", document.currentScript.src).href;
window.AUIGrid.RequesterRenderer = window.AUIGrid.Class({
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

		var avatar = purchaseAvatarBase + `avatar-${item.tone % 4 + 1}.svg`;
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
