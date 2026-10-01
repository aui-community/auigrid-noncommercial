<script setup>
	import AUIGrid from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
	import axios from 'axios';
	import MyTextareaEditor from '@/editRenderers/MyTextareaEditor';
	import { ref, onMounted } from 'vue';

	const myGrid = ref(null);

	const gridProps = {
		width: '100%',
		height: 480,
		editable: true,
		wordWrap: true,
		selectionMode: 'multipleCells'
	};

	const columnLayout = [
		{ dataField: 'no', headerText: 'No.', width: 50 },
		{
			dataField: 'title',
			headerText: 'Title',
			width: 200,
			editRenderer: {
				type: 'CustomEditRenderer',
				jsClass: MyTextareaEditor,
				vPosition: 'top',
				fitWidth: true
			}
		},
		{
			dataField: 'content',
			headerText: 'Content',
			style: 'my-wrap-column',
			width: 400,
			editRenderer: {
				type: 'CustomEditRenderer',
				jsClass: MyTextareaEditor,
				vPosition: 'top',
				fitWidth: true,
				extraProps: { confirm: '확 인(Ctrl+Enter)', cancel: '취 소(Esc)' }
			}
		},
		{ dataField: 'date', headerText: 'Date', width: 140 }
	];

	onMounted(() => {
		const grid = myGrid.value;
		grid.showAjaxLoader();
		axios
			.get('./data/article_list.json')
			.then((result) => {
				grid.setGridData(result.data);
			})
			.catch((error) => {
				console.error('데이터 로드 실패:', error);
			})
			.finally(() => {
				grid.removeAjaxLoader();
			});
	});
</script>
<template>
	<div>
		<div class="desc">
			<p>Vue에서 어떻게 CustomEditRenderer 를 정의하고 사용하는지를 보여주는 데모입니다.</p>
			<p>이 샘플은 일반 JS에 작성한 AUIGrid.TextareaEditor 를 Vue로 출력한 모습입니다.</p>
			<p>
				즉, <a href="https://www.auisoft.net/demo/auigrid/editRenderer_custom_1.html?er_cus_1&theme=default&s=5648" target="_blank" rel="noreferrer"> <strong>사용자 정의 에디트렌더러 - textarea 샘플</strong> </a>을 그대로 Vue로 작성한 데모입니다.
			</p>
		</div>
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" />
	</div>
</template>
<style>
	.my-wrap-column .aui-grid-renderer-base {
		white-space: pre-wrap;
	}
</style>
