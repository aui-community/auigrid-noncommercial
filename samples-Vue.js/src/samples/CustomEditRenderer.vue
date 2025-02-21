<script>
	// AUIGrid 컴포넌트
	import AUIGrid from '../static/AUIGrid-Vue.js/AUIGrid.vue';
	// 아파치 ECharts 출력하는 AUIGrid 렌더러
	import AUIGridVueDatePicker from '../editRenderers/AUIGrid.VueDatepicker';

	const PUBLIC_URL = process.env.BASE_URL;

	export default {
		components: {
			AUIGrid
		},

		data: () => ({
			// 그리드 속성 정의
			gridProps: {
				width: '100%',
				height: 480,
				// 편집 가능 여부 (기본값 : false)
				editable: true
			},

			// 그리드 칼럼 레이아웃 (메소드에서 작성하여 반환)
			columnLayout: null
		}),
		created() {
			console.log('CustomEditRenderer 생성됨');

			// 구체적인 칼럼 레이아웃 작성
			this.columnLayout = this.createColumnLayout();
		},

		mounted() {
			console.log('CustomEditRenderer 마운트됨');
			// 초기 데이터 얻기
			this.requestGridData();
		},

		unmounted() {
			console.log('CustomEditRenderer 언마운트됨');
		},

		methods: {
			createColumnLayout() {
				return [
					{
						dataField: 'field0',
						headerText: 'VueDatepicker 달력',
						dataType: 'date',
						dateInputFormat: 'yyyy/mm/dd', // 실제 데이터의 형식 지정
						formatString: 'yyyy년 mm월 dd일', // 실제 데이터 형식을 어떻게 표시할지 지정
						width: 240,
						renderer: {
							type: 'IconRenderer',
							iconWidth: 16, // icon 사이즈, 지정하지 않으면 rowHeight에 맞게 기본값 적용됨
							iconHeight: 16,
							iconPosition: 'aisleRight',
							iconTableRef: {
								// icon 값 참조할 테이블 레퍼런스
								default: PUBLIC_URL + '/assets/calendar-icon.png' // default
							},
							onClick: this.openGridEditor
						},
						editRenderer: {
							type: 'CustomEditRenderer',
							jsClass: AUIGridVueDatePicker,
							// 빠른 렌더링을 위해 width, height 정의
							width: 260,
							height: 290,
							// 여기서 VueDatePicker 속성 정의
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
						dateInputFormat: 'yyyy/mm/dd HH:MM', // 실제 데이터의 형식 지정
						formatString: 'yyyy. mm. dd. HH:MM', // 실제 데이터 형식을 어떻게 표시할지 지정
						width: 240,
						editRenderer: {
							type: 'CustomEditRenderer',
							jsClass: AUIGridVueDatePicker,
							// 빠른 렌더링을 위해 width, height 정의
							width: 260,
							height: 360,
							// 여기서 VueDatePicker 속성 정의
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
						dateInputFormat: 'yyyy/mm/dd HH:MM', // 실제 데이터의 형식 지정
						formatString: 'HH:MM', // 실제 데이터 형식을 어떻게 표시할지 지정
						width: 240,
						editRenderer: {
							type: 'CustomEditRenderer',
							jsClass: AUIGridVueDatePicker,
							// 빠른 렌더링을 위해 width, height 정의
							width: 260,
							height: 360,
							// 여기서 VueDatePicker 속성 정의
							extraProps: {
								locale: 'ko',
								timePicker: true
							}
						}
					}
				];
			},

			// 그리드 데이터 조회하여 삽입
			async requestGridData() {
				const grid = this.$refs.myGrid;
				// 그리드 데이터
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
				grid.setGridData(gridData);
			},

			openGridEditor() {
				const grid = this.$refs.myGrid;
				grid.openInputer();
			},

			cellEditEndHandler(event) {
				console.log('수정 완료 : ', event);
			},

			cellEditCancelHandler(event) {
				console.log('수정 취소 : ', event);
			}
		}
	};
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
