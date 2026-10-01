<script setup>
	import AUIGrid from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
	import axios from 'axios';
	import 'file-saver';
	import '@/static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
	import { ref, onMounted, onBeforeUnmount } from 'vue';

	const myGrid = ref(null);

	const calIconClick = () => {
		myGrid.value.openInputer();
	};

	let isExpanded = true;

	const listItems = [
		{ text: '계층 1 Depth 만 보이기', value: 1 },
		{ text: '계층 2 Depth 만 보이기', value: 2 },
		{ text: '계층 3 Depth 만 보이기', value: 3 }
	];

	const calendarEditRenderer = {
		type: 'CalendarRenderer',
		showEditorBtn: false,
		onlyCalendar: true,
		titles: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
		monthTitleString: 'mmm',
		formatMonthString: 'mmm yyyy',
		formatYearString: 'yyyy',
		showExtraDays: true,
		showTodayBtn: true,
		todayText: 'Today'
	};

	const columnLayout = [
		{
			dataField: 'id',
			headerText: 'ID',
			width: 50
		},
		{
			dataField: 'name',
			headerText: 'Task Name',
			filter: { showIcon: true },
			headerTooltip: {
				show: true,
				tooltipHtml:
					'<div style="width:180px;text-align:left;"><p>Just an incredibly simple <span style="color:#F29661;">AUIGrid</span></p><p>Faucibus sed lobortis aliquam lorem blandit. Lorem eu nunc metus col. Commodo id in arcu ante lorem ipsum sed accumsan erat praesent faucibus commodo ac mi lacus. Adipiscing mi ac commodo. </p></div>' // eslint-disable-line
			},
			style: 'showcase2-my-left-text',
			width: 400
		},
		{
			dataField: 'charge',
			headerText: 'Charge',
			filter: { showIcon: true },
			headerTooltip: {
				show: true,
				tooltipHtml: '<div style="width:120px;text-align:left;"><p>Things I Can Do</p><p> Integer eu ante ornare amet commetus vestibulum blandit integer in curae ac faucibus integer non. Adipiscing cubilia elementum integer lorem ipsum dolor sit amet.</p></div>' // eslint-disable-line
			},
			style: 'showcase2-my-left-text',
			width: 120,
			renderer: {
				type: 'IconRenderer',
				iconWidth: 20,
				iconHeight: 20,
				iconFunction: (_rowIndex, _columnIndex, value) => {
					if (value && value.substr(0, 1) === 'A') return './assets/office_female.png';
					return './assets/office_man.png';
				}
			},
			editRenderer: {
				type: 'ComboBoxRenderer',
				showEditorBtnOver: true,
				historyMode: true,
				listAlign: 'left'
			}
		},
		{
			dataField: 'complete',
			headerText: 'Complete(%)',
			width: 100,
			dataType: 'numeric',
			renderer: { type: 'BarRenderer', min: 0, max: 100 },
			editRenderer: { type: 'NumberStepRenderer', min: 0, max: 100, step: 1 },
			styleFunction: (_rowIndex, _columnIndex, value) => (value === 100 ? 'showcase2-complete-red' : '')
		},
		{
			dataField: 'start',
			headerText: 'Start Date',
			formatString: 'mm/dd/yyyy',
			dataType: 'date',
			width: 120,
			renderer: {
				type: 'IconRenderer',
				iconWidth: 16,
				iconHeight: 16,
				iconPosition: 'aisleRight',
				iconTableRef: { default: './assets/calendar-icon.png' },
				onClick: calIconClick
			},
			editRenderer: calendarEditRenderer
		},
		{
			dataField: 'end',
			headerText: 'End Date',
			formatString: 'mm/dd/yyyy',
			dataType: 'date',
			width: 120,
			renderer: {
				type: 'IconRenderer',
				iconWidth: 16,
				iconHeight: 16,
				iconPosition: 'aisleRight',
				iconTableRef: { default: './assets/calendar-icon.png' },
				onClick: calIconClick
			},
			editRenderer: calendarEditRenderer
		},
		{
			dataField: 'issue',
			headerText: 'Issues',
			style: 'showcase2-my-left-text'
		}
	];

	const gridProps = {
		width: '100%',
		height: 480,
		selectionMode: 'singleRow',
		editable: true,
		enableFilter: true,
		showStateColumn: true,
		treeColumnIndex: 1,
		displayTreeOpen: true,
		showRowCheckColumn: false,
		showRowNumColumn: false
	};

	const handleExpandBtnClick = () => {
		const grid = myGrid.value;
		if (isExpanded) {
			grid.collapseAll();
		} else {
			grid.expandAll();
		}
		isExpanded = !isExpanded;
	};

	const handleSelect = (e) => {
		myGrid.value.showItemsOnDepth(Number(e.target.value));
	};

	const exportClick = () => {
		myGrid.value.exportToXlsx({
			progressBar: true,
			fileName: '쇼케이스-02'
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
			fileName: '쇼케이스-02'
		});
	};

	// 데이터 요청과 그리드 반영. 종료된 컴포넌트에는 응답을 적용하지 않습니다.
	async function loadGridData(grid, signal) {
		grid.showAjaxLoader();
		try {
			const { data } = await axios.get('./data/schedule_tree.json', { signal });
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
			<p>프로젝트 일정 관리 테이블을 출력한 모습입니다. ( 계층구조 데이터 표현 )</p>
			<div>
				<button class="btn" @click="handleExpandBtnClick">모두 열기/닫기</button>
				<select @change="handleSelect">
					<option value="0" selected="selected" disabled="disabled">-- 특정 계층까지만 보이기 --</option>
					<option :key="item.value" v-for="item in listItems" :value="item.value">
						{{ item.text }}
					</option>
				</select>
			</div>
		</div>
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" />
	</div>
</template>
<style>
	.showcase2-my-left-text {
		text-align: left;
	}
	.showcase2-complete-red {
		color: #ff0000;
	}
</style>
