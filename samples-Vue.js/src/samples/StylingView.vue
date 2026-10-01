<script setup>
	import AUIGrid from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
	import axios from 'axios';
	import './samples.css';
	import { ref, onMounted } from 'vue';

	const myGrid = ref(null);

	const columnLayout = [
		{ dataField: 'orderId', headerText: 'Order ID', width: 140 },
		{ dataField: 'country', headerText: 'Country', style: 'my-column-style2' },
		{ dataField: 'name', headerText: 'Name' },
		{
			dataField: 'product',
			headerText: 'Product',
			style: 'my-column-style',
			styleFunction: (_rowIndex, _columnIndex, value) => {
				if (value === 'Galaxy S5') return 'my-cell-style';
				return null;
			}
		},
		{ dataField: 'price', headerText: 'Price', dataType: 'numeric', style: 'my-right-column' },
		{ dataField: 'phone', headerText: 'Phone' },
		{ dataField: 'date', headerText: 'Date' }
	];

	const footerLayout = [
		{ dataField: 'price', positionField: 'price', operation: 'SUM', dataType: 'numeric', formatString: '#,##0', style: 'aui-grid-my-footer-sum-total' },
		{ dataField: 'price', positionField: 'date', operation: 'COUNT', style: 'aui-grid-my-footer-sum-total' },
		{ labelText: 'Count=>', positionField: 'phone', style: 'aui-grid-my-footer-sum-total' }
	];

	const gridProps = {
		width: '100%',
		height: 480,
		showFooter: true,
		editable: true,
		showRowNumColumn: true,
		showRowCheckColumn: true,
		displayTreeOpen: true,
		selectionMode: 'multipleCells',
		useGroupingPanel: true,
		rowStyleFunction: (_rowIndex, item) => {
			if (item.country === 'USA') return 'my-row-style';
			return null;
		}
	};

	const changeRowStyleFunction = () => {
		const grid = myGrid.value;
		grid.setProp('rowStyleFunction', (_rowIndex, item) => {
			if (item.country === 'UK') return 'my-row-style';
			return null;
		});
		grid.update();
	};

	const requestGridData = () => {
		const grid = myGrid.value;
		grid.showAjaxLoader();
		axios
			.get('./data/country_phone_500.json')
			.then((result) => {
				grid.setGridData(result.data);
			})
			.catch((error) => {
				console.error('데이터 로드 실패:', error);
			})
			.finally(() => {
				grid.removeAjaxLoader();
			});
	};

	onMounted(() => {
		requestGridData();
	});
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
