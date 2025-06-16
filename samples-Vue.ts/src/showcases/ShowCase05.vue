<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import * as IGrid from 'aui-grid';
	import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
	import axios from 'axios';
	// 엑셀, PDF 다운로드를 브라우저에서 처리하기 위한 file-saver
	import 'file-saver';
	// AUIGrid PDF 처리 모듈
	import '@/static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
	import './Showcase05.css';

	// 그리드 InstanceType
	type AUIGrid = InstanceType<typeof AUIGrid>;

	// 그리드 객체
	const myGrid = ref<AUIGrid | null>(null);

	// 그리드 칼럼 레이아웃
	const columnLayout: IGrid.Column[] = [
		{
			dataField: 'country',
			headerText: 'Country',
			width: 150,
			filter: {
				showIcon: true,
				useExMenu: true
			}
		},
		{
			dataField: 'product',
			headerText: 'Product',
			width: 150,
			filter: {
				showIcon: true,
				useExMenu: true
			}
		},
		{
			dataField: 'm1',
			headerText: '1월',
			dataType: 'numeric',
			formatString: '#,##0',
			width: 100,
			disableGrouping: true,
			style: 'showcase5-aui-grid-my-right-style'
		},
		{
			dataField: 'm2',
			headerText: '2월',
			dataType: 'numeric',
			formatString: '#,##0',
			width: 100,
			disableGrouping: true,
			style: 'showcase5-aui-grid-my-right-style'
		},
		{
			dataField: 'm3',
			headerText: '3월',
			dataType: 'numeric',
			formatString: '#,##0',
			width: 100,
			disableGrouping: true,
			style: 'showcase5-aui-grid-my-right-style'
		},
		{
			dataField: 'm4',
			headerText: '4월',
			dataType: 'numeric',
			formatString: '#,##0',
			width: 100,
			disableGrouping: true,
			style: 'showcase5-aui-grid-my-right-style'
		},
		{
			dataField: 'm5',
			headerText: '5월',
			dataType: 'numeric',
			formatString: '#,##0',
			width: 100,
			disableGrouping: true,
			style: 'showcase5-aui-grid-my-right-style'
		},
		{
			dataField: 'm6',
			headerText: '6월',
			dataType: 'numeric',
			formatString: '#,##0',
			width: 100,
			disableGrouping: true,
			style: 'showcase5-aui-grid-my-right-style'
		},
		{
			dataField: 'm7',
			headerText: '7월',
			dataType: 'numeric',
			formatString: '#,##0',
			width: 100,
			disableGrouping: true,
			style: 'showcase5-aui-grid-my-right-style'
		},
		{
			dataField: 'm8',
			headerText: '8월',
			dataType: 'numeric',
			formatString: '#,##0',
			width: 100,
			disableGrouping: true,
			style: 'showcase5-aui-grid-my-right-style'
		},
		{
			dataField: 'm9',
			headerText: '9월',
			dataType: 'numeric',
			formatString: '#,##0',
			width: 100,
			disableGrouping: true,
			style: 'showcase5-aui-grid-my-right-style'
		},
		{
			dataField: 'm10',
			headerText: '10월',
			dataType: 'numeric',
			formatString: '#,##0',
			width: 100,
			disableGrouping: true,
			style: 'showcase5-aui-grid-my-right-style'
		},
		{
			dataField: 'm11',
			headerText: '11월',
			dataType: 'numeric',
			formatString: '#,##0',
			width: 100,
			disableGrouping: true,
			style: 'showcase5-aui-grid-my-right-style'
		},
		{
			dataField: 'm12',
			headerText: '12월',
			dataType: 'numeric',
			formatString: '#,##0',
			width: 100,
			disableGrouping: true,
			style: 'showcase5-aui-grid-my-right-style'
		}
	];

	// 푸터 레이아웃 작성하여 반환.
	const getFooterLayout = () => {
		// 푸터 레이아웃 설정
		const footerLayout: IGrid.Footer[] = [
			{
				labelText: '∑',
				positionField: '#base'
			}
		];

		// 푸터 추가 설정
		for (let i = 1; i <= 12; i++) {
			footerLayout.push({
				dataField: 'm' + i,
				positionField: 'm' + i,
				operation: 'SUM',
				formatString: '#,##0',
				style: 'showcase5-aui-grid-my-custom-sum-total'
			});
		}
		return footerLayout;
	};

	// 그리드 속성 정의
	const gridProps: IGrid.Props = {
		width: '100%',
		height: 480,
		useContextMenu: true,
		showBranchOnGrouping: false,
		enableFilter: true,
		showFooter: true,
		editable: true,
		// singleRow 선택모드
		selectionMode: 'singleRow',
		// 그룹핑 패널 사용
		useGroupingPanel: true,
		// 차례로 country, product 순으로 그룹핑을 합니다.
		// 즉, 각 나라별, 각 제품을 구매한 사용자로 그룹핑
		groupingFields: ['country', 'product'],
		// 그룹핑 후 합계필드를 출력하도록 설정합니다.
		groupingSummary: {
			// 합계 필드는 1월 ~ 12월에 대하여 실시 합니다.
			dataFields: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12']
		},
		// 최초 보여질 때 모두 열린 상태로 출력 여부
		displayTreeOpen: true,
		// 그룹핑 후 셀 병함 실행
		enableCellMerge: true,
		// enableCellMerge 할 때 실제로 rowspan 적용 시킬지 여부
		// 만약 false 설정하면 실제 병합은 하지 않고 데이터 값만 같은 데이터 출력 시키지 않음. (기본값 : true)
		cellMergeRowSpan: false,
		// 그리드 ROW 스타일 함수 정의
		rowStyleFunction: (rowIndex, item) => {
			if (item._$isGroupSumField) {
				// 그룹핑으로 만들어진 합계 필드인지 여부
				// 그룹핑을 더 많은 필드로 하여 depth 가 많아진 경우는 그에 맞게 스타일을 정의하십시오.
				// 현재 3개의 스타일이 기본으로 정의됨.(AUIGrid_style.css)
				switch (
					item._$depth // 계층형의 depth 비교 연산
				) {
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
			return null;
		}
	};

	onMounted(() => {
		console.log('Showcase05 마운트됨');

		// 최초 마운팅 될 때 그리드 이벤트 세팅
		setupGridEvents();

		// 초기 데이터 얻기
		requestGridData();
	});

	// 그리드 이벤트 세팅
	const setupGridEvents = () => {
		const grid = myGrid.value as AUIGrid;
		// 그리드 이벤트 바인딩
		grid.bind(IGrid.EventKind.CellClick, (event: IGrid.CellClickEvent) => {
			console.log(event.type);
		});

		grid.bind(IGrid.EventKind.HeaderClick, (event: IGrid.HeaderClickEvent) => {
			console.log(event.type);
		});
	};

	// 그리드 데이터 조회하여 삽입
	const requestGridData = () => {
		const grid = myGrid.value as AUIGrid;
		grid.showAjaxLoader();
		axios.get('./data/country_phone_month_500.json').then((result) => {
			//console.log(result);
			// 그리드 데이터 삽입
			grid.setGridData(result.data);
			grid.removeAjaxLoader();
		});
	};

	// 엑셀, PDF 내보내기 속성
	const exportProps: any = {
		fileName: '쇼케이스-05',

		// 헤더 내용
		headers: [
			{
				text: '',
				height: 20 // 첫행 빈줄
			},
			{
				text: '국가별 핸드폰 판매 통계',
				height: 40,
				style: {
					fontSize: 20,
					textAlign: 'center',
					color: '#ff0000',
					fontWeight: 'bold',
					underline: true,
					background: '#DAD9FF'
				}
			},
			{
				text: '',
				height: 5,
				style: {
					background: '#555555'
				} // 빈줄 색깔 경계 만듬
			}
		],

		// 푸터 내용
		footers: [
			{
				text: '',
				height: 5,
				style: {
					background: '#555555'
				} // 빈줄 색깔 경계 만듬
			},
			{
				text: 'Copyright © AUISoft Co., Ltd.',
				height: 24,
				style: {
					textAlign: 'right',
					fontWeight: 'bold',
					color: '#ffffff',
					background: '#222222'
				}
			}
		]
	};

	// 엑셀로 내보내기
	const exportClick = () => {
		const grid = myGrid.value as AUIGrid;
		// 내보내기 실행
		grid.exportToXlsx({ ...exportProps, progressBar: true });
	};

	// PDF 로 내보내기
	const exportPdfClick = () => {
		const grid = myGrid.value as AUIGrid;
		// 내보내기 실행
		grid.exportToPdf({ ...exportProps, fontPath: './fonts/nyjgothic-medium.ttf' });
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
		<!-- AUIGrid 컴포넌트 설정 -->
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" :footerLayout="getFooterLayout()" />
	</div>
</template>
