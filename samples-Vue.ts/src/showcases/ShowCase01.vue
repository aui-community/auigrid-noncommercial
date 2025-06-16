<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import * as IGrid from 'aui-grid';
	import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
	import axios from 'axios';
	// 엑셀, PDF 다운로드를 브라우저에서 처리하기 위한 file-saver
	import 'file-saver';
	// AUIGrid PDF 처리 모듈
	import '@/static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
	import './Showcase01.css';

	// 그리드 InstanceType
	type AUIGrid = InstanceType<typeof AUIGrid>;

	// 그리드 객체
	const myGrid = ref<AUIGrid | null>(null);

	// 칼럼 레이아웃 작성하여 반환
	const createColumnData = () => {
		let columnLayout: IGrid.Column[] = [
			{
				dataField: 'name',
				headerText: '학생이름',
				filter: {
					showIcon: true,
					useExMenu: true
				}
			}
		];

		let obj: IGrid.Column = {
			headerText: '합 계',
			children: [
				{
					dataField: 'ct',
					expFunction: myExpFunction,
					editable: false,
					headerText: 'T',
					width: 40,
					headerStyle: 'mycustom-t',
					dataType: 'numeric',
					headerTooltip: {
						show: true,
						tooltipHtml: '지각'
					}
				},
				{
					dataField: 'ce',
					expFunction: myExpFunction,
					editable: false,
					headerText: 'E',
					width: 40,
					headerStyle: 'mycustom-e',
					dataType: 'numeric',
					headerTooltip: {
						show: true,
						tooltipHtml: '사정 상 결석'
					}
				},
				{
					dataField: 'cu',
					expFunction: myExpFunction,
					editable: false,
					headerText: 'U',
					width: 40,
					headerStyle: 'mycustom-u',
					dataType: 'numeric',
					headerTooltip: {
						show: true,
						tooltipHtml: '무단 결석'
					}
				},
				{
					dataField: 'cp',
					expFunction: myExpFunction,
					editable: false,
					headerText: 'P',
					width: 40,
					headerStyle: 'mycustom-p',
					dataType: 'numeric',
					headerTooltip: {
						show: true,
						tooltipHtml: '출석'
					}
				},
				{
					dataField: 'ceu',
					expFunction: myExpFunction,
					editable: false,
					headerText: '결석 일수',
					width: 100,
					dataType: 'numeric',
					renderer: {
						type: IGrid.RendererKind.BarRenderer,
						max: 10,
						style: 'showcase1-custmom-bar'
					}
				}
			]
		};
		columnLayout.push(obj);

		const days: string[] = ['일', '월', '화', '수', '목', '금', '토'];
		for (let i: number = 1; i <= 31; i++) {
			let obj: IGrid.Column = {};
			obj.headerText = days[i % 7];
			obj.children = [
				{
					dataField: 'd' + i,
					headerText: i.toString(),
					width: 40,
					styleFunction: cellStyleFunction
				}
			];
			columnLayout.push(obj);
		}
		return columnLayout;
	};

	const myExpFunction = (rowIndex: number, columnIndex: number, item: any, dataField: string) => {
		let count: number = 0;
		let value: string;
		let field: string;
		let opValue: string;

		if (dataField === 'ceu') {
			// E, U 개수 구하기
			for (field in item) {
				value = item[field];
				if (value === 'E' || value === 'U') {
					count++;
				}
			}
			return count;
		} else {
			// T, E, U, P 각각 개별 개수 구하기
			switch (dataField) {
				case 'ct': // 지각 합
					opValue = 'T';
					break;
				case 'ce': // 사정상 결적 합
					opValue = 'E';
					break;
				case 'cu': // 무단 결석 합
					opValue = 'U';
					break;
				case 'cp': // 출석 합
					opValue = 'P';
					break;
				default:
					opValue = '';
					break;
			}
			for (field in item) {
				value = item[field];
				if (value === opValue) {
					count++;
				}
			}
			return count;
		}
	};

	const cellStyleFunction = (rowIndex: number, columnIndex: number, value: any): string | null => {
		if (value === 'N') return 'mycustom-n';
		else if (value === 'T') return 'mycustom-t';
		else if (value === 'U') return 'mycustom-u';
		else if (value === 'E') return 'mycustom-e';
		else if (value === 'P') return 'mycustom-p';
		return null;
	};

	// 그리드 칼럼 레이아웃
	const columnLayout: IGrid.Column[] = createColumnData();

	// 그리드 속성 정의
	const gridProps: IGrid.Props = {
		editable: true,
		width: '100%',
		height: 480,
		selectionMode: 'multipleCells'
	};

	onMounted(() => {
		console.log('Showcase01 마운트됨');

		// 최초 마운팅 될 때 그리드 이벤트 세팅
		setupGridEvents();

		// 최초 마운팅 될 때 그리드 데이터 조회시키기
		requestGridData();
	});

	// 그리드 이벤트 세팅
	const setupGridEvents = () => {
		const grid = myGrid.value as AUIGrid;

		// 그리드 cellClick, headerClick 이벤트 바인딩
		grid.bind([IGrid.EventKind.CellClick, IGrid.EventKind.HeaderClick], (event: IGrid.CellClickEvent | IGrid.HeaderClickEvent) => {
			switch (event.type) {
				case IGrid.EventKind.CellClick:
					console.log(event.type, (event as IGrid.CellClickEvent).value);
					break;
				case IGrid.EventKind.HeaderClick:
					console.log(event.type, event.headerText);
					break;
				default:
			}
		});

		// addRowFinish 이벤트 바인딩
		grid.bind(IGrid.EventKind.AddRowFinish, (event: IGrid.AddRowEvent) => {
			console.log(event.type);
			// 행 추가 시 추가된 행에 선택자가 이동합니다.
			// 이 때 칼럼은 기존 칼럼 그래도 유지한채 이동함.
			// 원하는 칼럼으로 선택자를 보내 강제로 편집기(inputer) 를 열기 위한 코드
			const selected: number[] = grid.getSelectedIndex();
			if (selected.length <= 0) {
				return;
			}

			const rowIndex: number = selected[0];
			const colIndex: number = grid.getColumnIndexByDataField('name');
			grid.setSelectionByIndex(rowIndex, colIndex); // name 으로 선택자 이동

			// 빈행 추가 후 인푸터 열기
			setTimeout(() => {
				grid.openInputer();
			}, 16);
		});

		// cellEditEndBefore, cellEditCancel 이벤트 바인딩
		grid.bind([IGrid.EventKind.CellEditEndBefore, IGrid.EventKind.CellEditCancel], (event: any) => {
			switch (event.type) {
				case IGrid.EventKind.CellEditEndBefore:
					const endEvent = event as IGrid.CellEditEndEvent;
					// 이름은 어떤것을 입력해도 허용함.
					if (endEvent.dataField === 'name') {
						console.log('oldValue : ' + endEvent.oldValue + ', new Value : ' + endEvent.value);
						return endEvent.value;
					}

					let value: string = endEvent.value;
					let oldValue: string = endEvent.oldValue;
					let validValues: string[] = ['T', 'E', 'U', 'P', 'N']; // 입력 유효값.

					if (!value) return oldValue;

					// 대문자로 모두 변경시킴
					value = value.toUpperCase();

					// T, E, U, P, N 이 아니라면 에디팅 취소와 같음
					if (validValues.indexOf(value) === -1) {
						console.log('T, E, U, P, N 입력이 아님으로 에디팅 취소시킴');
						return oldValue;
					}

					console.log('oldValue : ' + oldValue + ', new Value : ' + value + ', (대문자로 변경됨)');
					return value;
				case IGrid.EventKind.CellEditCancel:
					const cancelEvent = event as IGrid.CellEditCancelEvent;
					if (cancelEvent.dataField === 'name') {
						// 학생 이름 입력 안하면 삭제.
						if (cancelEvent.item.name === '') {
							// removeRow 메소드는 에디팅이 현재 열린 경우 취소를 시키게 됨.
							// 이 때 다시 취소 이벤트가 발생하여 무한으로 빠지는 것을 방지
							setTimeout(function () {
								grid.removeRow(cancelEvent.rowIndex);
							}, 16);
						}
					}
					break;
				default:
					break;
			}
		});
	};

	// 그리드 데이터 조회하여 삽입
	const requestGridData = () => {
		const grid = myGrid.value as AUIGrid;
		grid.showAjaxLoader();
		axios.get('./data/student_present.json').then((result) => {
			//console.log(result);
			// 그리드 데이터 삽입
			grid.setGridData(result.data);
			grid.removeAjaxLoader();
		});
	};

	// 행 추가, 삽입
	const addRow = () => {
		const grid = myGrid.value as AUIGrid;
		// 그리드의 편집 인푸터가 열린 경우 에디팅 완료 상태로 만듬.
		grid.forceEditingComplete(null);

		let item: any = {};
		let holidays: number[] = [6, 7, 13, 14];
		item.name = '';
		for (let i: number = 1; i <= 31; i++) {
			if (holidays.indexOf(i) >= 0) {
				item['d' + i] = 'N';
			} else {
				item['d' + i] = 'P';
			}
		}
		grid.addRow(item, 'last');
	};

	// 행 삭제
	const removeRow = () => {
		const grid = myGrid.value as AUIGrid;
		grid.removeRow('selectedIndex');
	};

	// 삭제해서 마크 된(줄이 그어진) 행을 복원 합니다.(삭제 취소)
	const restoreSoftRow = () => {
		const grid = myGrid.value as AUIGrid;
		// 선택 행 삭제 취소(선택 행이 삭제 됐다면...)
		grid.restoreSoftRows('selectedIndex');
	};

	// 삭제해서 마크 된(줄이 그어진) 행을 그리드에서 제거 합니다.
	const removeSoftRows = () => {
		const grid = myGrid.value as AUIGrid;
		// 삭제 처리된 아이템 있는지 보기
		const removedRows: any[] = grid.getRemovedItems(true);

		if (removedRows.length <= 0) {
			alert('삭제 처리되어 마크된 행이 없습니다.');
			return;
		}

		// softRemoveRowMode 가 true 일 때 삭제를 하면 그리드 상에 마크가 되는데
		// 이를 실제로 그리드에서 삭제 함.
		if (window.confirm('다시 복구 할 수 없습니다. 삭제 하시겠습니까?')) {
			grid.removeSoftRows();
		}
	};

	// 엑셀로 내보내기
	const exportClick = () => {
		const grid = myGrid.value as AUIGrid;
		// 내보내기 실행
		grid.exportToXlsx({
			progressBar: true,
			fileName: '쇼케이스-01'
		});
	};

	// PDF 로 내보내기
	const exportPdfClick = () => {
		const grid = myGrid.value as AUIGrid;
		// 내보내기 실행
		grid.exportToPdf({
			// 폰트 경로 지정
			fontPath: './fonts/nyjgothic-medium.ttf',
			fileName: '쇼케이스-01'
		});
	};
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
		<!-- AUIGrid 컴포넌트 설정 -->
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" />
	</div>
</template>
