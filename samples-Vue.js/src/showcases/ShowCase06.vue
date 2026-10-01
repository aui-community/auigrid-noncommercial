<script setup>
	import AUIGrid from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
	import axios from 'axios';
	import 'file-saver';
	import '@/static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
	import { ref, onMounted, onBeforeUnmount } from 'vue';

	const myGrid = ref(null);

	const columnLayout = [
		{
			dataField: 'type0',
			headerText: '구분',
			cellMerge: true,
			style: 'showcase6-my-column-strong',
			filter: { showIcon: true }
		},
		{
			dataField: 'type',
			headerText: '유형',
			width: 120
		},
		{
			dataField: 'p131,p132,p133,p134,p135,p136,p137,p138,p139,p1310,p1311,p1312',
			headerText: '월별 추이',
			width: 120,
			renderer: { type: 'SparkColumnRenderer' }
		},
		...['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((m) => ({
			dataField: `p13${m}`,
			headerText: `'13 ${m}월`,
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		}))
	];

	const gridProps = {
		width: '100%',
		height: 480,
		enableCellMerge: true,
		enableFilter: true,
		editable: true,
		selectionMode: 'multipleCells',
		showRowNumColumn: false,
		showRowCheckColumn: false,
		rowStyleFunction: (_rowIndex, item) => {
			if (item._mySum || item._mySum === 'true') return 'aui-grid-row-depth2-style';
		}
	};

	const exportClick = () => {
		myGrid.value.exportToXlsx({
			progressBar: true,
			fileName: '쇼케이스-06'
		});
	};

	const exportPdfClick = () => {
		const grid = myGrid.value;
		if (!grid.isAvailabePdf()) {
			alert('PDF 저장은 HTML5를 지원하는 최신 브라우저에서 가능합니다.(IE는 10부터 가능)');
			return;
		}
		grid.exportToPdf({
			fontPath: './fonts/jejugothic-regular.ttf',
			fileName: '쇼케이스-06'
		});
	};

	// 데이터 요청과 그리드 반영. 종료된 컴포넌트에는 응답을 적용하지 않습니다.
	async function loadGridData(grid, signal) {
		grid.showAjaxLoader();
		try {
			const { data } = await axios.get('./data/profit.json', { signal });
			if (!signal.aborted) grid.setGridData(data);
		} catch (error) {
			if (!signal.aborted) console.error('데이터 로딩 오류:', error);
		} finally {
			if (!signal.aborted) grid.removeAjaxLoader();
		}
	}

	// KeepAlive의 비활성화 동안에는 유지하고, 실제 unmount에서만 정리합니다.
	const controller = new AbortController();
	onMounted(() => {
		const grid = myGrid.value;
		loadGridData(grid, controller.signal);
	});
	onBeforeUnmount(() => {
		controller.abort();
	});
</script>
<template>
	<div>
		<div class="desc">
			<div>
				<button class="btn" @click="exportClick">엑셀(xlsx)로 저장</button>
				<button class="btn" @click="exportPdfClick">PDF로 저장</button>
			</div>
			<p>손익을 크게 매출 수익, 원가, 경비로 보고 해당 내역을 출력한 모습입니다.</p>
		</div>
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" />
	</div>
</template>
<style>
	.showcase6-my-column-strong {
		background: #eee;
		color: #000;
		font-weight: bold;
		text-align: center;
	}
	.showcase6-my-column-text-right {
		text-align: right;
	}
</style>
