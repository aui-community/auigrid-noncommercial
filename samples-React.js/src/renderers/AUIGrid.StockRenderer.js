import { createRoot } from 'react-dom/client';
import Stock from '../components/Stock';

/* eslint-disable */
/*
 * AUIGrid 사용자 정의 렌더러
 */
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

	// 리액트 DOM 노드(루트)
	__reactDomNode: null,

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

		// 리액트 Stock 컴포넌트 렌더링
		this.__reactDomNode.render(<Stock close={data.close} vars={data.vars} gap={data.gap} />);
	},

	/*
	 * @Overriden public destroy
	 *
	 * 여기서 해제할 것 모두 해제 하십시오.
	 * 메모리 누수를 유발하는 코드들을 모두 해제 하십시오.
	 */
	destroy: function (unload) {
		// 리액트 DOM 제거
		if (this.__reactDomNode !== null) {
			this.__reactDomNode.unmount();
			this.__reactDomNode = null;
		}

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

		// 리액트 DOM(루트)
		this.__reactDomNode = createRoot(this.element);
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
