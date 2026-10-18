/*!
 * AUIGrid Non-Commercial v3.0.20.1 - Textarea edit renderer sample
 * Copyright (c) AUISoft Co., Ltd. All rights reserved.
 *
 * AUIGrid 예제 파일입니다. AUIGrid 사용권 범위 안에서 이 파일을 복사하거나 수정하여 사용할 수 있습니다.
 * 이 허용은 이 예제 파일에만 적용되며 AUIGrid.js에는 적용되지 않습니다.
 * This is an AUIGrid sample file. You may copy and modify it for use with AUIGrid within the
 * scope of your AUIGrid license. This permission applies only to this sample file, not to AUIGrid.js.
 * License: https://github.com/aui-community/auigrid-noncommercial/blob/main/LICENSE
 */
/*
 * AUIGrid 사용자 정의 에디트 렌더러 - 여러 줄 텍스트 편집기
 *
 * 셀의 문자열을 textarea에서 편집합니다. 값이 없으면 빈 입력란을 표시합니다.
 * Enter로 줄을 바꾸고 Ctrl+Enter 또는 확인 버튼으로 적용하며, Esc 또는 취소 버튼으로 취소합니다.
 * 입력란 바깥을 클릭하여 편집을 끝내면 현재 내용을 적용합니다.
 *
 * 연결 파일
 *   AUIGrid.js 다음에 AUIGrid.TextareaEditor.js와 AUIGrid.TextareaEditor.css를 연결합니다.
 *   별도 외부 라이브러리는 필요하지 않습니다.
 *
 * 사용법 (그리드 속성 editable: true)
 *   {
 *     dataField: "content",
 *     editRenderer: {
 *       type: "CustomEditRenderer",
 *       jsClass: AUIGrid.TextareaEditor,
 *       vPosition: "bottom",
 *       extraProps: {
 *         rows: 4, maxRows: 12, autoResize: true,
 *         maxLength: 500, showCounter: true,
 *         placeholder: "내용을 입력하세요.",
 *         helpText: "Ctrl+Enter 확인, Esc 취소",
 *         confirm: "확인", cancel: "취소"
 *       }
 *     }
 *   }
 *
 * 주요 옵션 (extraProps, 모두 생략 가능)
 *   submitKey: "ctrlEnter"가 기본입니다. "enter"이면 Enter 확인, Shift+Enter 줄바꿈입니다.
 *   rows: 기본 4줄, autoResize: 기본 true, maxRows: 자동 높이 조절 한도이며 기본 12줄입니다.
 *   maxLength: 양수일 때 글자 수를 제한합니다. showCounter는 maxLength가 있으면 기본 true입니다.
 *   placeholder: 빈 입력란 안내입니다. trim은 확인 시 앞뒤 공백 제거이며 기본 false입니다.
 *   selectAll: 열 때 전체 선택하며 기본 true입니다. false이면 커서를 끝에 둡니다.
 *   showHelp: 하단 안내 표시이며 기본 true입니다. helpText 생략 시 단축키 안내를 사용합니다.
 *   confirm, cancel: 버튼 문구이며 기본값은 "확인", "취소"입니다.
 *
 * 줄바꿈 문자는 문자열에 보존됩니다. 셀에서도 줄바꿈을 표시하려면 칼럼의 style에
 * white-space: pre-wrap을 적용한 CSS 클래스를 지정합니다. 편집기의 옵션과는 별개입니다.
 */
/* eslint-disable */
window.AUIGrid.TextareaEditor = window.AUIGrid.Class({
	/****************************************************************
	 *
	 * Overriden Properties
	 *
	 ****************************************************************/

	/* 생성될 HTML Tag 명 */
	tagName: 'div',

	/* 렌더러 HTML 엘리먼트 */
	element: null,

	/* CSS 스타일 클래스 (원본 클래스 유지 + 개선판 스타일용 aui-ta-v2) */
	cssClass: 'aui-grid-edit-renderer-custom aui-grid-edit-renderer-custom-textarea aui-ta-v2',

	/* 행 아이템 */
	data: null,

	/* 렌더러의 칼럼 레이아웃 데이터 */
	columnData: null,

	/* 칼럼 인덱스 */
	columnIndex: -1,

	/* 행 인덱스 */
	rowIndex: -1,

	/* 데이터 필드명 */
	dataField: '',

	/* v3.0.20.1부터 엔진이 create() 전에 전달하는 소유 그리드 ID */
	pid: '',

	/* 사용자가 설정한 여분의 속성 */
	extraProps: null,

	/****************************************************************
	 *
	 * Private Properties (규칙 : __ 로 시작)
	 *
	 ****************************************************************/

	__textarea: null,
	__confirmBtn: null,
	__cancelBtn: null,
	__counter: null,

	/* 편집 시작 시점의 텍스트 */
	__original: '',

	/* 편집기가 먼저 닫히면 예약한 포커스도 함께 취소합니다. */
	__focusTimer: null,

	/****************************************************************
	 *
	 * Overriden Methods
	 *
	 ****************************************************************/

	/*
	 * @Overriden public create
	 * 셀 수정 진입할 때 그리드에 의해 호출됩니다.
	 */
	create: function () {
		var props = this.__props();
		var value = this.data[this.dataField];

		// [수정 1] null / undefined 는 빈 문자열로 표시합니다.
		this.__original = value == null ? '' : String(value);

		this.__onInput = this.__onInput.bind(this);
		this.__onKeyDown = this.__onKeyDown.bind(this);
		this.__onConfirm = this.__onConfirm.bind(this);
		this.__onCancel = this.__onCancel.bind(this);

		// textarea
		var textarea = (this.__textarea = document.createElement('textarea'));
		textarea.value = this.__original;
		// textarea는 CRLF를 LF로 정규화하므로 실제 표시 문자열을 변경 비교의 기준으로 사용합니다.
		// 변경 없는 완료는 취소로 처리하여 데이터의 원래 줄바꿈과 null/undefined를 보존합니다.
		this.__original = textarea.value;
		textarea.rows = props.rows;
		textarea.spellcheck = false;
		if (props.placeholder) textarea.placeholder = props.placeholder;
		if (props.maxLength) textarea.maxLength = props.maxLength;
		textarea.addEventListener('input', this.__onInput);
		textarea.addEventListener('keydown', this.__onKeyDown);
		this.element.appendChild(textarea);

		// 하단 : 안내 + 글자 수 + 버튼
		var foot = document.createElement('div');
		foot.className = 'aui-ta-foot';

		var help = document.createElement('span');
		help.className = 'aui-ta-help';
		if (props.showHelp) {
			// 사용자 안내는 HTML로 실행하지 않고 텍스트로 표시합니다. 단축키 동작과는 별개입니다.
			help.textContent = props.helpText;
			help.title = help.textContent;
		}

		this.__counter = document.createElement('span');
		this.__counter.className = 'aui-ta-counter';

		this.__cancelBtn = document.createElement('button');
		this.__cancelBtn.type = 'button';
		this.__cancelBtn.className = 'custom-textarea-cancel-btn';
		this.__cancelBtn.textContent = props.cancel;
		this.__cancelBtn.addEventListener('click', this.__onCancel);

		this.__confirmBtn = document.createElement('button');
		this.__confirmBtn.type = 'button';
		this.__confirmBtn.className = 'custom-textarea-confirm-btn';
		this.__confirmBtn.textContent = props.confirm;
		this.__confirmBtn.addEventListener('click', this.__onConfirm);

		// 화면 배치와 Tab 이동 순서를 모두 확인, 취소 순으로 맞춥니다.
		foot.append(help, this.__counter, this.__confirmBtn, this.__cancelBtn);
		this.element.appendChild(foot);

		this.__updateCounter();

		// DOM 배치 뒤 포커스, 높이 조절을 적용합니다. destroy 에서 취소할 수 있도록 타이머를 보관합니다.
		this.__focusTimer = setTimeout(
			function () {
				this.__focusTimer = null;
				if (!this.__textarea) return;
				this.__autoResize();
				this.__textarea.focus();
				if (props.selectAll) {
					this.__textarea.select();
				} else {
					var end = this.__textarea.value.length;
					this.__textarea.setSelectionRange(end, end);
				}
			}.bind(this)
		);
	},

	/*
	 * @Overriden public destroy
	 * 셀 수정 완료(취소) 될 때 마지막에 호출됩니다.
	 */
	destroy: function (unload) {
		clearTimeout(this.__focusTimer);
		this.__focusTimer = null;

		// create 가 끝나기 전에 닫히는 경우에도 오류가 나지 않도록 확인 후 해제합니다.
		if (this.__textarea) {
			this.__textarea.removeEventListener('input', this.__onInput);
			this.__textarea.removeEventListener('keydown', this.__onKeyDown);
		}
		if (this.__confirmBtn) this.__confirmBtn.removeEventListener('click', this.__onConfirm);
		if (this.__cancelBtn) this.__cancelBtn.removeEventListener('click', this.__onCancel);

		this.__textarea = null;
		this.__confirmBtn = null;
		this.__cancelBtn = null;
		this.__counter = null;

		// 필수 : 반드시 아래 코드는 추가 해야 합니다.
		this.$super.destroy(unload);
	},

	/*
	 * @Overriden public triggerEditEndEvent
	 * 에디팅 완료(cellEditEnd) 이벤트를 발생 시키고 실제로 에디팅 종료시킵니다.
	 */
	triggerEditEndEvent: function (newValue, which) {
		this.$super.triggerEditEndEvent(newValue, which);
	},

	/*
	 * @Overriden public triggerEditCancelEvent
	 * 에디팅 취소(cellEditCancel) 이벤트를 발생 시키고 에디팅 취소시킵니다.
	 */
	triggerEditCancelEvent: function (which) {
		this.$super.triggerEditCancelEvent(which);
	},

	/* 버튼, 단축키 및 바깥 클릭 모두 현재 입력을 기준으로 같은 완료 정책을 적용합니다. */
	triggerEditComplete: function (cancel, which) {
		if (!cancel && this.__textarea) {
			var value = this.__currentValue();
			// 표시 문자열이 같으면 원래 데이터의 타입과 값이 그대로 남도록 변경을 취소합니다.
			cancel = value === this.__original;
			if (!cancel) this.injectValue(value);
		}
		this.$super.triggerEditComplete(cancel, which);
	},

	/*
	 * @Overriden public injectValue
	 * 외부 요인(다른 셀 클릭 등)으로 편집이 완료될 때 적용할 값을 주입합니다.
	 */
	injectValue: function (value) {
		this.$super.injectValue(value);
	},

	/****************************************************************
	 *
	 * Private Methods (규칙 : __ 로 시작)
	 *
	 ****************************************************************/

	/* extraProps 기본값 */
	__props: function () {
		var p = this.extraProps || {};
		var submitKey = p.submitKey === 'enter' ? 'enter' : 'ctrlEnter';
		return {
			confirm: p.confirm || '확인',
			cancel: p.cancel || '취소',
			submitKey: submitKey,
			maxLength: p.maxLength > 0 ? p.maxLength : 0,
			showCounter: p.showCounter != null ? !!p.showCounter : p.maxLength > 0,
			placeholder: p.placeholder || '',
			rows: p.rows > 0 ? p.rows : 4,
			autoResize: p.autoResize !== false,
			maxRows: p.maxRows > 0 ? p.maxRows : 12,
			trim: !!p.trim,
			selectAll: p.selectAll !== false,
			showHelp: p.showHelp !== false,
			// 생략하면 기존 안내를 유지하고, 빈 문자열을 명시하면 문구를 표시하지 않습니다.
			helpText: p.helpText != null ? String(p.helpText) : (submitKey === 'enter' ? 'Enter 확인, Shift+Enter 줄바꿈, Esc 취소' : 'Ctrl+Enter 확인, Esc 취소')
		};
	},

	/* 확정할 값 */
	__currentValue: function () {
		var value = this.__textarea.value;
		return this.__props().trim ? value.trim() : value;
	},

	/*
	 * [수정 2, 3, 4] 키 입력, 붙여넣기, 잘라내기, 끌어다 놓기, 입력기 조합, 실행 취소 등
	 * 내용이 바뀌는 모든 경우 input 이벤트로 값을 주입합니다.
	 * 처음 값으로 되돌린 경우의 원본 보존은 triggerEditComplete에서 공통 처리합니다.
	 */
	__onInput: function () {
		this.__autoResize();
		this.__updateCounter();
		this.injectValue(this.__currentValue());
	},

	/*
	 * [수정 5] keydown 에서 처리하고, 입력기 조합 중에는 무시합니다.
	 */
	__onKeyDown: function (event) {
		// 한글 등 입력기 조합 중 (keyCode 229 는 일부 브라우저의 조합 중 키)
		if (event.isComposing || event.keyCode === 229) return;

		var props = this.__props();
		if (event.key === 'Escape') {
			event.preventDefault();
			event.stopPropagation();
			this.__onCancel();
			return;
		}
		if (event.key === 'Enter') {
			// 기본 확정 키는 Ctrl+Enter이며 Cmd(Meta)를 누른 조합은 확정하지 않습니다.
			var submit = props.submitKey === 'enter' ? !event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey : event.ctrlKey && !event.metaKey;
			if (submit) {
				event.preventDefault();
				event.stopPropagation();
				this.__onConfirm();
				return;
			}
		}
		// 입력 중의 키(방향키, Home, End, Delete 등)가 그리드 키 처리로 전달되지 않게 합니다.
		event.stopPropagation();
	},

	__onConfirm: function () {
		var value = this.__currentValue();
		// 바뀐 것이 없으면 취소로 닫아 수정 표시가 남지 않게 합니다.
		if (value === this.__original) {
			this.triggerEditCancelEvent();
			return;
		}
		this.triggerEditEndEvent(value);
	},

	__onCancel: function () {
		this.triggerEditCancelEvent();
	},

	/* 내용에 맞춰 높이를 조절합니다. (rows ~ maxRows) */
	__autoResize: function () {
		var textarea = this.__textarea;
		var props = this.__props();
		if (!textarea || !props.autoResize) return;
		var style = window.getComputedStyle(textarea);
		var lineHeight = parseFloat(style.lineHeight) || 18;
		var extra = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
		textarea.style.height = 'auto';
		var min = lineHeight * props.rows + extra;
		var max = lineHeight * props.maxRows + extra;
		textarea.style.height = Math.min(max, Math.max(min, textarea.scrollHeight + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth))) + 'px';
	},

	__updateCounter: function () {
		var props = this.__props();
		if (!this.__counter) return;
		if (!props.showCounter) {
			this.__counter.textContent = '';
			return;
		}
		var length = this.__textarea.value.length;
		this.__counter.textContent = props.maxLength ? length + ' / ' + props.maxLength : length + '자';
		this.__counter.classList.toggle('aui-ta-counter-full', !!props.maxLength && length >= props.maxLength);
	}
}).extend(window.AUIGrid.EditRendererBase);
