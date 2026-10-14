/*
 * AUIGrid 사용자 정의 렌더러 - Vue 주가 컴포넌트
 *
 * 행의 현재가(close), 등락률(vars)과 등락 차이(gap)를 Vue 컴포넌트에 전달하여 한 셀에 표시합니다.
 * 값이 바뀌면 컴포넌트를 갱신하고, 렌더러가 제거될 때 컴포넌트도 해제합니다.
 *
 * 연결 파일
 *   그리드 래퍼로 AUIGrid를 로드한 뒤 이 모듈을 import합니다.
 *   import StockRenderer from "../renderers/AUIGrid.StockRenderer";
 *   src/components/StockView.vue와 해당 CSS를 함께 제공합니다.
 *   상승 및 하락 아이콘은 페이지 기준 ./assets/ico_up.gif와 ./assets/ico_down.gif를 사용합니다.
 *
 * 사용법
 *   {
 *     dataField: "close",
 *     renderer: { type: "CustomRenderer", jsClass: StockRenderer }
 *   }
 *   행 데이터 예: { close: "72,000", vars: "1.5", gap: "1,000" }
 *
 * 설정 변경
 *   표시 모양은 StockView 컴포넌트와 CSS에서 바꿉니다. 이 예제에는 extraProps 옵션이 없습니다.
 */
import { h, render } from 'vue';
import StockView from '../components/StockView.vue';

/* eslint-disable */
export default window.AUIGrid.Class({
	/****************************************************************
	 *
	 * Overriden Properties
	 *
	 ****************************************************************/

	/* 생성될 HTML Tag 명 */
	tagName: 'div',

	/* CSS 스타일 클래스 */
	cssClass: 'aui-grid-renderer-base aui-grid-renderer-custom',

	/* 행 아이템 */
	data: null,

	/* 렌더러의 칼럼 레이아웃 데이터 */
	columnData: null,

	/* 칼럼 인덱스 */
	columnIndex: -1,

	/* 행 인덱스 */
	rowIndex: -1,

	/* 헤더 텍스트 */
	headerText: '',

	/* 데이터 필드명 */
	dataField: '',

	/* 초기화 여부 */
	initialized: false,

	/****************************************************************
	 *
	 * Private Properties
	 *
	 * Rule : Private Properties 는 반드시 __ 로 시작하십시오
	 * 즉, 사용자가 추가하는 속성, 메소드는 __ 로 시작하십시오.
	 *
	 ****************************************************************/

	// vue vnode
	__vnode: null,

	/****************************************************************
	 *
	 * Overriden Methods
	 *
	 ****************************************************************/

	/*
	 * @Overriden public update
	 *
	 * 그리드에 의해 호출되는 메소드이며 빈번히 호출됩니다.
	 * 이 메소드에서 DOM 검색이나, jQuery 객체 생성 등은 자제하십시오.
	 * DOM 검색이나 jQuery 객체는 initialize() 메소드에서 하십시오.
	 */
	update: function () {
		const data = this.data;

		if (!data) return;

		// 최초 1회만 실행해야 할 것들.
		if (!this.initialized) {
			this.initialize();
		}

		//console.log(data);

		// vue vnode 작성
		this.__vnode = h(StockView, {
			close: data.close,
			vars: data.vars,
			gap: data.gap
		});

		// vue render 함수
		render(this.__vnode, this.element);
	},

	/*
	 * @Overriden public destroy
	 *
	 * 여기서 해제할 것 모두 해제 하십시오.
	 * 메모리 누수를 유발하는 코드들을 모두 해제 하십시오.
	 */
	destroy: function (unload) {
		// vue vnode 제거
		if (this.element) render(null, this.element);
		this.__vnode = null;
		// 필수 : 반드시 아래 코드는 추가 해야 합니다.
		this.$super.destroy(unload);
	},

	/*
	 * @Overriden public initialize
	 *
	 * 최초 1번만 실행되므로 설정할 사항이 있으면 여기서 설정하십시오.
	 */
	initialize: function () {
		if (this.initialized) return;

		this.initialized = true;
	}

	/****************************************************************
	 *
	 * Private Methods
	 *
	 * Rule : Private Methods 는 반드시 __ 로 시작하십시오
	 * 즉, 사용자가 추가하는 속성, 메소드는 __ 로 시작하십시오.
	 *
	 ****************************************************************/
}).extend(window.AUIGrid.RendererBase);
