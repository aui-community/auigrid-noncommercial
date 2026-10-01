<script setup>
	import AUIGrid from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
	import axios from 'axios';
	import data from './data/EditDropDownData';
	import { ref, onMounted } from 'vue';

	const PUBLIC_URL = import.meta.env.BASE_URL;
	const myGrid = ref(null);

	const gridProps = {
		width: '100%',
		height: 480,
		editable: true
	};

	let posList = [];
	let myList = [];
	let colorList = [];
	let keyValueList = [];
	let groupList = [];
	let groupAList = [];
	let groupBList = [];
	let groupCList = [];

	const calIconClick = () => {
		myGrid.value.openInputer();
	};

	const columnLayout = [
		{
			dataField: 'position',
			headerText: '직급',
			width: 140,
			renderer: {
				type: 'IconRenderer',
				iconWidth: 16,
				iconHeight: 16,
				iconPosition: 'aisleRight',
				iconTableRef: { default: `${PUBLIC_URL}/assets/arrow-down-black-icon.png` },
				onClick: calIconClick
			},
			editRenderer: {
				type: 'DropDownListRenderer',
				showEditorBtn: false,
				showEditorBtnOver: false,
				listFunction: () => posList
			}
		},
		{
			dataField: 'id',
			headerText: '이름',
			headerTooltip: { show: true, tooltipHtml: '출력 리스트를 사용자 정의 하여 복잡한 구조로 작성. key-value 모드' },
			width: 140,
			labelFunction: (_rowIndex, _columnIndex, value) => {
				const found = myList.find((item) => item.id === value);
				return found ? found.name : value;
			},
			editRenderer: {
				type: 'DropDownListRenderer',
				showEditorBtnOver: true,
				keyField: 'id',
				valueField: 'name',
				listFunction: () => myList,
				listTemplateFunction: (_rowIndex, _columnIndex, _text, _item, _dataField, listItem) => {
					let html = '<div style="display:block;text-align:left;white-space:nowrap">';
					html += `<img src="./assets/${listItem.flag}" width="30" height="20" style="vertical-align:middle;padding-right:10px;"/>`;
					for (const n in listItem) {
						if (n !== 'flag') {
							html += `<span style="display:inline-block;width:80px;">${listItem[n]}</span>`;
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
				showEditorBtnOver: true,
				easyMode: false,
				listFunction: () => colorList
			}
		},
		{
			dataField: 'color2',
			headerText: '조건 리스트',
			width: 140,
			headerTooltip: { show: true, tooltipHtml: '특정 조건에 따라 다르게 리스트 출력<br>컬러 값에 따라 리스트가 다르게 나옵니다.' },
			editRenderer: {
				type: 'DropDownListRenderer',
				showEditorBtnOver: true,
				listFunction: (_rowIndex, _columnIndex, item) => {
					if (item.color === 'Black') return ['어두움', '단순함', '악함', '더러움'];
					if (item.color === 'White') return ['밝음', '순수함', '선함', '깨끗함'];
					if (item.color === 'Red') return ['강렬함', '열정적임'];
					return ['차분함', '시원함', '희망적임'];
				}
			}
		},
		{
			dataField: 'dept',
			headerText: '부서명',
			width: 140,
			headerTooltip: { show: true, tooltipHtml: 'key-value 형태의 수정 예제. 실제 데이터는 001, 002 와 같이 구성됨.' },
			labelFunction: (_rowIndex, _columnIndex, value) => {
				const found = keyValueList.find((item) => item.code === value);
				return found ? found.value : value;
			},
			editRenderer: {
				type: 'DropDownListRenderer',
				keyField: 'code',
				valueField: 'value',
				listFunction: () => keyValueList
			}
		},
		{
			dataField: 'group',
			headerText: '그룹',
			width: 140,
			editRenderer: {
				type: 'DropDownListRenderer',
				descendants: ['leaf'],
				descendantDefaultValues: ['-'],
				listFunction: () => groupList
			}
		},
		{
			dataField: 'leaf',
			headerText: '그룹 하위',
			width: 140,
			editRenderer: {
				type: 'DropDownListRenderer',
				listFunction: (_rowIndex, _columnIndex, item) => {
					if (item.group === 'A') return groupAList;
					if (item.group === 'B') return groupBList;
					return groupCList;
				}
			}
		}
	];

	const getGridData = () => {
		console.log(myGrid.value.getGridData());
	};

	onMounted(async () => {
		const response = await axios.get('./data/drop_list_data.json');
		posList = response.data.posList;
		myList = response.data.myList;
		colorList = response.data.colorList;
		keyValueList = response.data.keyValueList;
		groupList = response.data.groupList;
		groupAList = response.data.groupAList;
		groupBList = response.data.groupBList;
		groupCList = response.data.groupCList;

		myGrid.value.setGridData(data);
	});
</script>
<template>
	<div>
		<div class="desc">
			<button class="btn" @click="getGridData">그리드 데이터 콘솔에 출력</button>
		</div>
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" />
	</div>
</template>
