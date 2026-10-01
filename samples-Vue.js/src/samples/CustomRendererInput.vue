<script setup>
	import AUIGrid from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
	import MyInputRenderer from '@/renderers/MyInputRenderer';
	import { ref, onMounted } from 'vue';

	const myGrid = ref(null);

	const gridProps = {
		width: '100%',
		height: 480,
		rowHeight: 34,
		editable: true,
		showStateColumn: true
	};

	const columnLayout = [
		{ dataField: 'name', headerText: 'Name', width: 260 },
		{
			dataField: 'country',
			headerText: '커스텀 렌더러-Input',
			width: 280,
			widthFit: 140,
			editable: false,
			headerTooltip: {
				show: true,
				tooltipHtml: '사용자 정의 렌더러를 작성한 칼럼입니다.'
			},
			renderer: {
				type: 'CustomRenderer',
				jsClass: MyInputRenderer
			}
		}
	];

	const gridData = [
		{ name: 'Anna', country: 'Japan' },
		{ name: 'Emma', country: 'USA' },
		{ name: 'Steve', country: 'Italy' },
		{ name: 'Jennifer', country: 'China' },
		{ name: 'Jennifer', country: 'UK' },
		{ name: 'Lawrence', country: 'Singapore' },
		{ name: 'Jennifer', country: 'Japan' },
		{ name: 'Steve', country: 'Ireland' },
		{ name: 'Anna', country: 'Italy' },
		{ name: 'Kim', country: 'France' },
		{ name: 'Emma', country: 'China' },
		{ name: 'Jennifer', country: 'France' },
		{ name: 'Kim', country: 'Japan' },
		{ name: 'Steve', country: 'USA' },
		{ name: 'Emma', country: 'France' },
		{ name: 'Emma', country: 'USA' },
		{ name: 'Emma', country: 'Italy' },
		{ name: 'Emma', country: 'Japan' },
		{ name: 'Lawrence', country: 'Korea' },
		{ name: 'Jennifer', country: 'Japan' },
		{ name: 'Steve', country: 'USA' }
	];

	onMounted(() => {
		const grid = myGrid.value;
		grid.bind(['cellClick'], (event) => {
			console.log(event);
		});
		grid.setGridData(gridData);
	});
</script>
<template>
	<div>
		<div class="desc">
			<p>Vue에서 어떻게 CustomRenderer 를 정의하고 사용하는지를 보여주는 데모입니다.</p>
			<p>이 샘플은 일반 JS에 작성한 AUIGrid.MyInputRenderer 를 Vue로 출력한 모습입니다.</p>
			<p>
				즉, <a href="https://www.auisoft.net/demo/auigrid/renderer_custom_input.html?er_cus_1&theme=default&s=5700" target="_blank" rel="noreferrer"> <strong>사용자 정의 렌더러 - Input 샘플</strong></a
				>을 그대로 Vue로 작성한 데모입니다.
			</p>
		</div>
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" />
	</div>
</template>
