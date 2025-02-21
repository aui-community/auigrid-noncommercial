<script>
	// AUIGrid 컴포넌트
	import AUIGrid from '../static/AUIGrid-Vue.js/AUIGrid.vue';
	import axios from 'axios';
	import './samples.css';

	export default {
		components: {
			AUIGrid
		},

		data: () => ({
			// 그리드 칼럼 레이아웃
			columnLayout: [
				{
					dataField: 'orderId',
					headerText: 'Order ID',
					width: 140
				},
				{
					dataField: 'country',
					headerText: 'Country',
					style: 'my-column-style2'
				},
				{
					dataField: 'name',
					headerText: 'Name'
				},
				{
					dataField: 'product',
					headerText: 'Product',
					style: 'my-column-style',
					styleFunction: (rowIndex, columnIndex, value) => {
						if (value === 'Galaxy S5') {
							return 'my-cell-style';
						}
						return null;
					}
				},
				{
					dataField: 'price',
					headerText: 'Price',
					dataType: 'numeric',
					style: 'my-right-column'
				},
				{
					dataField: 'phone',
					headerText: 'Phone'
				},
				{
					dataField: 'date',
					headerText: 'Date'
				}
			],

			//푸터 레이아웃 정의
			footerLayout: [
				{
					dataField: 'price',
					positionField: 'price',
					operation: 'SUM',
					dataType: 'numeric',
					formatString: '#,##0',
					style: 'aui-grid-my-footer-sum-total'
				},
				{
					dataField: 'price',
					positionField: 'date',
					operation: 'COUNT',
					style: 'aui-grid-my-footer-sum-total'
				},
				{
					labelText: 'Count=>',
					positionField: 'phone',
					style: 'aui-grid-my-footer-sum-total'
				}
			],

			// 그리드 속성 정의
			gridProps: {
				width: '100%',
				height: 480,
				showFooter: true,
				editable: true,
				showRowNumColumn: true,
				showRowCheckColumn: true,
				displayTreeOpen: true,
				// singleRow 선택모드
				selectionMode: 'multipleCells',
				// 그룹핑 패널 사용
				useGroupingPanel: true,
				// row Styling 함수
				rowStyleFunction: (rowIndex, item) => {
					if (item.country === 'USA') {
						return 'my-row-style';
					}
					return '';
				}
			}
		}),
		created() {
			console.log('StyleView 생성됨');
		},

		mounted() {
			console.log('StyleView 마운트됨');
			// 초기 데이터 얻기
			this.requestGridData();
		},

		unmounted() {
			console.log('StyleView 언마운트됨');
		},
		methods: {
			// row Styling 함수를 다른 함수로 변경
			changeRowStyleFunction() {
				const grid = this.$refs.myGrid;

				// row Styling 함수를 다른 함수로 변경
				grid.setProp('rowStyleFunction', (rowIndex, item) => {
					if (item.country === 'UK') {
						return 'my-row-style';
					}
					return '';
				});

				// 변경된 rowStyleFunction 이 적용되도록 그리드 업데이트
				grid.update();
			},

			// 그리드 데이터 조회하여 삽입
			requestGridData() {
				const grid = this.$refs.myGrid;
				const REQ_URL = './data/country_phone_500.json';

				grid.showAjaxLoader();
				axios.get(REQ_URL).then((result) => {
					//console.log(result);
					// 그리드 데이터 삽입
					grid.setGridData(result.data);
					grid.removeAjaxLoader();
				});
			}
		}
	};
</script>
<template>
	<div>
		<div class="desc">
			<p>특정 조건에 따라 동적으로 스타일을 정의합니다.</p>
			<p>행(row) 스타일링 : <span class="my-row-style"> Country = USA 인 경우 행에 스타일링</span></p>
			<p>셀 스타일링 : <span class="my-cell-style">Product = Galaxy S5 인 셀에 스타일링</span></p>
			<button class="btn" @click="changeRowStyleFunction">행 스타일링을 변경하기 ( Country 가 UK 인 행 스타일링 하기 )</button>
		</div>
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" :footerLayout="footerLayout" />
	</div>
</template>
