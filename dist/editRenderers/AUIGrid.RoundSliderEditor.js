/*!
 * AUIGrid Non-Commercial v3.0.20.2 - Round slider edit renderer sample
 * Copyright (c) AUISoft Co., Ltd. All rights reserved.
 *
 * AUIGrid 예제 파일입니다. AUIGrid 사용권 범위 안에서 이 파일을 복사하거나 수정하여 사용할 수 있습니다.
 * 이 허용은 이 예제 파일에만 적용되며 AUIGrid.js에는 적용되지 않습니다.
 * This is an AUIGrid sample file. You may copy and modify it for use with AUIGrid within the
 * scope of your AUIGrid license. This permission applies only to this sample file, not to AUIGrid.js.
 * Uses roundSlider (MIT, https://roundsliderui.com) and jQuery (MIT), loaded separately.
 * License: https://github.com/aui-community/auigrid-noncommercial/blob/main/LICENSE
 */
/*
 * AUIGrid 사용자 정의 에디트 렌더러 - 원형 범위 슬라이더 편집기
 *
 * jQuery roundSlider의 두 손잡이로 숫자 범위를 편집합니다.
 * 슬라이더에서 변경한 값을 injectValue()로 보관하고, 그리드가 편집을 완료할 때 적용합니다.
 *
 * 연결 파일
 *   AUIGrid.js, jQuery와 roundslider.min.js 및 roundslider.min.css가 필요합니다.
 *   AUIGrid.js 다음에 AUIGrid.RoundSliderEditor.js를 연결하고 편집 시작 전에 roundSlider를 로드합니다.
 *   WebDemo의 roundSlider 파일은 external/round-slider/에 있습니다.
 *
 * 사용법 (그리드 속성 editable: true)
 *   {
 *     dataField: "range", // 예: "100,300"
 *     editRenderer: {
 *       type: "CustomEditRenderer",
 *       jsClass: AUIGrid.RoundSliderEditor,
 *       vPosition: "bottom",
 *       extraProps: { min: 0, max: 1000, step: 50 }
 *     }
 *   }
 *
 * 데이터와 옵션
 *   기본 sliderType은 "range"이며 값은 "시작값,끝값" 형태로 주고받습니다.
 *   extraProps는 roundSlider 옵션에 전달되어 기본 설정을 덮어씁니다.
 *   change 콜백을 바꾸면 기존 injectValue() 호출도 유지해야 변경값을 저장할 수 있습니다.
 *   별도 렌더러 CSS 없이 roundSlider의 CSS를 사용합니다. 외부 라이브러리: https://roundsliderui.com/
 */
/* eslint-disable */
window.AUIGrid.RoundSliderEditor = window.AUIGrid.Class({
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
	cssClass: 'aui-grid-edit-renderer-custom aui-grid-custom-roud-slider-editor',

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
		// roundSlider 제거
		$(this.element).roundSlider('destroy');

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
		// 속성 : https://roundsliderui.com/document.html
		$(this.element).roundSlider({
			handleShape: 'dot',
			radius: 100,
			width: 25,
			sliderType: 'range',
			svgMode: true,
			value: this.data[this.dataField],
			change: function (event) {
				// 변경된 값 주입
				this.injectValue(event.value);
			}.bind(this),
			...this.extraProps
		});
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
