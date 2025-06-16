<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import * as IGrid from 'aui-grid';
	import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
	import axios from 'axios';
	// 엑셀, PDF 다운로드를 브라우저에서 처리하기 위한 file-saver
	import 'file-saver';
	// AUIGrid PDF 처리 모듈
	import '@/static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
	import './Showcase06.css';

	// 그리드 InstanceType
	type AUIGrid = InstanceType<typeof AUIGrid>;

	// 그리드 객체
	const myGrid = ref<AUIGrid | null>(null);

	// 그리드 칼럼 레이아웃
	const columnLayout: IGrid.Column[] = [
		{
			dataField: 'type0',
			headerText: '구분',
			cellMerge: true,
			style: 'showcase6-my-column-strong',
			filter: {
				showIcon: true
			}
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
			renderer: {
				type: IGrid.RendererKind.SparkColumnRenderer
			}
		},
		{
			dataField: 'p131',
			headerText: "'13 1월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p132',
			headerText: "'13 2월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p133',
			headerText: "'13 3월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p134',
			headerText: "'13 4월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p135',
			headerText: "'13 5월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p136',
			headerText: "'13 6월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p137',
			headerText: "'13 7월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p138',
			headerText: "'13 8월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p139',
			headerText: "'13 9월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p1310',
			headerText: "'13 10월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p1311',
			headerText: "'13 11월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		},
		{
			dataField: 'p1312',
			headerText: "'13 12월",
			style: 'showcase6-my-column-text-right',
			dataType: 'numeric',
			formatString: '#,##0'
		}
	];

	// 그리드 속성 정의
	const gridProps: IGrid.Props = {
		width: '100%',
		height: 480,
		enableCellMerge: true,
		enableFilter: true,
		editable: true,
		// singleRow 선택모드
		selectionMode: 'multipleCells',
		// 줄번호 칼럼 렌더러 출력 안함
		showRowNumColumn: false,
		// 체크박스 표시 렌더러 출력 안함
		showRowCheckColumn: false,
		rowStyleFunction: (rowIndex, item) => {
			if (item._mySum || item._mySum === 'true') {
				return 'aui-grid-row-depth2-style';
			}
			return null;
		}
	};

	onMounted(() => {
		console.log('Showcase06 마운트됨');
		// 초기 데이터 얻기
		requestGridData();
	});

	// 그리드 데이터 조회하여 삽입
	const requestGridData = () => {
		const grid = myGrid.value as AUIGrid;
		grid.showAjaxLoader();
		axios.get('./data/profit.json').then((result) => {
			//console.log(result);
			// 그리드 데이터 삽입
			grid.setGridData(result.data);
			grid.removeAjaxLoader();
		});
	};

	// 엑셀로 내보내기
	const exportClick = () => {
		const grid = myGrid.value as AUIGrid;
		// 내보내기 실행
		grid.exportToXlsx({
			progressBar: true,
			fileName: '쇼케이스-06'
		});
	};

	// PDF 로 내보내기
	const exportPdfClick = () => {
		const grid = myGrid.value as AUIGrid;
		// 내보내기 실행
		grid.exportToPdf({
			// 폰트 경로 지정
			fontPath: './fonts/nyjgothic-medium.ttf',
			fileName: '쇼케이스-06'
		});
	};
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
