import { h, render } from 'vue';
import { agUtils } from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
// Vue datepicker is licensed under the MIT License.
// https://vue3datepicker.com/
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

/* eslint-disable */
/*
 * AUIGrid 사용자 정의 에디트 렌더러
 */
export default window.AUIGrid.Class({
	/****************************************************************
	 *
	 * Overriden Properties
	 *
	 ****************************************************************/

	/* 생성될 HTML Tag 명 */
	tagName: 'div',

	/* 렌더러 HTML 엘리먼트 */
	element: null,

	/* CSS 스타일 클래스 */
	cssClass: 'aui-grid-edit-renderer-custom aui-grid-vue-date-picker',

	/* 행 아이템 */
	data: null,

	/* 렌더러의 칼럼 레이아웃 데이터 */
	columnData: null,

	/* 칼럼 인덱스 */
	columnIndex: -1,

	/* 행 인덱스 */
	rowIndex: -1,

	/* 데이터 필드명 */
	dataField: '',

	/* 사용자가 설정한 여분의 속성 */
	extraProps: null,

	/****************************************************************
	 *
	 * Private Properties
	 *
	 * Rule : Private Properties 는 반드시 __ 로 시작하십시오
	 * 즉, 사용자가 추가하는 속성, 메소드는 __ 로 시작하십시오.
	 *
	 ****************************************************************/

	// vue vnode
	__vNode: null,

	// 타임 픽커로 사용하는지 여부
	__isTimePicker: false,

	/****************************************************************
	 *
	 * Overriden Methods
	 *
	 ****************************************************************/

	/*
	 * @Overriden public destroy
	 * @param {boolean} unload 실제 DOM 에서 제거할지 여부
	 *
	 * 셀 수정 완료(취소) 될 때 마지막에 호출됩니다.
	 * 여기서 해제할 것 모두 해제 하십시오.
	 * 메모리 누수를 유발하는 코드들을 모두 해제 하십시오.
	 */
	destroy: function (unload) {
		// vue vnode 제거
		if (this.element) render(null, this.element);
		this.__vNode = null;

		// 필수 : 반드시 아래 코드는 추가 해야 합니다.
		this.$super.destroy(unload);
	},

	/*
	 * @Overriden public create
	 *
	 * 셀 수정 진입할 때 동적으로 에디트렌더러가 생성되며 그리드에 의해 호출됩니다.
	 * 초기 엘리먼트 생성 및 이벤트를 설정하십시오.
	 */
	create: function () {
		// 현재 값 (현재 셀에 출력되는 값)
		let value = this.data[this.dataField];

		// vue datepicker 에 전달할 속성 정의 값들
		const extraProps = this.extraProps;

		// vue datepicker 에서 inline = true 강제 시킴
		extraProps.inline = true;

		// 타임픽커 정의한 경우
		if (extraProps.timePicker) {
			this.__isTimePicker = true;
			value = {
				hours: new Date(value).getHours(),
				minutes: new Date(value).getMinutes()
			};
		}

		// vue vnode 작성
		this.__vnode = h(VueDatePicker, {
			modelValue: value,
			'onUpdate:modelValue': (value) => this.__updateVueDate(value),
			...extraProps
		});

		// vue render 함수
		render(this.__vnode, this.element);
	},

	/*
	 * @Overriden public triggerEditEndEvent
	 * @param {object} newValue 에디팅 완료로 적용 시킬 새로운 값
	 * @param {string} which 에디팅 완료를 발생 시킨 행위에 대한 정의
	 *
	 * 에디팅 완료(cellEditEnd) 이벤트를 발생 시키고 실제로 에디팅 종료시킵니다.
	 */
	triggerEditEndEvent: function (newValue, which) {
		this.$super.triggerEditEndEvent(newValue, which);
	},

	/*
	 * @Overriden public triggerEditCancelEvent
	 * @param {string} which 에디팅 취소를 발생 시킨 행위에 대한 정의
	 *
	 * 에디팅 취소(cellEditCancel) 이벤트를 발생 시키고 에디팅 취소시킵니다.
	 */
	triggerEditCancelEvent: function (which) {
		this.$super.triggerEditCancelEvent(which);
	},

	/*
	 * @Overriden public injectValue
	 * @param {obejct} value 새로운 값
	 *
	 * 외부에 의해 에디팅이 완료될 경우를 위해 값을 주입 시켜 놓습니다.
	 * 에디트렌더러의 정상적인 종료가 아닌 외부 특정 요인에 의해 수정 완료 처리될 때 여기서 주입시켜 놓은 값이 적용됩니다.
	 */
	injectValue: function (value) {
		this.$super.injectValue(value);
	},

	/****************************************************************
	 *
	 * Private Methods
	 *
	 * Rule : Private Methods 는 반드시 __ 로 시작하십시오
	 * 즉, 사용자가 추가하는 속성, 메소드는 __ 로 시작하십시오.
	 *
	 ****************************************************************/

	__updateVueDate: function (value) {
		let date;
		// 타임 픽커인 경우
		if (this.__isTimePicker) {
			const oldDate = this.data[this.dataField];
			date = new Date(oldDate);
			date.setHours(value.hours);
			date.setMinutes(value.minutes);
		} else {
			date = new Date(value);
		}
		// 포매팅 맞추기
		const newVal = agUtils.formatDate(date, this.columnData.dateInputFormat);
		// 확인
		console.log('확인', newVal);
		this.triggerEditEndEvent(newVal);
	}
}).extend(window.AUIGrid.EditRendererBase);
