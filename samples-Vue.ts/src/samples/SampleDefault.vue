<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import * as IGrid from 'aui-grid';
	import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
	import './Samples.css';

	const BASE_URL = import.meta.env.BASE_URL;

	// 그리드 InstanceType
	type AUIGrid = InstanceType<typeof AUIGrid>;

	// 그리드 객체
	const myGrid = ref<AUIGrid | null>(null);

	// 그리드 속성 정의
	const gridProps: IGrid.Props = {
		width: '100%',
		height: 480,
		// 편집 가능 여부 (기본값 : false)
		editable: true,
		// 셀 병합 실행
		enableCellMerge: true,
		// 엔터키가 다음 행이 아닌 다음 칼럼으로 이동할지 여부 (기본값 : false)
		enterKeyColumnBase: true,
		// 셀 선택모드 (기본값: singleCell)
		selectionMode: 'multipleCells',
		// 컨텍스트 메뉴 사용 여부 (기본값 : false)
		useContextMenu: true,
		// 필터 사용 여부 (기본값 : false)
		enableFilter: true,
		// 그룹핑 패널 사용
		useGroupingPanel: true,
		// 상태 칼럼 사용
		showStateColumn: true,
		// 그룹핑 또는 트리로 만들었을 때 펼쳐지게 할지 여부 (기본값 : false)
		displayTreeOpen: true,
		noDataMessage: '출력할 데이터가 없습니다.',
		groupingMessage: '여기에 칼럼을 드래그하면 그룹핑이 됩니다.'
	};

	// 그리드 칼럼 레이아웃 정의
	const columnLayout: IGrid.Column[] = [
		{
			dataField: 'id',
			headerText: 'ID',
			width: 120
		},
		{
			dataField: 'name',
			headerText: '이름',
			width: 140
		},
		{
			dataField: 'country',
			headerText: 'Country',
			width: 140
		},
		{
			dataField: 'flag',
			headerText: 'Flag IMG',
			editable: false,
			prefix: BASE_URL + '/assets/',
			renderer: {
				type: IGrid.RendererKind.ImageRenderer,
				imgHeight: 24,
				altField: 'country'
			},
			width: 100
		},
		{
			dataField: 'product',
			headerText: 'Product',
			width: 140
		},
		{
			dataField: 'color',
			headerText: 'Color',
			width: 100
		},
		{
			dataField: 'price',
			headerText: 'Price',
			dataType: 'numeric',
			style: 'my-right-column',
			width: 120,
			editRenderer: {
				type: IGrid.EditRendererKind.InputEditRenderer,
				onlyNumeric: true, // 0~9만 입력가능
				textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
				autoThousandSeparator: true // 천단위 구분자 삽입 여부
			}
		},
		{
			dataField: 'quantity',
			headerText: 'Quantity',
			dataType: 'numeric',
			style: 'my-right-column',
			width: 100,
			editRenderer: {
				type: IGrid.EditRendererKind.InputEditRenderer,
				onlyNumeric: true, // 0~9만 입력가능
				textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
				autoThousandSeparator: true // 천단위 구분자 삽입 여부
			}
		},
		{
			dataField: 'date',
			headerText: 'Date',
			dataType: 'date',
			dateInputFormat: 'yyyy-mm-dd', // 데이터의 날짜 형식
			formatString: 'yyyy년 mm월 dd일' // 그리드에 보여줄 날짜 형식
		}
	];

	// 작성된 그리드를 제거합니다.
	const destory = () => {
		const grid = myGrid.value;
		grid?.destroy();
	};

	// 그리드를 수동으로 생성 시킵니다.
	const recreate = () => {
		// 이미 생성되어 있는 경우
		if (isCreatedGrid()) return;

		const grid = myGrid.value;

		// 기존 옵션에서 변경하고자 함.
		gridProps.useGroupingPanel = false;

		// 그리드 수동으로 재생성
		grid?.create(columnLayout, gridProps);

		// 데이터 재요청
		requestGridData();
	};
	// 현재 그리드가 생성되었는지 여부
	const isCreatedGrid = () => {
		const grid = myGrid.value;
		const isCreated = grid?.isCreated();
		console.log(isCreated);
		return isCreated;
	};

	const cellClick = (event: IGrid.EventKind.CellClick) => {
		console.log(event);
	};

	const requestGridData = async () => {
		const grid = myGrid.value;
		grid?.showAjaxLoader();
		const response = await fetch(BASE_URL + '/data/normal_100.json');
		const jsonData = await response.json();
		console.log(jsonData);
		grid?.setGridData(jsonData);
		grid?.removeAjaxLoader();
	};

	onMounted(() => {
		requestGridData();
	});
</script>

<template>
	<div>
		<p>기본적인 그리드 생성 화면. 동적으로 제거와 생성을 위한 가이드</p>
		<button class="btn" @click="destory">그리드 제거</button>
		<button class="btn" @click="recreate">그리드 다시 생성</button>
		<div>
			<AUIGrid ref="myGrid" :gridProps="gridProps" :columnLayout="columnLayout" @cellClick="cellClick"></AUIGrid>
		</div>
	</div>
</template>
