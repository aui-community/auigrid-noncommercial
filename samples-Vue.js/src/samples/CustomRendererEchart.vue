<script>
	// AUIGrid 컴포넌트
	import AUIGrid from '../static/AUIGrid-Vue.js/AUIGrid.vue';
	// 아파치 ECharts 출력하는 AUIGrid 렌더러
	import AUIGridEChartsRenderer from '../renderers/AUIGrid.EChartsRenderer';
	import './samples.css';

	export default {
		components: {
			AUIGrid
		},

		data: () => ({
			// 그리드 속성 정의
			gridProps: {
				// 행 인덱스 칼럼 30 사이즈
				rowNumColumnWidth: 30,

				// 행 높이 102
				// 차트의 높이를 100으로 설정함.
				rowHeight: 102,

				height: 480
			},

			// 그리드 칼럼 레이아웃
			columnLayout: [
				{
					dataField: 'region',
					headerText: '지역',
					width: 120
				},
				{
					dataField: 'chartField', // 임의로 유니크하게 입력
					headerText: '비율',
					width: 300,
					sortable: false,
					headerTooltip: {
						show: true,
						tooltipHtml: '사용자 정의 렌더러를 작성한 칼럼입니다.'
					},
					renderer: {
						type: 'CustomRenderer',
						jsClass: AUIGridEChartsRenderer // AUIGrid 차트 렌더러 커스텀 컴포넌트
					}
				},
				{
					dataField: 'q1',
					headerText: 'Q1',
					dataType: 'numeric'
				},
				{
					dataField: 'q2',
					headerText: 'Q2',
					dataType: 'numeric'
				},
				{
					dataField: 'q3',
					headerText: 'Q3',
					dataType: 'numeric'
				},
				{
					dataField: 'q4',
					headerText: 'Q4',
					dataType: 'numeric'
				}
			],

			gridData: [
				{ region: '서울', q1: 373264, q2: 325630, q3: 272396, q4: 427750 },
				{ region: '경기인천', q1: 390542, q2: 77663, q3: 231813, q4: 296600 },
				{ region: '강원', q1: 432291, q2: 22411, q3: 568332, q4: 65203 },
				{ region: '충북', q1: 710499, q2: 302877, q3: 236852, q4: 794240 },
				{ region: '충남', q1: 914093, q2: 967222, q3: 775029, q4: 81676 },
				{ region: '대전', q1: 734707, q2: 436940, q3: 215340, q4: 612949 },
				{ region: '경북', q1: 307353, q2: 300957, q3: 470717, q4: 736408 },
				{ region: '대구', q1: 145168, q2: 665827, q3: 390579, q4: 626354 },
				{ region: '경남', q1: 714837, q2: 55729, q3: 544365, q4: 89502 },
				{ region: '부산', q1: 660382, q2: 551184, q3: 251912, q4: 606440 },
				{ region: '전북', q1: 983151, q2: 615463, q3: 496435, q4: 860253 },
				{ region: '전남', q1: 262013, q2: 801265, q3: 83713, q4: 382659 },
				{ region: '광주', q1: 246670, q2: 678903, q3: 993655, q4: 505170 },
				{ region: '제주', q1: 487568, q2: 403859, q3: 807833, q4: 145756 }
			]
		}),
		created() {
			console.log('CustomRendererEchart 생성됨');
		},

		mounted() {
			console.log('CustomRendererEchart 마운트됨');

			const grid = this.$refs.myGrid;
			// 그리드 데이터 삽입
			grid.setGridData(this.gridData);
		},

		unmounted() {
			console.log('CustomRendererEchart 언마운트됨');
		},
		methods: {}
	};
</script>
<template>
	<div>
		<div class="desc">
			<p>Apache ECharts 커스텀 렌더러 작성한 예제입니다.</p>
			<p>Apache ECharts is licensed under Apache License 2.0.</p>
			<a href="https://echarts.apache.org/en/index.html" target="_blank" class="link-is-link">https://echarts.apache.org/en/index.html</a>
		</div>
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" />
	</div>
</template>
