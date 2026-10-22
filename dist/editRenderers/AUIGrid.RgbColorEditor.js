/*!
 * AUIGrid Non-Commercial v3.0.20.2 - RGB color edit renderer sample
 * Copyright (c) AUISoft Co., Ltd. All rights reserved.
 *
 * AUIGrid 예제 파일입니다. AUIGrid 사용권 범위 안에서 이 파일을 복사하거나 수정하여 사용할 수 있습니다.
 * 이 허용은 이 예제 파일에만 적용되며 AUIGrid.js에는 적용되지 않습니다.
 * This is an AUIGrid sample file. You may copy and modify it for use with AUIGrid within the
 * scope of your AUIGrid license. This permission applies only to this sample file, not to AUIGrid.js.
 * License: https://github.com/aui-community/auigrid-noncommercial/blob/main/LICENSE
 */
/*
 * AUIGrid 사용자 정의 에디트 렌더러 - RGB 색상 편집기
 *
 * R, G, B 슬라이더와 숫자 입력, HEX 입력 및 색상표로 셀의 색상 값을 편집합니다.
 * Enter 또는 확인 버튼으로 적용하고, Esc 또는 취소 버튼으로 취소합니다.
 *
 * 연결 파일
 *   AUIGrid.js 다음에 AUIGrid.RgbColorEditor.js와 AUIGrid.RgbColorEditor.css를 연결합니다.
 *   별도 외부 라이브러리는 필요하지 않습니다.
 *
 * 사용법 (그리드 속성 editable: true)
 *   {
 *     dataField: "color",
 *     editRenderer: {
 *       type: "CustomEditRenderer",
 *       jsClass: AUIGrid.RgbColorEditor,
 *       vPosition: "bottom",
 *       extraProps: {
 *         format: "hex",                   // "hex"(기본) 또는 "rgb"
 *         palette: ["#e53935", "#43a047"], // 생략 시 기본 16색
 *         confirm: "확인", cancel: "취소"  // 버튼 문구
 *       }
 *     }
 *   }
 *
 * 데이터와 옵션
 *   기존 값은 #rgb, #rrggbb 또는 rgb(r, g, b) 문자열로 읽습니다.
 *   format에 따라 "#ff8800" 또는 "rgb(255, 136, 0)" 형식으로 저장합니다.
 *   palette에는 HEX 색상 배열을 지정합니다. confirm과 cancel의 기본값은 "확인", "취소"입니다.
 *   셀의 색상 미리보기는 칼럼 renderer에서 별도로 구성합니다.
 */
/* eslint-disable */
window.AUIGrid.RgbColorEditor = window.AUIGrid.Class({
	/****************************************************************
	 *
	 * Overriden Properties
	 *
	 ****************************************************************/

	/* 생성될 HTML Tag 명 */
	tagName: 'div',

	/* 렌더러 HTML 엘리먼트 */
	element: null,

	/* CSS 스타일 클래스 */
	cssClass: 'aui-grid-edit-renderer-custom aui-grid-edit-renderer-custom-rgb',

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

	/* 현재 색상 { r, g, b } */
	__rgb: null,

	/* 채널별 { range, number } 입력 엘리먼트 */
	__channels: null,

	__preview: null,
	__hexInput: null,
	__valueText: null,
	__palette: null,
	__confirmBtn: null,
	__cancelBtn: null,
	__focusTimer: null,

	/****************************************************************
	 *
	 * Overriden Methods
	 *
	 ****************************************************************/

	/*
	 * @Overriden public create
	 *
	 * 셀 수정 진입할 때 그리드에 의해 호출됩니다. 엘리먼트 생성 및 이벤트를 설정합니다.
	 */
	create: function () {
		const props = this.extraProps || {};
		const element = this.element;

		this.__rgb = this.__parseColor(this.data[this.dataField]) || { r: 0, g: 0, b: 0 };

		// 이벤트 핸들러 바인딩 (destroy 에서 해제하기 위해 보관)
		this.__onInput = this.__onInput.bind(this);
		this.__onHexInput = this.__onHexInput.bind(this);
		this.__onHexChange = this.__onHexChange.bind(this);
		this.__onPaletteClick = this.__onPaletteClick.bind(this);
		this.__onKeyDown = this.__onKeyDown.bind(this);
		this.__onConfirm = this.__onConfirm.bind(this);
		this.__onCancel = this.__onCancel.bind(this);

		// 미리보기 + HEX 입력
		const top = this.__el('div', 'rgb-top');
		this.__preview = this.__el('div', 'rgb-preview');
		const hexWrap = this.__el('div', 'rgb-hex');
		const hexLabel = this.__el('span', 'rgb-label');
		hexLabel.textContent = 'HEX';
		this.__hexInput = this.__el('input');
		this.__hexInput.type = 'text';
		this.__hexInput.maxLength = 7;
		this.__hexInput.spellcheck = false;
		this.__hexInput.setAttribute('aria-label', 'HEX 색상');
		this.__valueText = this.__el('div', 'rgb-value');
		hexWrap.append(hexLabel, this.__hexInput);
		top.append(this.__preview, hexWrap);
		element.append(top, this.__valueText);

		// R / G / B 채널
		this.__channels = {};
		['r', 'g', 'b'].forEach(function (key) {
			const row = this.__el('div', 'rgb-channel rgb-channel-' + key);
			const label = this.__el('span', 'rgb-label');
			label.textContent = key.toUpperCase();
			const range = this.__el('input');
			range.type = 'range';
			range.min = 0;
			range.max = 255;
			range.setAttribute('aria-label', key.toUpperCase() + ' 슬라이더');
			const number = this.__el('input');
			number.type = 'number';
			number.min = 0;
			number.max = 255;
			number.setAttribute('aria-label', key.toUpperCase() + ' 값');
			range.dataset.channel = key;
			number.dataset.channel = key;
			range.addEventListener('input', this.__onInput);
			number.addEventListener('input', this.__onInput);
			row.append(label, range, number);
			element.appendChild(row);
			this.__channels[key] = { range: range, number: number };
		}, this);

		// 기본 색상표
		this.__palette = this.__el('div', 'rgb-palette');
		(props.palette || this.__defaultPalette).forEach(function (color) {
			const swatch = this.__el('button', 'rgb-swatch');
			swatch.type = 'button';
			swatch.title = color;
			swatch.setAttribute('aria-label', color);
			swatch.style.background = color;
			swatch.dataset.color = color;
			this.__palette.appendChild(swatch);
		}, this);
		this.__palette.addEventListener('click', this.__onPaletteClick);
		element.appendChild(this.__palette);

		// 확인 / 취소
		const buttons = this.__el('div', 'rgb-buttons');
		this.__cancelBtn = this.__el('button', 'rgb-cancel');
		this.__cancelBtn.type = 'button';
		this.__cancelBtn.textContent = props.cancel || '취소';
		this.__confirmBtn = this.__el('button', 'rgb-confirm');
		this.__confirmBtn.type = 'button';
		this.__confirmBtn.textContent = props.confirm || '확인';
		this.__cancelBtn.addEventListener('click', this.__onCancel);
		this.__confirmBtn.addEventListener('click', this.__onConfirm);
		// 화면 배치와 Tab 이동 순서를 모두 확인, 취소 순으로 맞춥니다.
		buttons.append(this.__confirmBtn, this.__cancelBtn);
		element.appendChild(buttons);

		// 그리드는 다른 셀의 mousedown에서 먼저 편집을 끝낼 수 있으므로 change 전에 값을 주입합니다.
		this.__hexInput.addEventListener('input', this.__onHexInput);
		this.__hexInput.addEventListener('change', this.__onHexChange);
		element.addEventListener('keydown', this.__onKeyDown);

		this.__render();

		// HEX 입력에 포커스
		this.__focusTimer = setTimeout(
			function () {
				this.__focusTimer = null;
				if (!this.__hexInput) return;
				this.__hexInput.focus();
				this.__hexInput.select();
			}.bind(this)
		);
	},

	/*
	 * @Overriden public destroy
	 *
	 * 셀 수정 완료(취소) 될 때 마지막에 호출됩니다. 이벤트와 참조를 모두 해제합니다.
	 */
	destroy: function (unload) {
		// 즉시 닫거나 그리드를 제거한 경우에도 지연 포커스와 입력 리스너를 남기지 않습니다.
		clearTimeout(this.__focusTimer);
		this.__focusTimer = null;
		if (this.__channels) {
			Object.keys(this.__channels).forEach(function (key) {
				this.__channels[key].range.removeEventListener('input', this.__onInput);
				this.__channels[key].number.removeEventListener('input', this.__onInput);
			}, this);
		}
		if (this.__hexInput) {
			this.__hexInput.removeEventListener('input', this.__onHexInput);
			this.__hexInput.removeEventListener('change', this.__onHexChange);
		}
		if (this.__palette) this.__palette.removeEventListener('click', this.__onPaletteClick);
		if (this.__confirmBtn) this.__confirmBtn.removeEventListener('click', this.__onConfirm);
		if (this.__cancelBtn) this.__cancelBtn.removeEventListener('click', this.__onCancel);
		if (this.element) this.element.removeEventListener('keydown', this.__onKeyDown);

		this.__channels = null;
		this.__preview = null;
		this.__hexInput = null;
		this.__valueText = null;
		this.__palette = null;
		this.__confirmBtn = null;
		this.__cancelBtn = null;

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

	__defaultPalette: [
		'#000000', '#5f6672', '#a0a7b1', '#ffffff',
		'#e53935', '#fb8c00', '#fdd835', '#43a047',
		'#00897b', '#1e88e5', '#3949ab', '#8e24aa',
		'#f9a17d', '#ffe082', '#a5d6a7', '#90caf9'
	],

	/* 엘리먼트 생성 헬퍼 */
	__el: function (tag, className) {
		const el = document.createElement(tag);
		if (className) el.className = className;
		return el;
	},

	/* 슬라이더 / 숫자 입력 */
	__onInput: function (event) {
		const key = event.target.dataset.channel;
		const value = this.__clamp(event.target.value);
		if (isNaN(value)) return;
		this.__rgb[key] = value;
		this.__render(event.target);
	},

	/* HEX 입력 (입력을 마치고 포커스가 빠지거나 Enter 를 누를 때) */
	__onHexInput: function () {
		// 완성된 HEX만 반영하며 입력 중인 문자열과 커서 위치는 유지합니다.
		const rgb = this.__parseColor(this.__hexInput.value);
		if (!rgb) return;
		this.__rgb = rgb;
		this.__render();
	},

	__onHexChange: function () {
		const rgb = this.__parseColor(this.__hexInput.value);
		if (rgb) this.__rgb = rgb;
		this.__render();
	},

	/* 색상표 클릭 */
	__onPaletteClick: function (event) {
		const swatch = event.target.closest('.rgb-swatch');
		if (!swatch) return;
		this.__rgb = this.__parseColor(swatch.dataset.color);
		this.__render();
	},

	__onKeyDown: function (event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			event.stopPropagation();
			// HEX 입력 중 Enter 는 입력값을 먼저 반영합니다.
			if (event.target === this.__hexInput) this.__onHexChange();
			this.__onConfirm();
		} else if (event.key === 'Escape') {
			event.preventDefault();
			event.stopPropagation();
			this.__onCancel();
		}
	},

	__onConfirm: function () {
		this.triggerEditEndEvent(this.__formatValue());
	},

	__onCancel: function () {
		this.triggerEditCancelEvent();
	},

	/* 현재 색상을 모든 입력 요소와 미리보기에 반영합니다. (source 는 값을 입력 중인 요소라 건드리지 않음) */
	__render: function (source) {
		const rgb = this.__rgb;
		const hex = this.__toHex(rgb);
		['r', 'g', 'b'].forEach(function (key) {
			const ch = this.__channels[key];
			if (ch.range !== source) ch.range.value = rgb[key];
			if (ch.number !== source) ch.number.value = rgb[key];
			// 슬라이더 트랙에 해당 채널의 색 변화를 보여줍니다.
			const from = Object.assign({}, rgb, { [key]: 0 });
			const to = Object.assign({}, rgb, { [key]: 255 });
			ch.range.style.background = 'linear-gradient(to right, ' + this.__toHex(from) + ', ' + this.__toHex(to) + ')';
		}, this);
		if (document.activeElement !== this.__hexInput || source) this.__hexInput.value = hex;
		this.__preview.style.background = hex;
		const value = this.__formatValue();
		this.__valueText.textContent = value;

		// 외부 요인으로 편집이 끝나도 현재 색상이 적용되도록 값을 주입합니다.
		this.injectValue(value);
	},

	/* 저장 형식으로 변환 */
	__formatValue: function () {
		const rgb = this.__rgb;
		const format = (this.extraProps && this.extraProps.format) || 'hex';
		return format === 'rgb' ? 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')' : this.__toHex(rgb);
	},

	/* "#rgb", "#rrggbb", "rgb(r, g, b)" 를 { r, g, b } 로 변환합니다. 해석할 수 없으면 null */
	__parseColor: function (value) {
		if (value == null) return null;
		const text = String(value).trim().toLowerCase();
		let m = text.match(/^#?([0-9a-f]{6})$/);
		if (m) {
			return { r: parseInt(m[1].slice(0, 2), 16), g: parseInt(m[1].slice(2, 4), 16), b: parseInt(m[1].slice(4, 6), 16) };
		}
		m = text.match(/^#?([0-9a-f]{3})$/);
		if (m) {
			return { r: parseInt(m[1][0] + m[1][0], 16), g: parseInt(m[1][1] + m[1][1], 16), b: parseInt(m[1][2] + m[1][2], 16) };
		}
		m = text.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
		if (m) {
			return { r: this.__clamp(m[1]), g: this.__clamp(m[2]), b: this.__clamp(m[3]) };
		}
		return null;
	},

	__toHex: function (rgb) {
		const hex = function (n) {
			return ('0' + n.toString(16)).slice(-2);
		};
		return '#' + hex(rgb.r) + hex(rgb.g) + hex(rgb.b);
	},

	__clamp: function (value) {
		const n = Math.round(Number(value));
		if (isNaN(n)) return NaN;
		return Math.min(255, Math.max(0, n));
	}
}).extend(window.AUIGrid.EditRendererBase);
