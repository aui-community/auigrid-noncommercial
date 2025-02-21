<script>
	// AUIGrid 컴포넌트
	import AUIGrid from '../static/AUIGrid-Vue.js/AUIGrid.vue';
	import axios from 'axios';
	import data from './data/EditDropDownData';

	const PUBLIC_URL = process.env.BASE_URL;

	export default {
		components: {
			AUIGrid
		},

		data: () => ({
			posList: [],
			myList: [],
			colorList: [],
			keyValueList: [],

			// 칼럼 레이아웃 정의
			columnLayout: [],

			// 그리드 속성 정의
			gridProps: {
				width: '100%',
				height: 480,
				editable: true
			}
		}),

		async created() {
			// 구체적인 칼럼 레이아웃 정의
			this.createColumnLayout();
			console.log('create async');

			// 드랍다운리스트에서 사용할 list 들 async로 얻기
			const REQ_URL = './data/drop_list_data.json';
			const response = await axios.get(REQ_URL);
			console.log('create async response ', response);
			this.posList = response.data.posList;
			this.myList = response.data.myList;
			this.colorList = response.data.colorList;
			this.keyValueList = response.data.keyValueList;
			this.groupList = response.data.groupList;
			this.groupAList = response.data.groupAList;
			this.groupBList = response.data.groupBList;
			this.groupCList = response.data.groupCList;

			// 그리드에 데이터 삽입
			this.requestGridData();
		},

		mounted() {
			console.log('EditDropDown 마운트됨');
		},

		unmounted() {
			console.log('EditDropDown 언마운트됨');
		},
		methods: {
			createColumnLayout() {
				// 그리드 칼럼 레이아웃
				this.columnLayout = [
					{
						dataField: 'position',
						headerText: '직급',
						width: 140,
						renderer: {
							type: 'IconRenderer',
							iconWidth: 16, // icon 사이즈, 지정하지 않으면 rowHeight에 맞게 기본값 적용됨
							iconHeight: 16,
							iconPosition: 'aisleRight',
							iconTableRef: {
								// icon 값 참조할 테이블 레퍼런스
								default: PUBLIC_URL + 'assets/arrow-down-black-icon.png' // default
							},
							onClick: this.calIconClick // 아이콘을 클릭하면 수정으로 진입함.
						},
						editRenderer: {
							type: 'DropDownListRenderer',
							showEditorBtn: false,
							showEditorBtnOver: false, // 마우스 오버 시 에디터버턴 보이기
							//list: this.posList,
							listFunction: () => {
								return this.posList;
							}
						}
					},
					{
						dataField: 'id',
						headerText: '이름',
						headerTooltip: { show: true, tooltipHtml: '출력 리스트를 사용자 정의 하여 복잡한 구조로 작성. key-value 모드' },
						width: 140,
						labelFunction: (rowIndex, columnIndex, value) => {
							let retStr = '';
							const myList = this.myList;
							for (let i = 0, len = myList.length; i < len; i++) {
								if (myList[i]['id'] === value) {
									retStr = myList[i]['name'];
									break;
								}
							}
							return retStr === '' ? value : retStr;
						},
						editRenderer: {
							type: 'DropDownListRenderer',
							showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
							keyField: 'id',
							valueField: 'name',
							listFunction: () => {
								return this.myList;
							},
							// 드랍 리스트의 개별 아이템에 대하여 출력할 양식을 HTML 로 작성하여 반환하면 리스트로 출력됩니다.
							listTemplateFunction: (rowIndex, columnIndex, text, item, dataField, listItem) => {
								let html = '<div style="display:block;text-align:left;white-space:nowrap">';
								html += '<img src="./assets/' + listItem.flag + '" width="30" height="20" style="vertical-align:middle;padding-right:10px;"/>';
								for (let n in listItem) {
									if (n !== 'flag') {
										html += '<span style="display:inline-block;width:80px;">' + listItem[n] + '</span>';
									}
								}
								html += '</div>';
								return html;
							}
						}
					},
					{
						dataField: 'color',
						headerText: '컬러',
						width: 140,
						headerTooltip: {
							show: true,
							tooltipHtml: '리스트에서 아이템 선택 후 재선택 가능토록<br/>다른 셀 클릭 전까지 완료가 되지 않습니다.(easyMode=false)'
						},
						editRenderer: {
							type: 'DropDownListRenderer',
							showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
							easyMode: false,
							listFunction: () => {
								return this.colorList;
							}
						}
					},
					{
						dataField: 'color2',
						headerText: '조건 리스트',
						width: 140,
						headerTooltip: {
							show: true,
							tooltipHtml: '특정 조건에 따라 다르게 리스트 출력<br>컬러 값에 따라 리스트가 다르게 나옵니다.'
						},
						editRenderer: {
							type: 'DropDownListRenderer',
							showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
							// 같은 행의 color 값을 보고 출력시킬 list 를 결정함.
							listFunction: (rowIndex, columnIndex, item) => {
								if (item.color === 'Black') {
									return ['어두움', '단순함', '악함', '더러움'];
								} else if (item.color === 'White') {
									return ['밝음', '순수함', '선함', '깨끗함'];
								} else if (item.color === 'Red') {
									return ['강렬함', '열정적임'];
								} else {
									return ['차분함', '시원함', '희망적임'];
								}
							}
						}
					},
					{
						dataField: 'dept',
						headerText: '부서명',
						width: 140,
						headerTooltip: {
							show: true,
							tooltipHtml: 'key-value 형태의 수정 예제. 실제 데이터는 001, 002 와 같이 구성됨.'
						},
						labelFunction: (rowIndex, columnIndex, value) => {
							let retStr = value;
							const keyValueList = this.keyValueList;
							for (let i = 0, len = keyValueList.length; i < len; i++) {
								if (keyValueList[i]['code'] === value) {
									retStr = keyValueList[i]['value'];
									break;
								}
							}
							return retStr;
						},
						editRenderer: {
							type: 'DropDownListRenderer',
							keyField: 'code', // key 에 해당되는 필드명
							valueField: 'value', // value 에 해당되는 필드명
							listFunction: () => {
								return this.keyValueList; //key-value Object 로 구성된 리스트
							}
						}
					},
					{
						dataField: 'group',
						headerText: '그룹',
						width: 140,
						editRenderer: {
							type: 'DropDownListRenderer',
							descendants: ['leaf'], // 자손 필드들
							descendantDefaultValues: ['-'], // 변경 시 자손들에게 기본값 지정
							listFunction: () => {
								return this.groupList;
							}
						}
					},
					{
						dataField: 'leaf',
						headerText: '그룹 하위',
						width: 140,
						editRenderer: {
							type: 'DropDownListRenderer',
							listFunction: (rowIndex, columnIndex, item) => {
								if (item.group === 'A') {
									// 그룹 필드에서 선택된 값 비교
									return this.groupAList;
								} else if (item.group === 'B') {
									return this.groupBList;
								} else {
									return this.groupCList;
								}
							}
						}
					}
				];
			},

			// 수정으로 진입함.
			calIconClick() {
				const grid = this.$refs.myGrid;
				grid.openInputer();
			},

			// 그리드 데이터 삽입
			requestGridData() {
				const grid = this.$refs.myGrid;
				grid.setGridData(data);
			},

			getGridData() {
				const grid = this.$refs.myGrid;
				console.log(grid.getGridData());
			}
		}
	};
</script>
<template>
	<div>
		<div class="desc">
			<button class="btn" @click="getGridData">그리드 데이터 콘솔에 출력</button>
		</div>
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" />
	</div>
</template>
