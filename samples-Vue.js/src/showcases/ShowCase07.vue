<script setup>
	import AUIGrid, { agUtils } from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
	import MyCalendarRenderer from '@/renderers/MyCalendarRenderer';
	import { ref, computed, onMounted, watch } from 'vue';

	const myGrid = ref(null);

	// 표시 월의 주별 데이터를 생성합니다. 앞쪽 빈 셀과 마지막 주의 길이를 유지합니다.
	function genGridData(inputDate) {
		const year = inputDate.getFullYear();
		const month = inputDate.getMonth();
		const startWeekday = new Date(year, month, 1).getDay();
		const totalDays = new Date(year, month + 1, 0).getDate();
		const weeks = [];
		let week = [];
		for (let i = 0; i < startWeekday; i++) week.push(null);
		for (let day = 1; day <= totalDays; day++) {
			week.push({ date: day, value: Math.floor(Math.random() * 100) });
			if (week.length === 7) {
				weeks.push(week);
				week = [];
			}
		}
		if (week.length > 0) weeks.push(week);
		return weeks;
	}

	const columnLayout = [
		{ dataField: '0', headerText: '일', style: 'my-sunday-style', headerStyle: 'my-sunday-style', renderer: { type: 'CustomRenderer', jsClass: MyCalendarRenderer } },
		{ dataField: '1', headerText: '월', renderer: { type: 'CustomRenderer', jsClass: MyCalendarRenderer } },
		{ dataField: '2', headerText: '화', renderer: { type: 'CustomRenderer', jsClass: MyCalendarRenderer } },
		{ dataField: '3', headerText: '수', renderer: { type: 'CustomRenderer', jsClass: MyCalendarRenderer } },
		{ dataField: '4', headerText: '목', renderer: { type: 'CustomRenderer', jsClass: MyCalendarRenderer } },
		{ dataField: '5', headerText: '금', renderer: { type: 'CustomRenderer', jsClass: MyCalendarRenderer } },
		{ dataField: '6', headerText: '토', style: 'my-saturday-style', headerStyle: 'my-saturday-style', renderer: { type: 'CustomRenderer', jsClass: MyCalendarRenderer } }
	];

	const gridProps = {
		width: '100%',
		height: 480,
		selectionMode: 'none',
		enableSorting: false,
		showRowNumColumn: false,
		enableColumnResize: false,
		rowHeight: 80
	};

	const originDate = ref(new Date());
	const formatOriginDate = computed(() => agUtils.formatDate(originDate.value, 'yyyy년 mm월'));

	function loadGridData() {
		myGrid.value.setGridData(genGridData(originDate.value));
	}

	// Vue 상태 변경을 watch가 감지하여 그리드 데이터에 반영합니다.
	const changeData = (direction) => {
		const date = new Date(originDate.value);
		date.setMonth(date.getMonth() + direction);
		originDate.value = date;
	};

	onMounted(loadGridData);
	watch(originDate, loadGridData);
</script>
<template>
	<div>
		<div class="desc">
			<p>달력에 개별 날짜마다 목표치 달성률을 표시한 데모입니다.</p>
			<p>그리드에 출력되는 셀은 사용자 정의 렌더러(CustomRenderer)를 사용하였습니다.</p>
			<p>이와 같이 사용자가 원하는 셀 형식을 자바스크립트로 작성할 수 있습니다.</p>
			<div style="text-align: center">
				<button class="btn" @click="changeData(-1)">이전 달</button>
				<span style="margin: 2px 24px">{{ formatOriginDate }}</span>
				<button class="btn" @click="changeData(1)">다음 달</button>
			</div>
		</div>
		<AUIGrid ref="myGrid" name="showcase7" :columnLayout="columnLayout" :gridProps="gridProps" />
	</div>
</template>
<style>
	#aui-grid-wrap-showcase7 .aui-grid-renderer-custom .my-child1 {
		position: absolute;
		display: block;
		left: 4px;
		top: 4px;
		font-size: 13px;
		background: #eee;
		border: 1px solid #ddd;
		width: 20px;
		height: 20px;
		border-radius: 10px;
		font-weight: bold;
	}
	#aui-grid-wrap-showcase7 .aui-grid-renderer-custom .my-child2 {
		position: absolute;
		top: 4px;
		right: 4px;
		width: 20px;
		height: 20px;
		background: url(../assets/info-icon.png) 50% 50% no-repeat;
		cursor: pointer;
	}
	#aui-grid-wrap-showcase7 .aui-grid-renderer-custom .my-chart-base {
		position: absolute;
		display: block;
		top: 50px;
		width: 90px;
		height: 15px;
		border: 1px solid #ccc;
		left: 10px;
	}
	#aui-grid-wrap-showcase7 .aui-grid-renderer-custom .my-chart {
		display: block;
		top: 22px;
		width: 80px;
		height: 15px;
	}
	#aui-grid-wrap-showcase7 .aui-grid-renderer-custom .my-chart-label {
		position: absolute;
		display: inline;
		font-size: 18px;
		color: #000;
		top: 30px;
		left: 45px;
	}
	#aui-grid-wrap-showcase7 .my-saturday-style {
		color: #0000ff;
	}
	#aui-grid-wrap-showcase7 .my-sunday-style {
		color: #ff0000;
	}
</style>
