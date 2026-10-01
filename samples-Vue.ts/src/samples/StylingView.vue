<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import * as IGrid from 'aui-grid';
	import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
	import 'file-saver';
	import '@/static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
	import './StylingView.css';

	type AUIGrid = InstanceType<typeof AUIGrid>;

	const myGrid = ref<AUIGrid | null>(null);

	const columnLayout: IGrid.Column[] = [
		{ dataField: 'orderId', headerText: 'Order ID', width: 140 },
		{ dataField: 'country', headerText: 'Country', style: 'my-column-style2' },
		{ dataField: 'name', headerText: 'Name' },
		{
			dataField: 'product',
			headerText: 'Product',
			style: 'my-column-style',
			styleFunction: (_rowIndex, _columnIndex, value) => {
				if (value === 'Galaxy S25') return 'my-cell-style';
			}
		},
		{ dataField: 'price', headerText: 'Price', dataType: 'numeric', style: 'my-right-column' },
		{ dataField: 'phone', headerText: 'Phone' },
		{ dataField: 'date', headerText: 'Date' }
	];

	const footerLayout: IGrid.Footer[] = [
		{ dataField: 'price', positionField: 'price', operation: 'SUM', formatString: '#,##0', style: 'aui-grid-my-footer-sum-total2' },
		{ dataField: 'price', positionField: 'date', operation: 'COUNT', style: 'aui-grid-my-footer-sum-total2' },
		{ labelText: 'Count=>', positionField: 'phone', style: 'aui-grid-my-footer-sum-total2' }
	];

	const gridProps: IGrid.Props = {
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
		}
	};

	const changeRowStyleFunction = () => {
		const grid = myGrid.value;
		grid?.setProp('rowStyleFunction', (_rowIndex: number, item: any) => {
			if (item.country === 'UK') return 'my-row-style';
		});
		grid?.update();
	};

	const requestGridData = async () => {
		const grid = myGrid.value;
		grid?.showAjaxLoader();
		const response = await fetch('./data/country_phone_500.json');
		const jsonData = await response.json();
		grid?.setGridData(jsonData);
		grid?.removeAjaxLoader();
	};

	const exportClick = () => {
		myGrid.value?.exportToXlsx({
			progressBar: true,
			fileName: 'AUIGrid-Style'
		});
	};

	const exportPdfClick = () => {
		myGrid.value?.exportToPdf({
			fontPath: './fonts/nyjgothic-medium.ttf',
			fileName: 'AUIGrid-Style'
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
			<p>셀 스타일링 : <span class="my-cell-style">Product = Galaxy S25 인 셀에 스타일링</span></p>
			<button class="btn" @click="changeRowStyleFunction">행 스타일링을 변경하기 ( Country 가 UK 인 행 스타일링 하기 )</button>
		</div>
		<div>
			<button class="btn" @click="exportClick">엑셀(xlsx)로 저장</button>
			<button class="btn" @click="exportPdfClick">PDF로 저장</button>
		</div>
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" :footerLayout="footerLayout" />
	</div>
</template>
