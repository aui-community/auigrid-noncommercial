<script>
	// AUIGrid 컴포넌트
	import AUIGrid from '../static/AUIGrid-Vue.js/AUIGrid.vue';
	import MyInputRenderer from '../renderers/MyInputRenderer';

	export default {
		components: {
			AUIGrid
		},

		data: () => ({
			// 그리드 속성 정의
			gridProps: {
				width: '100%',
				height: 480,
				// 행 높이 설정
				rowHeight: 34,
				editable: true,
				showStateColumn: true
			},

			//AUIGrid 칼럼 설정
			columnLayout: [
				{
					dataField: 'name',
					headerText: 'Name',
					width: 260
				},
				{
					dataField: 'country',
					headerText: '커스텀 렌더러-Input',
					width: 280,
					widthFit: 140,
					editable: false, // 그리드의 에디팅 사용 안함( 커스텀 렌더러에 자체 에디팅 가능한 input 이 존재하여 에디팅 처리 하기 위함 )
					headerTooltip: {
						show: true,
						tooltipHtml: '사용자 정의 렌더러를 작성한 칼럼입니다.'
					},
					renderer: {
						type: 'CustomRenderer',
						jsClass: MyInputRenderer
					}
				}
			],
			gridData: [
				{ name: 'Anna', country: 'Japan' },
				{ name: 'Emma', country: 'USA' },
				{ name: 'Steve', country: 'Italy' },
				{ name: 'Jennifer', country: 'China' },
				{ name: 'Jennifer', country: 'UK' },
				{ name: 'Lawrence', country: 'Singapore' },
				{ name: 'Jennifer', country: 'Japan' },
				{ name: 'Steve', country: 'Ireland' },
				{ name: 'Anna', country: 'Italy' },
				{ name: 'Kim', country: 'France' },
				{ name: 'Emma', country: 'China' },
				{ name: 'Jennifer', country: 'France' },
				{ name: 'Kim', country: 'Japan' },
				{ name: 'Steve', country: 'USA' },
				{ name: 'Emma', country: 'France' },
				{ name: 'Emma', country: 'USA' },
				{ name: 'Emma', country: 'Italy' },
				{ name: 'Emma', country: 'Japan' },
				{ name: 'Lawrence', country: 'Korea' },
				{ name: 'Jennifer', country: 'Japan' },
				{ name: 'Steve', country: 'USA' }
			]
		}),

		created() {
			console.log('CustomRendererInput 생성됨');
		},

		mounted() {
			console.log('CustomRendererInput 마운트됨');

			const grid = this.$refs.myGrid;

			grid.bind(['cellClick'], (event) => {
				console.log(event);
			});

			// 그리드 데이터 삽입
			grid.setGridData(this.gridData);
		},

		unmounted() {
			console.log('CustomRendererInput 언마운트됨');
		},

		methods: {}
	};
</script>
<template>
	<div>
		<div class="desc">
			<p>Vue에서 어떻게 CustomRenderer 를 정의하고 사용하는지를 보여주는 데모입니다.</p>
			<p>이 샘플은 일반 JS에 작성한 AUIGrid.MyInputRenderer 를 Vue로 출력한 모습입니다.</p>
			<p>
				즉, <a href="https://www.auisoft.net/demo/auigrid/renderer_custom_input.html?er_cus_1&theme=default&s=5700" target="_blank" rel="noreferrer"> <strong>사용자 정의 렌더러 - Input 샘플</strong></a
				>을 그대로 Vue로 작성한 데모입니다.
			</p>
		</div>
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" />
	</div>
</template>
