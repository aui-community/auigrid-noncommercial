<script setup lang="ts">
	import { ref, computed, onMounted, watch } from 'vue';
	import * as IGrid from 'aui-grid';
	import AUIGrid, { agUtils } from '@/static/AUIGrid-Vue/AUIGridT.vue';
	import MyCalendarRenderer from '@/renderers/MyCalendarRenderer';
	import './Showcase07.css';

	type AUIGrid = InstanceType<typeof AUIGrid>;

	const myGrid = ref<AUIGrid | null>(null);

	const originDate = ref(new Date());

	const formatOriginDate = computed(() => agUtils.formatDate(originDate.value, 'yyyy년 mm월'));

	type CalendarWeek = ({ date: number; value: number } | null)[];

	// 표시 월의 주별 데이터를 생성합니다. 앞쪽 빈 셀과 마지막 주의 길이를 유지합니다.
	function genGridData(inputDate: Date): CalendarWeek[] {
		const year = inputDate.getFullYear();
		const month = inputDate.getMonth();
		const startWeekday = new Date(year, month, 1).getDay();
		const totalDays = new Date(year, month + 1, 0).getDate();
		const weeks: CalendarWeek[] = [];
		let week: CalendarWeek = [];
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

	const calendarRenderer = {
		type: IGrid.RendererKind.CustomRenderer,
		jsClass: MyCalendarRenderer
	};

	const columnLayout: IGrid.Column[] = [
		{ dataField: '0', headerText: '일', style: 'my-sunday-style', headerStyle: 'my-sunday-style', renderer: calendarRenderer },
		{ dataField: '1', headerText: '월', renderer: calendarRenderer },
		{ dataField: '2', headerText: '화', renderer: calendarRenderer },
		{ dataField: '3', headerText: '수', renderer: calendarRenderer },
		{ dataField: '4', headerText: '목', renderer: calendarRenderer },
		{ dataField: '5', headerText: '금', renderer: calendarRenderer },
		{ dataField: '6', headerText: '토', style: 'my-saturday-style', headerStyle: 'my-saturday-style', renderer: calendarRenderer }
	];

	const gridProps: IGrid.Props = {
		width: '100%',
		height: 480,
		selectionMode: 'none',
		enableSorting: false,
		showRowNumColumn: false,
		enableColumnResize: false,
		rowHeight: 80
	};

	function loadGridData() {
		myGrid.value?.setGridData(genGridData(originDate.value));
	}

	// Vue 상태 변경을 watch가 감지하여 그리드 데이터에 반영합니다.
	const changeData = (direction: number) => {
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
