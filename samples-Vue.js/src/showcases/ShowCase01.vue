<script setup>
	import AUIGrid from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
	import axios from 'axios';
	import 'file-saver';
	import '@/static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
	import { ref, onMounted, onBeforeUnmount } from 'vue';

	const myGrid = ref(null);

	const gridProps = {
		width: '100%',
		height: 480,
		editable: true,
		editableOnFixedCell: true,
		rowIdField: 'no',
		enableFilter: true,
		showFooter: true,
		useContextMenu: true,
		showStateColumn: true,
		fixedColumnCount: 1,
		softRemovePolicy: 'exceptNew',
		skipReadonlyColumns: true,
		enterKeyColumnBase: true
	};

	const footerLayout = [
		{ labelText: '합 계', positionField: 'name' },
		{ dataField: 'ct', operation: 'SUM', positionField: 'ct' },
		{ dataField: 'ce', operation: 'SUM', positionField: 'ce' },
		{ dataField: 'cu', operation: 'SUM', positionField: 'cu' },
		{ dataField: 'cp', operation: 'SUM', positionField: 'cp' },
		{ dataField: 'ceu', operation: 'SUM', positionField: 'ceu' }
	];

	const cellStyleFunction = (_rowIndex, _columnIndex, value) => {
		const styleMap = {
			N: 'mycustom-n',
			T: 'mycustom-t',
			U: 'mycustom-u',
			E: 'mycustom-e',
			P: 'mycustom-p'
		};
		return styleMap[value] ?? null;
	};

	const myExpFunction = (_rowIndex, _columnIndex, item, dataField) => {
		let count = 0;

		if (dataField === 'ceu') {
			for (const field in item) {
				const value = item[field];
				if (value === 'E' || value === 'U') count++;
			}
			return count;
		}

		const opMap = { ct: 'T', ce: 'E', cu: 'U', cp: 'P' };
		const opValue = opMap[dataField] ?? '';
		for (const field in item) {
			if (item[field] === opValue) count++;
		}
		return count;
	};

	const columnLayout = (() => {
		const days = ['일', '월', '화', '수', '목', '금', '토'];
		const layout = [
			{
				dataField: 'name',
				headerText: '학생이름',
				filter: { showIcon: true, useExMenu: true }
			},
			{
				headerText: '합 계',
				children: [
					{ dataField: 'ct', expFunction: myExpFunction, editable: false, headerText: 'T', width: 40, headerStyle: 'mycustom-t', dataType: 'numeric', headerTooltip: { show: true, tooltipHtml: '지각' } },
					{ dataField: 'ce', expFunction: myExpFunction, editable: false, headerText: 'E', width: 40, headerStyle: 'mycustom-e', dataType: 'numeric', headerTooltip: { show: true, tooltipHtml: '사정 상 결석' } },
					{ dataField: 'cu', expFunction: myExpFunction, editable: false, headerText: 'U', width: 40, headerStyle: 'mycustom-u', dataType: 'numeric', headerTooltip: { show: true, tooltipHtml: '무단 결석' } },
					{ dataField: 'cp', expFunction: myExpFunction, editable: false, headerText: 'P', width: 40, headerStyle: 'mycustom-p', dataType: 'numeric', headerTooltip: { show: true, tooltipHtml: '출석' } },
					{ dataField: 'ceu', expFunction: myExpFunction, editable: false, headerText: '결석 일수', width: 100, dataType: 'numeric', renderer: { type: 'BarRenderer', max: 10, style: 'showcase1-custmom-bar' } }
				]
			}
		];

		for (let i = 1; i <= 31; i++) {
			layout.push({
				headerText: days[i % 7],
				children: [{ dataField: `d${i}`, headerText: String(i), width: 40, styleFunction: cellStyleFunction }]
			});
		}
		return layout;
	})();

	// 편집 이벤트 안에서 재진입하지 않도록 기존 16ms 지연을 유지합니다.
	let disposed = false;
	const pendingEdits = new Set();
	const scheduleEdit = (callback) => {
		if (disposed) return;
		const timer = setTimeout(() => {
			pendingEdits.delete(timer);
			callback();
		}, 16);
		pendingEdits.add(timer);
	};
	const cancelPendingEdits = () => {
		disposed = true;
		pendingEdits.forEach(clearTimeout);
		pendingEdits.clear();
	};

	const handleCellClick = (event) => {
		console.log(event);
	};

	const handleCellEditEndBefore = (event) => {
		if (event.dataField === 'name') {
			console.log(`oldValue : ${event.oldValue}, new Value : ${event.value}`);
			return event.value;
		}

		if (!event.value) return event.oldValue;
		const value = event.value.toUpperCase();
		const validValues = ['T', 'E', 'U', 'P', 'N'];
		if (!validValues.includes(value)) {
			console.log('T, E, U, P, N 입력이 아님으로 에디팅 취소시킴');
			return event.oldValue;
		}

		console.log(`oldValue : ${event.oldValue}, new Value : ${value}, (대문자로 변경됨)`);
		return value;
	};

	const handleCellEditCancel = (event) => {
		const grid = myGrid.value;
		if (event.dataField === 'name' && event.item.name === '') {
			scheduleEdit(() => grid.removeRow(event.rowIndex));
		}
	};

	const addRow = () => {
		const grid = myGrid.value;
		grid.forceEditingComplete(null);

		const holidays = [6, 7, 13, 14];
		const item = { name: '' };
		for (let i = 1; i <= 31; i++) {
			item[`d${i}`] = holidays.includes(i) ? 'N' : 'P';
		}
		grid.addRow(item, 'last');
	};

	const handleAddRowFinish = () => {
		const grid = myGrid.value;
		const selected = grid.getSelectedIndex();
		if (selected.length <= 0) return;

		const rowIndex = selected[0];
		const colIndex = grid.getColumnIndexByDataField('name');
		grid.setSelectionByIndex(rowIndex, colIndex);
		grid.openInputer();
	};

	const removeRow = () => {
		myGrid.value.removeRow('selectedIndex');
	};

	const restoreSoftRow = () => {
		myGrid.value.restoreSoftRows('selectedIndex');
	};

	const removeSoftRows = () => {
		const grid = myGrid.value;
		const removedRows = grid.getRemovedItems(true);
		if (removedRows.length <= 0) {
			alert('삭제 처리되어 마크된 행이 없습니다.');
			return;
		}
		if (confirm('다시 복구 할 수 없습니다. 삭제 하시겠습니까?')) {
			grid.removeSoftRows();
		}
	};

	const exportClick = () => {
		myGrid.value.exportToXlsx({
			progressBar: true,
			fileName: '쇼케이스-01'
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
			fileName: '쇼케이스-01'
		});
	};

	// 데이터 요청과 그리드 반영. 종료된 컴포넌트에는 응답을 적용하지 않습니다.
	async function loadGridData(grid, signal) {
		grid.showAjaxLoader();
		try {
			const { data } = await axios.get('./data/student_present.json', { signal });
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
		cancelPendingEdits();
	});
</script>
<template>
	<div>
		<div class="desc">
			<div>
				<button class="btn" @click="exportClick">엑셀(xlsx)로 저장</button>
				<button class="btn" @click="exportPdfClick">PDF로 저장</button>
			</div>
			<p>학생 출석 레코드를 표현 할 때 각각의 셀에 스타일을 적용시킨 것입니다.</p>
			<div>
				<span class="legend mycustom-t">T</span>
				<span>지각</span>
				<span class="legend mycustom-e">E</span>
				<span>유고</span>
				<span class="legend mycustom-u">U</span>
				<span>무단</span>
				<span class="legend mycustom-p">P</span>
				<span>출석</span>
				<span class="legend mycustom-n">N</span>
				<span>휴교</span>
			</div>
			<p>날짜의 값(T, E, U, P, N) 수정 시 동적으로 합계가 변경됩니다.</p>
			<div>
				<div>
					<button class="btn" @click="addRow">학생 추가</button>
					<button class="btn" @click="removeRow">선택 삭제</button>
					<button class="btn" @click="restoreSoftRow">삭제 취소</button>
					<button class="btn" @click="removeSoftRows">삭제 처리된 행들 완전 삭제</button>
				</div>
			</div>
			<p>(삭제 시 softRemoveRowMode = true 설정으로 바로 그리드에서 제거하지 않음.)</p>
		</div>
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" :footerLayout="footerLayout" @cellClick="handleCellClick" @cellEditEndBefore="handleCellEditEndBefore" @cellEditCancel="handleCellEditCancel" @addRowFinish="handleAddRowFinish" />
	</div>
</template>
<style scoped>
	.legend {
		display: inline-block;
		text-align: center;
		width: 30px;
		margin: 0.5em;
		padding: 0.25em;
	}
</style>
<style>
	.mycustom-n {
		background: #eeeeee;
		color: #000;
	}

	.mycustom-t {
		background: #53c14b;
		color: #000;
	}

	.mycustom-u {
		background: #de4f4f;
		color: #000;
	}

	.mycustom-e {
		background: #f2cb61;
		color: #000;
	}

	.mycustom-p {
		background: #fff29e;
		color: #000;
	}

	.showcase1-custmom-bar {
		border: 1px solid #e4e4e4;
		background: #008299;
		background: -webkit-linear-gradient(left, #5cd1e5, #008299);
		background: -moz-linear-gradient(left, #5cd1e5, #008299);
		background: -ms-linear-gradient(left, #5cd1e5, #008299);
		background: -o-linear-gradient(left, #5cd1e5, #008299);
		background: linear-gradient(to right, #5cd1e5, #008299);
	}
</style>
