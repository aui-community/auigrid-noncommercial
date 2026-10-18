/*!
 * AUIGrid Non-Commercial v3.0.20.1 - Color picker edit renderer sample
 * Copyright (c) AUISoft Co., Ltd. All rights reserved.
 *
 * AUIGrid 예제 파일입니다. AUIGrid 사용권 범위 안에서 이 파일을 복사하거나 수정하여 사용할 수 있습니다.
 * 이 허용은 이 예제 파일에만 적용되며 AUIGrid.js에는 적용되지 않습니다.
 * This is an AUIGrid sample file. You may copy and modify it for use with AUIGrid within the
 * scope of your AUIGrid license. This permission applies only to this sample file, not to AUIGrid.js.
 * Uses Spectrum (MIT, https://github.com/bgrins/spectrum) and jQuery (MIT), loaded separately.
 * License: https://github.com/aui-community/auigrid-noncommercial/blob/main/LICENSE
 */
/*
 * AUIGrid 사용자 정의 에디트 렌더러 - Spectrum 색상 편집기
 *
 * jQuery Spectrum 색상 선택기를 셀 편집기로 연결하는 예제입니다.
 * 색상표 또는 직접 입력으로 색상을 고르고 확인하면 HEX 문자열을 저장하며, 취소하면 기존 값을 유지합니다.
 *
 * 연결 파일
 *   AUIGrid.js, jQuery와 Spectrum의 spectrum.js 및 spectrum.css가 필요합니다.
 *   AUIGrid.js 다음에 AUIGrid.SpectrumEditor.js를 연결하고 편집 시작 전에 Spectrum을 로드합니다.
 *   WebDemo의 Spectrum 파일은 external/spectrum/에 있습니다.
 *
 * 사용법 (그리드 속성 editable: true)
 *   {
 *     dataField: "color", // 예: "#ff8800"
 *     editRenderer: {
 *       type: "CustomEditRenderer",
 *       jsClass: AUIGrid.SpectrumEditor,
 *       vPosition: "bottom"
 *     }
 *   }
 *
 * 설정 변경
 *   이 예제는 extraProps를 Spectrum에 전달하지 않습니다.
 *   색상표와 버튼 문구 등은 create()의 spectrum() 옵션에서 변경합니다.
 *   별도 렌더러 CSS 없이 Spectrum의 CSS를 사용합니다.
 *   외부 라이브러리: Spectrum (MIT License), https://github.com/bgrins/spectrum
 */
/* eslint-disable */
window.AUIGrid.SpectrumEditor = window.AUIGrid.Class({
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
	cssClass: 'aui-grid-edit-renderer-custom aui-grid-spectrum-color-picker',

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

	/****************************************************************
	 *
	 * Private Properties
	 *
	 * Rule : Private Properties 는 반드시 __ 로 시작하십시오
	 * 즉, 사용자가 추가하는 속성, 메소드는 __ 로 시작하십시오.
	 *
	 ****************************************************************/

	// input 엘리먼트
	__inputEle: null,

	/****************************************************************
	 *
	 * Overriden Methods
	 *
	 ****************************************************************/

	/*
	 * @Overriden public destroy
	 * @param {boolean} unload 실제 DOM 에서 제거할지 여부
	 *
	 * 셀 수정 완료(취소) 될 때 마지막에 호출됩니다.
	 * 여기서 해제할 것 모두 해제 하십시오.
	 * 메모리 누수를 유발하는 코드들을 모두 해제 하십시오.
	 */
	destroy: function (unload) {
		// 스펙트럼 제거
		$(this.__inputEle).spectrum('destroy');
		this.__inputEle = null;

		// 필수 : 반드시 아래 코드는 추가 해야 합니다.
		this.$super.destroy(unload);
	},

	/*
	 * @Overriden public create
	 *
	 * 셀 수정 진입할 때 동적으로 에디트렌더러가 생성되며 그리드에 의해 호출됩니다.
	 * 초기 엘리먼트 생성 및 이벤트를 설정하십시오.
	 */
	create: function () {
		// 컬러픽커(스펙트럼) 출력할 input 생성
		this.__inputEle = document.createElement('input');
		this.element.appendChild(this.__inputEle);

		// 스펙트럼 생성
		// 설정 가능 속성 API 문서 : https://bgrins.github.io/spectrum/#options
		$(this.__inputEle).spectrum({
			flat: true,
			color: this.data[this.dataField], // 현재 컬러
			showInput: true,
			cancelText: '취 소',
			chooseText: '확 인',
			preferredFormat: 'hex',
			clickoutFiresChange: false,
			showPalette: true,
			palette: ['#FF00FF', '#FFCC33', '#FF3333', '#6699FF', '#33CC00'],
			change: function (event) {
				//console.log(event);
				this.__updateColor(event.toHexString());
			}.bind(this)
		});

		// 스펙트럼 취소 버턴 클릭
		$(this.__inputEle)
			.spectrum('container')
			.find('.sp-cancel')
			.bind(
				'click.spectrum',
				function (event) {
					// 그리드 셀 수정 취소 처리
					this.triggerEditCancelEvent();
				}.bind(this)
			);
	},

	/*
	 * @Overriden public triggerEditEndEvent
	 * @param {object} newValue 에디팅 완료로 적용 시킬 새로운 값
	 * @param {string} which 에디팅 완료를 발생 시킨 행위에 대한 정의
	 *
	 * 에디팅 완료(cellEditEnd) 이벤트를 발생 시키고 실제로 에디팅 종료시킵니다.
	 */
	triggerEditEndEvent: function (newValue, which) {
		this.$super.triggerEditEndEvent(newValue, which);
	},

	/*
	 * @Overriden public triggerEditCancelEvent
	 * @param {string} which 에디팅 취소를 발생 시킨 행위에 대한 정의
	 *
	 * 에디팅 취소(cellEditCancel) 이벤트를 발생 시키고 에디팅 취소시킵니다.
	 */
	triggerEditCancelEvent: function (which) {
		this.$super.triggerEditCancelEvent(which);
	},

	/*
	 * @Overriden public injectValue
	 * @ value {obejct} 새로운 값
	 *
	 * 외부에 의해 에디팅이 완료될 경우를 위해 값을 주입 시켜 놓습니다.
	 * 에디트렌더러의 정상적인 종료가 아닌 외부 특정 요인에 의해 수정 완료 처리될 때 여기서 주입시켜 놓은 값이 적용됩니다.
	 */
	injectValue: function (value) {
		this.$super.injectValue(value);
	},

	/****************************************************************
	 *
	 * Private Methods
	 *
	 * Rule : Private Methods 는 반드시 __ 로 시작하십시오
	 * 즉, 사용자가 추가하는 속성, 메소드는 __ 로 시작하십시오.
	 *
	 ****************************************************************/

	__updateColor: function (value) {
		//console.log(value);
		// 에디팅 완료 시킴
		this.triggerEditEndEvent(value);
	}
}).extend(window.AUIGrid.EditRendererBase);
