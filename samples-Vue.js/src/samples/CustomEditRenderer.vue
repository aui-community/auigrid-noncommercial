<script setup>
	import AUIGrid from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
	import AUIGridVueDatePicker from '@/editRenderers/AUIGrid.VueDatepicker';
	import { ref, onMounted } from 'vue';

	const PUBLIC_URL = import.meta.env.BASE_URL;
	const myGrid = ref(null);

	const gridProps = {
		width: '100%',
		height: 480,
		editable: true
	};

	const openGridEditor = () => {
		myGrid.value.openInputer();
	};

	const columnLayout = [
		{
			dataField: 'field0',
			headerText: 'VueDatepicker 달력',
			dataType: 'date',
			dateInputFormat: 'yyyy/mm/dd',
			formatString: 'yyyy년 mm월 dd일',
			width: 240,
			renderer: {
				type: 'IconRenderer',
				iconWidth: 16,
				iconHeight: 16,
				iconPosition: 'aisleRight',
				iconTableRef: {
					default: `${PUBLIC_URL}/assets/calendar-icon.png`
				},
				onClick: openGridEditor
			},
			editRenderer: {
				type: 'CustomEditRenderer',
				jsClass: AUIGridVueDatePicker,
				width: 260,
				height: 290,
				extraProps: {
					locale: 'ko',
					yearFirst: true,
					autoApply: true,
					enableTimePicker: false
				}
			}
		},
		{
			dataField: 'field1',
			headerText: 'VueDatepicker 날짜-시간',
			dataType: 'date',
			dateInputFormat: 'yyyy/mm/dd HH:MM',
			formatString: 'yyyy. mm. dd. HH:MM',
			width: 240,
			editRenderer: {
				type: 'CustomEditRenderer',
				jsClass: AUIGridVueDatePicker,
				width: 260,
				height: 360,
				extraProps: {
					locale: 'ko',
					yearFirst: true
				}
			}
		},
		{
			dataField: 'field2',
			headerText: 'VueDatepicker 시간',
			dataType: 'date',
			dateInputFormat: 'yyyy/mm/dd HH:MM',
			formatString: 'HH:MM',
			width: 240,
			editRenderer: {
				type: 'CustomEditRenderer',
				jsClass: AUIGridVueDatePicker,
				width: 260,
				height: 360,
				extraProps: {
					locale: 'ko',
					timePicker: true
				}
			}
		}
	];

	const gridData = [
		{ field0: '2019/12/22', field1: '2019/12/22 10:30', field2: '2019/12/22 11:30', field3: '2019/12/22', field4: '2019/12', field5: '2019/12/22', field6: '2019/12/22' },
		{ field0: '2019/12/12', field1: '2019/12/12 10:31', field2: '2019/12/12 11:30', field3: '2019/12/12', field4: '2019/12', field5: '2019/12/12', field6: '2019/12/12' },
		{ field0: '2019/12/02', field1: '2019/12/02 10:32', field2: '2019/12/02 11:30', field3: '2019/12/02', field4: '2019/12', field5: '2019/12/02', field6: '2019/12/02' },
		{ field0: '2019/11/22', field1: '2019/11/22 10:33', field2: '2019/11/22 11:30', field3: '2019/11/22', field4: '2019/11', field5: '2019/11/22', field6: '2019/11/22' },
		{ field0: '2019/11/12', field1: '2019/11/12 10:34', field2: '2019/11/12 11:30', field3: '2019/11/12', field4: '2019/11', field5: '2019/11/12', field6: '2019/11/12' },
		{ field0: '2019/11/02', field1: '2019/11/02 10:35', field2: '2019/11/02 11:30', field3: '2019/11/02', field4: '2019/11', field5: '2019/11/02', field6: '2019/11/02' },
		{ field0: '2019/10/23', field1: '2019/10/23 10:36', field2: '2019/10/23 11:30', field3: '2019/10/23', field4: '2019/10', field5: '2019/10/23', field6: '2019/10/23' },
		{ field0: '2019/10/13', field1: '2019/10/13 10:37', field2: '2019/10/13 11:30', field3: '2019/10/13', field4: '2019/10', field5: '2019/10/13', field6: '2019/10/13' },
		{ field0: '2019/10/03', field1: '2019/10/03 10:38', field2: '2019/10/03 11:30', field3: '2019/10/03', field4: '2019/10', field5: '2019/10/03', field6: '2019/10/03' }
	];

	const cellEditEndHandler = (event) => {
		console.log('수정 완료 : ', event);
	};

	const cellEditCancelHandler = (event) => {
		console.log('수정 취소 : ', event);
	};

	onMounted(() => {
		myGrid.value.setGridData(gridData);
	});
</script>
<template>
	<div>
		<div class="desc">
			<p>Vue datepicker 커스텀 에디트 렌더러 작성한 예제입니다.</p>
			<p>Vue datepicker is licensed under the MIT License.</p>
			<a href="https://vue3datepicker.com/" target="_blank" class="link-is-link">https://vue3datepicker.com/</a>
		</div>
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" @cellEditEnd="cellEditEndHandler" @cellEditCancel="cellEditCancelHandler" />
	</div>
</template>
