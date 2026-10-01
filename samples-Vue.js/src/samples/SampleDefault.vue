<script setup>
	import AUIGrid from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
	import axios from 'axios';
	import { ref, onMounted } from 'vue';
	import './samples.css';

	const BASE_URL = import.meta.env.BASE_URL;

	const myGrid = ref(null);

	const gridProps = {
		width: '100%',
		height: 480,
		editable: true,
		enableCellMerge: true,
		enterKeyColumnBase: true,
		selectionMode: 'multipleCells',
		useContextMenu: true,
		enableFilter: true,
		useGroupingPanel: true,
		showStateColumn: true,
		displayTreeOpen: true,
		noDataMessage: '출력할 데이터가 없습니다.',
		groupingMessage: '여기에 칼럼을 드래그하면 그룹핑이 됩니다.'
	};

	const numericEditRenderer = {
		type: 'InputEditRenderer',
		onlyNumeric: true,
		textAlign: 'right',
		autoThousandSeparator: true
	};

	const columnLayout = [
		{ dataField: 'id', headerText: 'ID', width: 120 },
		{ dataField: 'name', headerText: 'Name', width: 140 },
		{ dataField: 'country', headerText: 'Country', width: 140 },
		{
			dataField: 'flag',
			headerText: 'Flag IMG',
			editable: false,
			prefix: `${BASE_URL}/assets/`,
			renderer: { type: 'ImageRenderer', imgHeight: 24, altField: 'country' },
			width: 100
		},
		{ dataField: 'product', headerText: 'Product', width: 140 },
		{ dataField: 'color', headerText: 'Color', width: 100 },
		{ dataField: 'price', headerText: 'Price', dataType: 'numeric', style: 'my-right-column', width: 120, editRenderer: numericEditRenderer },
		{ dataField: 'quantity', headerText: 'Quantity', dataType: 'numeric', style: 'my-right-column', width: 100, editRenderer: numericEditRenderer },
		{
			dataField: 'date',
			headerText: 'Date',
			dataType: 'date',
			dateInputFormat: 'yyyy-mm-dd',
			formatString: 'yyyy년 mm월 dd일'
		}
	];

	const requestGridData = () => {
		const grid = myGrid.value;
		grid.showAjaxLoader();
		axios
			.get('./data/normal_100.json')
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

	const isCreatedGrid = () => myGrid.value.isCreated();

	const destroy = () => {
		myGrid.value.destroy();
	};

	const recreate = () => {
		if (isCreatedGrid()) return;

		gridProps.useGroupingPanel = false;
		myGrid.value.create(columnLayout, gridProps);
		requestGridData();
	};

	onMounted(() => {
		requestGridData();
	});
</script>
<template>
	<div>
		<p>기본적인 그리드 생성 화면. 동적으로 제거와 생성을 위한 가이드</p>
		<button class="btn" @click="destroy">그리드 제거</button>
		<button class="btn" @click="recreate">그리드 다시 생성</button>

		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" />
	</div>
</template>
