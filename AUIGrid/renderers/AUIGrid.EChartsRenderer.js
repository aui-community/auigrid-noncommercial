/*!
 * AUIGrid Non-Commercial v3.0.20.2 - ECharts renderer sample
 * Copyright (c) AUISoft Co., Ltd. All rights reserved.
 *
 * AUIGrid 예제 파일입니다. AUIGrid 사용권 범위 안에서 이 파일을 복사하거나 수정하여 사용할 수 있습니다.
 * 이 허용은 이 예제 파일에만 적용되며 AUIGrid.js에는 적용되지 않습니다.
 * This is an AUIGrid sample file. You may copy and modify it for use with AUIGrid within the
 * scope of your AUIGrid license. This permission applies only to this sample file, not to AUIGrid.js.
 * Uses Apache ECharts (Apache License 2.0, https://echarts.apache.org), loaded separately.
 * License: https://github.com/aui-community/auigrid-noncommercial/blob/main/LICENSE
 */
/*
 * AUIGrid 사용자 정의 렌더러 - ECharts 원형 차트
 *
 * 행의 분기별 값을 ECharts 원형 차트로 표시합니다.
 * 차트 높이는 100px이며, 그리드 rowHeight도 차트를 담을 수 있게 설정합니다. 데모는 102입니다.
 *
 * 연결 파일
 *   AUIGrid.js 다음에 AUIGrid.EChartsRenderer.js를 연결하고, 그리드 생성 전에 ECharts를 로드합니다.
 *   별도 렌더러 CSS는 없습니다. 외부 라이브러리: https://echarts.apache.org/en/index.html
 *
 * 사용법
 *   {
 *     dataField: "chartField", // 차트를 배치할 칼럼의 고유 필드명
 *     renderer: {
 *       type: "CustomRenderer",
 *       jsClass: AUIGrid.ChartRenderer
 *     }
 *   }
 *   행 데이터 예: { region: "서울", q1: 10, q2: 20, q3: 30, q4: 40 }
 *
 * 데이터와 설정
 *   region은 시리즈 이름, q1~q4는 숫자 값입니다. chartField의 값 대신 이 필드들을 읽습니다.
 *   차트 모양은 __drawChart()의 option에서 바꿉니다. 이 예제에는 extraProps 옵션이 없습니다.
 *   GCharts 예제도 AUIGrid.ChartRenderer라는 이름을 사용하므로 두 렌더러 JS를 동시에 연결하지 않습니다.
 */
/* eslint-disable */
window.AUIGrid.ChartRenderer = window.AUIGrid.Class({
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

	/* 현재 렌더링되는 주체의 그리드 pid. 그리드 생성 후 주입됨 */
	pid: '',

	/****************************************************************
	 *
	 * Private Properties
	 *
	 * Rule : Private Properties 는 반드시 __ 로 시작하십시오
	 * 즉, 사용자가 추가하는 속성, 메소드는 __ 로 시작하십시오.
	 *
	 ****************************************************************/

	/* echart  객체 */
	__chart: null,

	/****************************************************************
	 *
	 * Overriden Methods
	 *
	 ****************************************************************/

	/*
	 * @Overriden public update
	 *
	 * 그리드에 의해 호출되는 메소드이며 빈번히 호출됩니다.
	 * 이 메소드에서 DOM 검색이나 조작은 자제하십시오.
	 */
	update: function () {
		// 행 아이템
		const data = this.data;
		if (!data) return;

		// 최초 1회만 실행해야 할 것들.
		if (!this.initialized) {
			this.initialize();
		}

		// 실제 echart  출력
		this.__drawChart();
	},

	/*
	 * @Overriden public destroy
	 *
	 * 여기서 해제할 것 모두 해제 하십시오.
	 * 메모리 누수를 유발하는 코드들을 모두 해제 하십시오.
	 */
	destroy: function (unload) {
		// echart  제거
		this.__chart.clear();
		this.__chart = null;

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

		// echarts 초기화
		this.__chart = echarts.init(this.element, '', {
			width: this.width,
			height: 100
		});
	},

	/****************************************************************
	 *
	 * Private Methods
	 *
	 * Rule : Private Methods 는 반드시 __ 로 시작하십시오
	 * 즉, 사용자가 추가하는 속성, 메소드는 __ 로 시작하십시오.
	 *
	 ****************************************************************/

	/* echart 출력하기 */
	__drawChart: function () {
		const item = this.data;

		// 다음 참고하여 작성함.
		// https://echarts.apache.org/examples/en/editor.html?c=pie-simple
		const option = {
			tooltip: {
				confine: true,
				trigger: 'item'
			},
			series: [
				{
					name: item.region,
					type: 'pie',
					radius: '50%',
					data: [
						{ value: item.q1, name: 'Q1' },
						{ value: item.q2, name: 'Q2' },
						{ value: item.q3, name: 'Q3' },
						{ value: item.q4, name: 'Q4' }
					],
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]
		};

		option && this.__chart.setOption(option);
	}
}).extend(window.AUIGrid.RendererBase);
