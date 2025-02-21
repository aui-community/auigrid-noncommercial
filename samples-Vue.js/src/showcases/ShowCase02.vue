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
			// 트리 전체 펼침 여부
			isExpanded: true,
			selected: 0,

			// 상단 계층 리스트
			listItems: [
				{
					text: '계층 1 Depth 만 보이기',
					value: 1
				},
				{
					text: '계층 2 Depth 만 보이기',
					value: 2
				},
				{
					text: '계층 3 Depth 만 보이기',
					value: 3
				}
			],

			// 그리드 칼럼 레이아웃
			columnLayout: [],

			// 그리드 속성 정의
			gridProps: {
				width: '100%',
				height: 480,
				selectionMode: 'singleRow',
				editable: true,
				enableFilter: true,
				showStateColumn: true,
				// 트리 컬럼(즉, 폴딩 아이콘 출력 칼럼) 을 인덱스1번으로 설정함(디폴트 0번임)
				treeColumnIndex: 1,
				// 최초 보여질 때 모두 열린 상태로 출력 여부
				displayTreeOpen: true,
				// 체크박스 사용 안함
				showRowCheckColumn: false,
				showRowNumColumn: false
			},

			// 그리드 데이터
			gridData: []
		}),

		watch: {
			// gridData 가 변경될 때 마다 이 기능이 실행됩니다.
			gridData: function () {
				const grid = this.$refs.myGrid;
				// gridData 변경 될 때 그리드에 다시 삽입
				grid.setGridData(this.gridData);
			}
		},

		created() {
			console.log('Showcase02 생성됨');
			// 구체적인 칼럼 레이아웃 작성
			this.columnLayout = [
				{
					dataField: 'id',
					headerText: 'ID',
					width: 50
				},
				{
					dataField: 'name',
					headerText: 'Task Name',
					filter: {
						showIcon: true
					},
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
					filter: {
						showIcon: true
					},
					headerTooltip: {
						show: true,
						tooltipHtml: '<div style="width:120px;text-align:left;"><p>Things I Can Do</p><p> Integer eu ante ornare amet commetus vestibulum blandit integer in curae ac faucibus integer non. Adipiscing cubilia elementum integer lorem ipsum dolor sit amet.</p></div>' // eslint-disable-line
					},
					style: 'showcase2-my-left-text',
					width: 120,
					renderer: {
						type: 'IconRenderer',
						iconWidth: 20, // icon 가로 사이즈, 지정하지 않으면 24로 기본값 적용됨
						iconHeight: 20,
						iconFunction: function (rowIndex, columnIndex, value) {
							if (value && value.substr(0, 1) == 'A') return './assets/office_female.png';
							return './assets/office_man.png';
						}
					},
					editRenderer: {
						type: 'ComboBoxRenderer',
						showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
						historyMode: true, // 콤보 리스트 외에 사용자가 다른 값을 입력하면 해당 값이 기존 list 에 추가되어 출력됨
						listAlign: 'left'
					}
				},
				{
					dataField: 'complete',
					headerText: 'Complete(%)',
					width: 100,
					dataType: 'numeric',
					renderer: {
						type: 'BarRenderer',
						min: 0,
						max: 100
					},
					editRenderer: {
						type: 'NumberStepRenderer',
						min: 0,
						max: 100,
						step: 1
					},
					styleFunction: function (rowIndex, columnIndex, value) {
						if (value == 100) return 'showcase2-complete-red';
						return '';
					}
				},
				{
					dataField: 'start',
					headerText: 'Start Date',
					formatString: 'mm/dd/yyyy',
					dataType: 'date',
					width: 120,
					renderer: {
						type: 'IconRenderer',
						iconWidth: 16, // icon 사이즈, 지정하지 않으면 rowHeight에 맞게 기본값 적용됨
						iconHeight: 16,
						iconPosition: 'aisleRight',
						iconTableRef: {
							// icon 값 참조할 테이블 레퍼런스
							default: './assets/calendar-icon.png' // default
						},
						onClick: this.calIconClick
					},
					editRenderer: {
						type: 'CalendarRenderer',
						showEditorBtn: false, // 기본 에디터버턴 사용 안함.
						onlyCalendar: true, // 달력으로만 수정 가능
						titles: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
						monthTitleString: 'mmm',
						formatMonthString: 'mmm yyyy',
						formatYearString: 'yyyy',
						showExtraDays: true, // 지난 달, 다음 달 여분의 날짜(days) 출력 안함
						showTodayBtn: true, // 오늘 날짜 선택 버턴 출력
						todayText: 'Today' // 오늘 날짜 버턴 텍스트
					}
				},
				{
					dataField: 'end',
					headerText: 'End Date',
					formatString: 'mm/dd/yyyy',
					dataType: 'date',
					width: 120,
					renderer: {
						type: 'IconRenderer',
						iconWidth: 16, // icon 사이즈, 지정하지 않으면 rowHeight에 맞게 기본값 적용됨
						iconHeight: 16,
						iconPosition: 'aisleRight',
						iconTableRef: {
							// icon 값 참조할 테이블 레퍼런스
							default: './assets/calendar-icon.png' // default
						},
						onClick: this.calIconClick
					},
					editRenderer: {
						type: 'CalendarRenderer',
						showEditorBtn: false, // 기본 에디터버턴 사용 안함.
						onlyCalendar: true, // 달력으로만 수정 가능
						titles: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
						monthTitleString: 'mmm',
						formatMonthString: 'mmm yyyy',
						formatYearString: 'yyyy',
						showExtraDays: true, // 지난 달, 다음 달 여분의 날짜(days) 출력 안함
						showTodayBtn: true, // 오늘 날짜 선택 버턴 출력
						todayText: 'Today' // 오늘 날짜 버턴 텍스트
					}
				},
				{
					dataField: 'issue',
					headerText: 'Issues',
					style: 'showcase2-my-left-text'
				}
			];
		},

		mounted() {
			console.log('Showcase02 마운트됨');
			// 초기 데이터 얻기
			this.requestGridData();
		},

		unmounted() {
			console.log('Showcase02 언마운트됨');
		},

		methods: {
			// 데이터 요청 메소드
			requestGridData() {
				const grid = this.$refs.myGrid;
				grid.showAjaxLoader();
				// axios 모듈을 통하여 요청합니다.
				const REQ_URL = './data/schedule_tree.json';
				axios.get(REQ_URL).then((result) => {
					this.gridData = result.data;
					grid.removeAjaxLoader();
				});
			},

			// 달력 아이콘 클릭하면 실제로 달력을 띄움.
			// 즉, 수정으로 진입함.
			calIconClick() {
				const grid = this.$refs.myGrid;
				grid.openInputer();
			},

			// 모두 열기/닫기
			handleExpandBtnClick() {
				const grid = this.$refs.myGrid;
				if (!this.isExpanded) {
					grid.expandAll();
				} else {
					grid.collapseAll();
				}
				this.isExpanded = !this.isExpanded;
			},

			// 트리 depth 별 오픈하기
			handleSelect(e) {
				const depth = Number(e.target.value);
				const grid = this.$refs.myGrid;
				// 해당 depth 까지 오픈함
				grid.showItemsOnDepth(Number(depth));
			},

			// 엑셀로 내보내기
			exportClick() {
				const grid = this.$refs.myGrid;
				// 내보내기 실행
				grid.exportToXlsx({
					progressBar: true,
					fileName: '쇼케이스-02'
				});
			},

			// PDF 로 내보내기
			exportPdfClick() {
				const grid = this.$refs.myGrid;

				// 완전한 HTML5 를 지원하는 브라우저에서만 PDF 저장 가능( IE=10부터 가능 )
				if (!grid.isAvailabePdf()) {
					alert('PDF 저장은 HTML5를 지원하는 최신 브라우저에서 가능합니다.(IE는 10부터 가능)');
					return;
				}

				// 내보내기 실행
				grid.exportToPdf({
					// 폰트 경로 지정
					fontPath: './fonts/jejugothic-regular.ttf',
					fileName: '쇼케이스-02'
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
		<!-- AUIGrid 컴포넌트 설정 -->
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
