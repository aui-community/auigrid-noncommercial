<script>
	// AUIGrid 컴포넌트
	import AUIGrid from '../static/AUIGrid-Vue.js/AUIGrid.vue';
	import axios from 'axios';
	// 엑셀, PDF 다운로드를 브라우저에서 처리하기 위한 file-saver
	import 'file-saver';
	// AUIGrid PDF 처리 모듈
	import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';

	export default {
		components: {
			AUIGrid
		},

		data: () => ({
			// 그리드 속성 정의
			gridProps: {
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
			},

			// 그리드 칼럼 레이아웃
			columnLayout: [],

			// 푸터 데이터
			footerLayout: [
				{
					labelText: '합 계',
					positionField: 'name'
				},
				{
					dataField: 'ct',
					operation: 'SUM',
					positionField: 'ct'
				},
				{
					dataField: 'ce',
					operation: 'SUM',
					positionField: 'ce'
				},
				{
					dataField: 'cu',
					operation: 'SUM',
					positionField: 'cu'
				},
				{
					dataField: 'cp',
					operation: 'SUM',
					positionField: 'cp'
				},
				{
					dataField: 'ceu',
					operation: 'SUM',
					positionField: 'ceu'
				}
			],
			// 그리드 데이터
			gridData: []
		}),

		created() {
			console.log('Showcase01 생성됨');
			// 구체적인 칼럼 레이아웃 작성
			this.columnLayout = this.createColumnLayout();
		},

		mounted() {
			console.log('Showcase01 마운트됨');
			// 초기 데이터 얻기
			this.requestGridData();
		},
		unmounted() {
			console.log('Showcase01 언마운트됨');
		},

		methods: {
			// 칼럼 레이아웃 작성하여 반환
			createColumnLayout() {
				const columnLayout = [
					{
						dataField: 'name',
						headerText: '학생이름',
						filter: {
							showIcon: true,
							useExMenu: true
						}
					}
				];

				const column = {
					headerText: '합 계',
					children: [
						{ dataField: 'ct', expFunction: this.myExpFunction, editable: false, headerText: 'T', width: 40, headerStyle: 'mycustom-t', dataType: 'numeric', headerTooltip: { show: true, tooltipHtml: '지각' } },
						{ dataField: 'ce', expFunction: this.myExpFunction, editable: false, headerText: 'E', width: 40, headerStyle: 'mycustom-e', dataType: 'numeric', headerTooltip: { show: true, tooltipHtml: '사정 상 결석' } },
						{ dataField: 'cu', expFunction: this.myExpFunction, editable: false, headerText: 'U', width: 40, headerStyle: 'mycustom-u', dataType: 'numeric', headerTooltip: { show: true, tooltipHtml: '무단 결석' } },
						{ dataField: 'cp', expFunction: this.myExpFunction, editable: false, headerText: 'P', width: 40, headerStyle: 'mycustom-p', dataType: 'numeric', headerTooltip: { show: true, tooltipHtml: '출석' } },
						{ dataField: 'ceu', expFunction: this.myExpFunction, editable: false, headerText: '결석 일수', width: 100, dataType: 'numeric', renderer: { type: 'BarRenderer', max: 10, style: 'custmom-bar' } }
					]
				};
				columnLayout.push(column);

				const days = ['일', '월', '화', '수', '목', '금', '토'];
				for (let i = 1; i <= 31; i++) {
					const column = {};
					column.headerText = days[i % 7];
					column.children = [
						{
							dataField: 'd' + i,
							headerText: i,
							width: 40,
							styleFunction: this.cellStyleFunction
						}
					];
					columnLayout.push(column);
				}
				return columnLayout;
			},

			// 데이터 요청 메소드
			requestGridData() {
				const grid = this.$refs.myGrid;
				const REQ_URL = './data/student_present.json';

				grid.showAjaxLoader();
				axios.get(REQ_URL).then((result) => {
					// 그리드 데이터 삽입
					grid.setGridData(result.data);
					grid.removeAjaxLoader();
				});
			},

			// 셀스타일 함수 정의
			cellStyleFunction(rowIndex, columnIndex, value) {
				if (value === 'N') return 'mycustom-n';
				else if (value === 'T') return 'mycustom-t';
				else if (value === 'U') return 'mycustom-u';
				else if (value === 'E') return 'mycustom-e';
				else if (value === 'P') return 'mycustom-p';
			},

			// 행 아이템에서 T, E, U, P 개수를 구하는 수식 함수.
			myExpFunction(rowIndex, columnIndex, item, dataField) {
				let opValue;
				if (dataField === 'ceu') {
					// E, U 개수 구하기
					return Object.values(item).filter((v) => v === 'E' || v === 'U').length;
				}

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
					default:
					case 'cp': // 출석 합
						opValue = 'P';
						break;
				}
				// opValue와 동일한 개수 구하여 반환
				return Object.values(item).filter((v) => v === opValue).length;
			},

			// 셀클릭 이벤트 핸들러
			cellClickhandler(event) {
				console.log(event);
			},

			// cellEditEndBefore 이벤트에서 사용자가 입력한 텍스트를 강제로 변경가능합니다.
			cellEditEndBeforeHandler(event) {
				const oldValue = event.oldValue;
				const value = event.value;
				// cellEditEndBefore 이벤트에서 사용자가 입력한 텍스트를 강제로 변경가능합니다.
				// 이름은 어떤것을 입력해도 허용함.
				if (event.dataField === 'name') {
					console.log(`oldValue : ${oldValue}, new Value : ${value}`);
					return value;
				}

				if (!value) return oldValue;

				// 대문자로 모두 변경시킴
				const normalizedValue = value.toUpperCase();
				const validValues = ['T', 'E', 'U', 'P', 'N']; // 입력 유효값.
				if (!validValues.includes(normalizedValue)) {
					console.log(`"${value}"는 허용되지 않는 값입니다.유효한 값: ${validValues.join(', ')}`);
					return oldValue;
				}

				console.log(`oldValue: ${oldValue}, new Value : ${normalizedValue}, (대문자로 변경됨)`);
				return normalizedValue;
			},

			// 셀 편집 취소 핸들러
			cellEditCancelHandler(event) {
				const grid = this.$refs.myGrid;
				if (event.dataField === 'name') {
					// 학생 이름 입력 안하면 삭제.
					if (event.item.name === '') {
						// removeRow 메소드는 에디팅이 현재 열린 경우 취소를 시키게 됨.
						// 이 때 다시 취소 이벤트가 발생하여 무한으로 빠지는 것을 방지
						setTimeout(function () {
							grid.removeRow(event.rowIndex);
						}, 16);
					}
				}
			},

			// 행 추가, 삽입
			addRow() {
				const grid = this.$refs.myGrid;
				// 그리드의 편집 인푸터가 열린 경우 에디팅 완료 상태로 만듬.
				grid.forceEditingComplete(null);

				//새행 만들기
				const item = {};
				item.name = '';
				// 휴일(holidays) 에 해당하는 날은 "N"(예: 휴무), 그 외에는 "P"(예: 근무)로 값을 채움
				const holidays = [6, 7, 13, 14];
				for (let i = 1; i <= 31; i++) {
					item[`d${i}`] = holidays.includes(i) ? 'N' : 'P';
				}
				grid.addRow(item, 'last');
			},

			// addRowFinish 이벤트 핸들링
			addRowHandler() {
				const grid = this.$refs.myGrid;
				// 행 추가 시 추가된 행에 선택자가 이동합니다.
				// 이 때 칼럼은 기존 칼럼 그래도 유지한채 이동함.
				// 원하는 칼럼으로 선택자를 보내 강제로 편집기(inputer) 를 열기 위한 코드
				const selected = grid.getSelectedIndex();
				if (selected.length <= 0) {
					return;
				}

				const rowIndex = selected[0];
				const colIndex = grid.getColumnIndexByDataField('name');
				grid.setSelectionByIndex(rowIndex, colIndex); // name 으로 선택자 이동

				// 빈행 추가 후 인푸터 열기
				setTimeout(() => {
					// 빈행 추가 후 isbn 에 인푸터 열기
					grid.openInputer();
				}, 16);
			},

			// 행 삭제
			removeRow() {
				const grid = this.$refs.myGrid;
				grid.removeRow('selectedIndex');
			},

			// 삭제해서 마크 된(줄이 그어진) 행을 복원 합니다.(삭제 취소)
			restoreSoftRow() {
				const grid = this.$refs.myGrid;
				// 선택 행 삭제 취소(선택 행이 삭제 됐다면...)
				grid.restoreSoftRows('selectedIndex');
			},

			// 삭제해서 마크 된(줄이 그어진) 행을 그리드에서 제거 합니다.
			removeSoftRows() {
				const grid = this.$refs.myGrid;
				// 삭제 처리된 아이템 있는지 보기
				const removedRows = grid.getRemovedItems(true);

				if (removedRows.length <= 0) {
					alert('삭제 처리되어 마크된 행이 없습니다.');
					return;
				}

				// softRemoveRowMode 가 true 일 때 삭제를 하면 그리드 상에 마크가 되는데
				// 이를 실제로 그리드에서 삭제 함.
				if (confirm('다시 복구 할 수 없습니다. 삭제 하시겠습니까?')) {
					grid.removeSoftRows();
				}
			},

			// 엑셀로 내보내기
			exportClick() {
				const grid = this.$refs.myGrid;
				// 내보내기 실행
				grid.exportToXlsx({
					progressBar: true,
					fileName: '쇼케이스-01'
				});
			},

			// PDF 로 내보내기
			exportPdfClick() {
				const grid = this.$refs.myGrid;
				// 내보내기 실행
				grid.exportToPdf({
					// 폰트 경로 지정 (필수)
					fontPath: './fonts/nyjgothic-medium.ttf'
				});
			}
		}
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
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" :footerLayout="footerLayout" @cellClick="cellClickhandler" @cellEditEndBefore="cellEditEndBeforeHandler" @cellEditCancel="cellEditCancelHandler" @addRowFinish="addRowHandler" />
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
	/* 커스텀 셀 스타일 정의 */
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
