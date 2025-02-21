<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import * as IGrid from 'aui-grid';
	import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
	// 엑셀, PDF 다운로드를 브라우저에서 처리하기 위한 file-saver
	import 'file-saver';
	// AUIGrid PDF 처리 모듈
	import '@/static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
	import './StylingView.css';

	// 그리드 InstanceType
	type AUIGrid = InstanceType<typeof AUIGrid>;

	// 그리드 객체
	const myGrid = ref<AUIGrid | null>(null);

	// 그리드 칼럼 레이아웃 정의
	const columnLayout: IGrid.Column[] = [
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
	];

	// 푸터 레이아웃 설정
	const footerLayout: IGrid.Footer[] = [
		{
			dataField: 'price',
			positionField: 'price',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'aui-grid-my-footer-sum-total2'
		},
		{
			dataField: 'price',
			positionField: 'date',
			operation: 'COUNT',
			style: 'aui-grid-my-footer-sum-total2'
		},
		{
			labelText: 'Count=>',
			positionField: 'phone',
			style: 'aui-grid-my-footer-sum-total2'
		}
	];

	// 그리드 속성 정의
	const gridProps: IGrid.Props = {
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
			return null;
		}
	};

	// row Styling 함수를 다른 함수로 변경
	const changeRowStyleFunction = () => {
		const grid = myGrid.value;

		// row Styling 함수를 다른 함수로 변경
		grid?.setProp('rowStyleFunction', (rowIndex: number, item: any) => {
			if (item.country === 'UK') {
				return 'my-row-style';
			}
			return null;
		});

		// 변경된 rowStyleFunction 이 적용되도록 그리드 업데이트
		grid?.update();
	};

	const requestGridData = async () => {
		const grid = myGrid.value;
		grid?.showAjaxLoader();
		const response = await fetch('./data/country_phone_500.json');
		const jsonData = await response.json();
		console.log(jsonData);
		grid?.setGridData(jsonData);
		grid?.removeAjaxLoader();
	};

	// 엑셀로 내보내기
	const exportClick = () => {
		const grid = myGrid.value;
		// 내보내기 실행
		grid?.exportToXlsx({
			progressBar: true,
			fileName: 'AUIGrid-Style'
		});
	};

	// PDF 로 내보내기
	const exportPdfClick = () => {
		const grid = myGrid.value;

		// 내보내기 실행
		grid?.exportToPdf({
			// 폰트 경로 지정
			fontPath: './fonts/jejugothic-regular.ttf',
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
			<p>셀 스타일링 : <span class="my-cell-style">Product = Galaxy S5 인 셀에 스타일링</span></p>
			<button class="btn" @click="changeRowStyleFunction">행 스타일링을 변경하기 ( Country 가 UK 인 행 스타일링 하기 )</button>
		</div>
		<div>
			<button class="btn" @click="exportClick">엑셀(xlsx)로 저장</button>
			<button class="btn" @click="exportPdfClick">PDF로 저장</button>
		</div>
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" :footerLayout="footerLayout" />
	</div>
</template>
