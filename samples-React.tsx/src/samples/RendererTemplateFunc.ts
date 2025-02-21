/**
 * RendererTemplate.ts 에서 사용할 전역 함수 선언.
 * 템플릿 렌더러는 단순히 스트링으로 작성된 html 을 innerHTML 처리함.
 * 따라서 해당 템플릿의 엘리먼트에 onclick 과 같은 이벤트를 작성한 경우
 * Vue.js 나 React.js 등의 라이프 사이클 및 해당 클래스 인스턴스와 무관하게 오로지 window 전역 함수만을 호출하게 됨.
 * 오로지 window 전역 함수만을 호출하기 때문에 window 전역에서 따로 관리해야 함.
 */
export {};

const $ag: any = window.AUIGrid;

declare global {
	interface Window {
		$agRendererTemplate: any;
	}
}

window.$agRendererTemplate = {
	// 적용 버턴 클릭 핸들러
	myApplyBtnClick: (rowIndex: number, event: React.MouseEvent<HTMLElement>): void => {
		const myGridID = '#aui-grid-wrap-RendererTemplate';
		// 그리드에 실제 업데이트 적용 시킴
		$ag.updateRow(
			myGridID,
			{
				name: '셀 값 예약어로 수정'
			},
			rowIndex
		);
		alert(`eventType : ${event.type}, rowIndex : ${rowIndex} 적용 버턴 클릭`);
	},

	//팝업 버턴 클릭 핸들러
	myPopupBtnClick: (rowIndex: number, event: React.MouseEvent<HTMLElement>): void => {
		alert(`eventType : ${event.type}, rowIndex :  ${rowIndex}  팝업 버턴 클릭`);
	},

	// 셀렉트 변경 핸들러
	mySelectChangeHandler: (rowIndex: number, selectedValue: string, event: React.ChangeEvent<HTMLSelectElement>) => {
		const myGridID = '#aui-grid-wrap-RendererTemplate';
		// 그리드에 실제 업데이트 적용 시킴
		$ag.updateRow(
			myGridID,
			{
				code: selectedValue
			},
			rowIndex
		);
		alert(selectedValue);
	},

	// 체크박스 그룹 클릭 핸들러
	myCheckClick: (rowIndex: number, event: React.MouseEvent<HTMLElement>): void => {
		const myGridID: string = '#aui-grid-wrap-RendererTemplate';
		const target = event.target as HTMLInputElement;

		alert(`eventType : ${event.type}, rowIndex : ${rowIndex} , value : ${target.value} , checked : ${target.checked}`);

		// 해당 행의 아이템 얻기
		const item: any = $ag.getItemByRowIndex(myGridID, rowIndex);
		const checkValue: string = item.check;
		const checkArr: string[] = checkValue === '' ? [] : checkValue.split(',');

		// 체크된 경우 포함시킴
		if (target.checked) {
			checkArr.push(target.value);
		} else {
			// 해제된 경우 제거함.
			checkArr.splice(checkArr.indexOf(target.value), 1);
		}

		// 그리드 값 수정함.
		$ag.updateRow(
			myGridID,
			{
				check: checkArr.length <= 0 ? '' : checkArr.join(',')
			},
			rowIndex
		);
	}
};
