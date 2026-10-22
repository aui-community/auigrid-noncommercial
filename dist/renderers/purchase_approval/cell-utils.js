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
/* 구매 요청 렌더러의 공통 DOM 도구입니다. 각 렌더러보다 먼저 읽습니다. */
window.PurchaseCellUtils = {
	create: function (tag, className, text) {
		var element = document.createElement(tag);
		element.className = className;
		if (text !== undefined) element.textContent = text;
		return element;
	},
	button: function (className) {
		var button = this.create('button', className);
		button.type = 'button'; // 셀 내부 버튼의 Enter/Space는 그리드 키보드 처리와 중복되지 않게 합니다.

		button.onkeydown = function (event) {
			if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
		};

		return button;
	},
	// 화면 행 번호 대신 ID를 전달하여 정렬이나 스크롤 후에도 올바른 요청을 처리합니다.
	emit: function (renderer, action, value) {
		var item = renderer.data;
		var callback = renderer.columnData.renderer.extraProps?.onAction;
		if (item && typeof callback === 'function') callback({
			id: item.id,
			action: action,
			value: value
		});
	},
	clearButton: function (button) {
		if (button) button.onclick = button.onkeydown = null;
	}
};
