<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import * as IGrid from 'aui-grid';
	import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
	import axios from 'axios';
	import data from '@/samples/data/EditDropDownData';

	const BASE_URL = import.meta.env.BASE_URL;

	type AUIGrid = InstanceType<typeof AUIGrid>;

	const myGrid = ref<AUIGrid | null>(null);

	const posListRef = ref<any>([]);
	const myListRef = ref<any>([]);
	const colorListRef = ref<any>([]);
	const keyValueListRef = ref<any>([]);
	const groupListRef = ref<any>([]);
	const groupAListRef = ref<any>([]);
	const groupBListRef = ref<any>([]);
	const groupCListRef = ref<any>([]);

	const columnLayout: IGrid.Column[] = [
		{
			dataField: 'position',
			headerText: '직급',
			width: 140,
			renderer: {
				type: IGrid.RendererKind.IconRenderer,
				iconWidth: 16,
				iconHeight: 16,
				iconPosition: 'aisleRight',
				iconTableRef: { default: BASE_URL + '/assets/arrow-down-black-icon.png' },
				onClick: () => myGrid.value?.openInputer()
			},
			editRenderer: {
				type: IGrid.EditRendererKind.DropDownListRenderer,
				showEditorBtn: false,
				showEditorBtnOver: false,
				listFunction: () => posListRef.value
			}
		},
		{
			dataField: 'id',
			headerText: '이름',
			headerTooltip: { show: true, tooltipHtml: '출력 리스트를 사용자 정의 하여 복잡한 구조로 작성. key-value 모드' },
			width: 140,
			labelFunction: (_rowIndex, _columnIndex, value) => {
				const found = myListRef.value.find((item: any) => item.id === value);
				return found ? found.name : value;
			},
			editRenderer: {
				type: IGrid.EditRendererKind.DropDownListRenderer,
				showEditorBtnOver: true,
				keyField: 'id',
				valueField: 'name',
				listFunction: () => myListRef.value,
				listTemplateFunction: (_rowIndex: number, _columnIndex: number, _text: string, _item: any, _dataField: string, listItem: any) => {
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
				type: IGrid.EditRendererKind.DropDownListRenderer,
				showEditorBtnOver: true,
				easyMode: false,
				listFunction: () => colorListRef.value
			}
		},
		{
			dataField: 'color2',
			headerText: '조건 리스트',
			width: 140,
			headerTooltip: { show: true, tooltipHtml: '특정 조건에 따라 다르게 리스트 출력<br>컬러 값에 따라 리스트가 다르게 나옵니다.' },
			editRenderer: {
				type: IGrid.EditRendererKind.DropDownListRenderer,
				showEditorBtnOver: true,
				listFunction: (_rowIndex: number, _columnIndex: number, item: any) => {
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
				const found = keyValueListRef.value.find((item: any) => item.code === value);
				return found ? found.value : value;
			},
			editRenderer: {
				type: IGrid.EditRendererKind.DropDownListRenderer,
				keyField: 'code',
				valueField: 'value',
				listFunction: () => keyValueListRef.value
			}
		},
		{
			dataField: 'group',
			headerText: '그룹',
			width: 140,
			editRenderer: {
				type: IGrid.EditRendererKind.DropDownListRenderer,
				descendants: ['leaf'],
				descendantDefaultValues: ['-'],
				listFunction: () => groupListRef.value
			}
		},
		{
			dataField: 'leaf',
			headerText: '그룹 하위',
			width: 140,
			editRenderer: {
				type: IGrid.EditRendererKind.DropDownListRenderer,
				listFunction: (_rowIndex: number, _columnIndex: number, item: any) => {
					if (item.group === 'A') return groupAListRef.value;
					if (item.group === 'B') return groupBListRef.value;
					return groupCListRef.value;
				}
			}
		}
	];

	const gridProps: IGrid.Props = {
		width: '100%',
		height: 480,
		editable: true
	};

	onMounted(async () => {
		const response = await axios.get('./data/drop_list_data.json');
		posListRef.value = response.data.posList;
		myListRef.value = response.data.myList;
		colorListRef.value = response.data.colorList;
		keyValueListRef.value = response.data.keyValueList;
		groupListRef.value = response.data.groupList;
		groupAListRef.value = response.data.groupAList;
		groupBListRef.value = response.data.groupBList;
		groupCListRef.value = response.data.groupCList;

		myGrid.value?.setGridData(data);
	});

	const getGridData = () => {
		console.log((myGrid.value as AUIGrid).getGridData());
	};
</script>
<template>
	<div>
		<div class="desc">
			<p>Vue 의 &lt;script setup&gt; 은 컴포넌트 인스턴스가 생성될 때 딱 한 번만 실행됩니다. React 함수형 컴포넌트처럼 상태가 바뀔 때마다 전체 코드가 재실행되는 구조가 아니므로, 리렌더링을 피하기 위해 상태 관리 방식을 따로 구분할 필요가 없습니다.</p>
			<p>posListRef, myListRef 등을 ref() 로 선언한 것은 단순히 비동기로 받아온 드랍다운 리스트 데이터를 담아두기 위함이며, ref 로 선언하든 일반 변수로 선언하든 그리드 동작에는 차이가 없습니다.</p>
			<p>columnLayout 은 컴포넌트 생성 시 단 한 번만 정의되고, 그 안의 listFunction: () =&gt; xxxRef.value 는 그리드가 실제로 호출하는 시점의 값을 그대로 읽어옵니다.</p>
			<p>따라서 API 응답을 받은 후 ref 의 값만 갱신하면, columnLayout 을 다시 만들거나 그리드에 재적용할 필요 없이 드랍다운 리스트에 자연스럽게 반영됩니다.</p>
			<button class="btn" @click="getGridData">그리드 데이터 콘솔에 출력</button>
		</div>
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" />
	</div>
</template>
