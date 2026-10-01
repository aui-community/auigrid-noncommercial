<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import * as IGrid from 'aui-grid';
	import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
	import axios from 'axios';

	const BASE_URL = import.meta.env.BASE_URL;

	type AUIGrid = InstanceType<typeof AUIGrid>;

	const myMasterGrid = ref<AUIGrid | null>(null);
	const myDetailGrid = ref<AUIGrid | null>(null);

	const columnLayoutMaster: IGrid.Column[] = [
		{ dataField: 'id', headerText: 'ID', width: 160 },
		{ dataField: 'name', headerText: 'Name', width: 160 },
		{
			dataField: 'flag',
			headerText: 'Flag IMG',
			editable: false,
			prefix: BASE_URL + '/assets/',
			renderer: { type: IGrid.RendererKind.ImageRenderer, imgHeight: 24, altField: 'country' },
			width: 100
		},
		{ dataField: 'product', headerText: 'Product', width: 140 },
		{ dataField: 'color', headerText: 'Color', width: 100 },
		{ dataField: 'price', headerText: 'Price', dataType: 'numeric', style: 'my-column', width: 120 },
		{ dataField: 'quantity', headerText: 'Quantity', dataType: 'numeric', style: 'my-column', width: 100 },
		{
			dataField: 'date',
			headerText: 'Date',
			dataType: 'date',
			dateInputFormat: 'yyyy-mm-dd',
			formatString: 'yyyy년 mm월 dd일',
			width: 140
		}
	];

	const gridMasterProps: IGrid.Props = {
		width: '100%',
		height: 280,
		selectionMode: 'multipleCells',
		enableDrag: true,
		enableMultipleDrag: true,
		enableDragByCellDrag: true,
		enableDrop: true,
		dropToOthers: true
	};

	const columnLayoutDetail: IGrid.Column[] = [
		{ dataField: 'id', headerText: 'ID', width: 160 },
		{ dataField: 'name', headerText: 'Name', width: 140 },
		{ dataField: 'country', headerText: 'Country', width: 140 },
		{ dataField: 'product', headerText: 'Product', width: 180 }
	];

	const gridDetailProps: IGrid.Props = {
		width: '100%',
		height: 280,
		enableDrag: true,
		enableMultipleDrag: true,
		enableDragByCellDrag: true,
		enableDrop: true,
		dropToOthers: true
	};

	onMounted(() => {
		const dropEndEventHandler = (e: IGrid.DropEndEvent) => {
			const msg = `그리드 ${e.pid} → ${e.pidToDrop} 드랍 완료 : ${e.fromRowIndex}→${e.toRowIndex} 에 ${e.items.length} 행(들) 드랍 됨`;
			console.log(msg);
		};

		myMasterGrid.value?.bind(IGrid.EventKind.DropEnd, dropEndEventHandler);
		myDetailGrid.value?.bind(IGrid.EventKind.DropEnd, dropEndEventHandler);
		myDetailGrid.value?.setGridData([]);

		const grid = myMasterGrid.value as AUIGrid;
		grid.showAjaxLoader();
		axios.get('./data/normal_100.json').then((result) => {
			grid.setGridData(result.data);
			grid.removeAjaxLoader();
		});
	});
</script>

<template>
	<div>
		<div class="desc">
			<p>두 개의 그리드 간의 드래그&드랍으로 행 이동을 정의한 모습입니다.(두 그리드 상호 간의 드래그&드랍))</p>
			<p>드래그&드랍으로 다른 그리드에 행을 이동 시킨 경우 이동 전 그리드는 행 삭제로, 이동 된 그리드는 행 추가로 인식됩니다.</p>
		</div>
		<h4 style="text-align: left">상단 마스터 그리드</h4>
		<AUIGrid ref="myMasterGrid" :columnLayout="columnLayoutMaster" :gridProps="gridMasterProps" />
		<h4 style="text-align: left; height: 20">하단 디테일 그리드</h4>
		<AUIGrid ref="myDetailGrid" :columnLayout="columnLayoutDetail" :gridProps="gridDetailProps" />
	</div>
</template>
