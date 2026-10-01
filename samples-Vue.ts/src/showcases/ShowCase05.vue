<script setup lang="ts">
	import { ref, onMounted, onBeforeUnmount } from 'vue';
	import * as IGrid from 'aui-grid';
	import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
	import axios from 'axios';
	import 'file-saver';
	import '@/static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
	import './Showcase05.css';

	type AUIGrid = InstanceType<typeof AUIGrid>;

	const myGrid = ref<AUIGrid | null>(null);

	const exportProps = {
		fileName: '쇼케이스-05',
		headers: [
			{ text: '', height: 20 },
			{
				text: '국가별 핸드폰 판매 통계',
				height: 40,
				style: { fontSize: 20, textAlign: 'center', color: '#ff0000', fontWeight: 'bold', underline: true, background: '#DAD9FF' }
			},
			{ text: '', height: 5, style: { background: '#555555' } }
		],
		footers: [
			{ text: '', height: 5, style: { background: '#555555' } },
			{
				text: 'Copyright © AUISoft Co., Ltd.',
				height: 24,
				style: { textAlign: 'right', fontWeight: 'bold', color: '#ffffff', background: '#222222' }
			}
		]
	};

	const columnLayout: IGrid.Column[] = [
		{
			dataField: 'country',
			headerText: 'Country',
			width: 150,
			filter: { showIcon: true, useExMenu: true }
		},
		{
			dataField: 'product',
			headerText: 'Product',
			width: 150,
			filter: { showIcon: true, useExMenu: true }
		},
		...Array.from({ length: 12 }, (_, i) => ({
			dataField: `m${i + 1}`,
			headerText: `${i + 1}월`,
			dataType: 'numeric' as const,
			formatString: '#,##0',
			width: 100,
			disableGrouping: true,
			style: 'showcase5-aui-grid-my-right-style'
		}))
	];

	const footerLayout: IGrid.Footer[] = [
		{ labelText: '∑', positionField: '#base' },
		...Array.from({ length: 12 }, (_, i) => ({
			dataField: `m${i + 1}`,
			positionField: `m${i + 1}`,
			operation: 'SUM' as const,
			formatString: '#,##0',
			style: 'showcase5-aui-grid-my-custom-sum-total'
		}))
	];

	const gridProps: IGrid.Props = {
		width: '100%',
		height: 480,
		useContextMenu: true,
		showBranchOnGrouping: false,
		enableFilter: true,
		showFooter: true,
		editable: true,
		selectionMode: 'singleRow',
		useGroupingPanel: true,
		groupingFields: ['country', 'product'],
		groupingSummary: {
			dataFields: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12']
		},
		displayTreeOpen: true,
		enableCellMerge: true,
		cellMergeRowSpan: false,
		rowStyleFunction: (_rowIndex, item) => {
			if (!item._$isGroupSumField) return null;
			switch (item._$depth) {
				case 2:
					return 'aui-grid-row-depth1-style';
				case 3:
					return 'aui-grid-row-depth2-style';
				case 4:
					return 'aui-grid-row-depth3-style';
				default:
					return 'aui-grid-row-depth-default-style';
			}
		}
	};

	// 데이터 요청과 그리드 반영. 종료된 컴포넌트에는 응답을 적용하지 않습니다.
	async function loadGridData(grid: AUIGrid, signal: AbortSignal) {
		grid.showAjaxLoader();
		try {
			const { data } = await axios.get('./data/country_phone_month_500.json', { signal });
			if (!signal.aborted) grid.setGridData(data);
		} catch (error) {
			if (!signal.aborted) console.error('데이터 로딩 오류:', error);
		} finally {
			if (!signal.aborted) grid.removeAjaxLoader();
		}
	}

	const handleCellClick = (event: IGrid.CellClickEvent) => {
		console.log(event.type);
	};
	const handleHeaderClick = (event: IGrid.HeaderClickEvent) => {
		console.log(event.type);
	};

	// KeepAlive의 비활성화 동안에는 유지하고, 실제 unmount에서만 정리합니다.
	const controller = new AbortController();
	onMounted(() => {
		const grid = myGrid.value as AUIGrid;
		loadGridData(grid, controller.signal);
	});
	onBeforeUnmount(() => {
		controller.abort();
	});

	const exportClick = () => {
		(myGrid.value as AUIGrid).exportToXlsx({ ...exportProps, progressBar: true });
	};

	const exportPdfClick = () => {
		(myGrid.value as AUIGrid).exportToPdf({ ...exportProps, fontPath: './fonts/nyjgothic-medium.ttf' });
	};
</script>
<template>
	<div>
		<div class="desc">
			<div>
				<button class="btn" @click="exportClick">엑셀(xlsx)로 저장</button>
				<button class="btn" @click="exportPdfClick">PDF로 저장</button>
			</div>
			<p>각각의 나라에 따라 각 제품별로 판매량을 보기 위해 그룹핑을 하여 가격에 대하여 합계를 계산한 자료입니다.</p>
			<p>일반 데이터를 받아 그리드가 그룹핑을 하고, 각 나라, 제품에 대하여 그리드에서 직접 합계를 계산합니다.</p>
			<p>필터링 또는 데이터 값 수정 시 동적으로 그룹핑 합계 및 푸터 값이 변경됩니다.</p>
		</div>
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" :footerLayout="footerLayout" @cellClick="handleCellClick" @headerClick="handleHeaderClick" />
	</div>
</template>
