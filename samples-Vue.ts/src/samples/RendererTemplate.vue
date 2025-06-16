<script setup lang="ts">
	import { ref, onMounted, onBeforeUnmount } from 'vue';
	import * as IGrid from 'aui-grid';
	import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
	import { gridData, selectList, checkboxGroup } from './data/RendererTemplateData';
	import { registerAUIGridTemplateHandler, unregisterAUIGridTemplateHandler } from './useAUIGridTemplateHandler';
	import './RendererTemplate.css';

	// 그리드 InstanceType
	type AUIGrid = InstanceType<typeof AUIGrid>;

	// 그리드 객체
	const myGrid = ref<AUIGrid | null>(null);

	// 그리드 칼럼 레이아웃 정의
	const columnLayout: IGrid.Column[] = [
		{
			dataField: 'name',
			headerText: 'Template-ButtonGroup',
			width: 260,
			renderer: {
				// HTML 템플릿 렌더러 사용
				type: IGrid.RendererKind.TemplateRenderer
			},
			labelFunction: (rowIndex, columnIndex, value, headerText, item) => {
				// HTML 템플릿 작성
				return `
					<div class="my_div">
						<span class="my_div_text_box">${value}</span>
						<span class="my_div_btn" onclick="myApplyBtnClick(${rowIndex}, event)">적용</span>
						<span class="my_div_btn2" onclick="myPopupBtnClick(${rowIndex}, event)">팝업</span>
					</div>
				`.trim();
			}
		},
		{
			dataField: 'code',
			headerText: 'Template-Select',
			width: 280,
			editable: false, // 그리드의 에디팅 사용 안함( 템플릿에서 만든 Select 로 에디팅 처리 하기 위함 )
			renderer: {
				// HTML 템플릿 렌더러 사용
				type: IGrid.RendererKind.TemplateRenderer
			},
			labelFunction: (rowIndex, columnIndex, value, headerText, item) => {
				// HTML 템플릿 작성
				if (!value) return '';
				if (value === 'None') {
					return `
						<div class="my_div">
							<span style="line-height:2em;">
							선택할 수 없도록 작성됨(즉, 동적 select 표현)
							</span>
						</div>
					`.trim();
				}

				// option 만들기
				const options = selectList
					.map(({ value: code, text }) => {
						const selected = code === value ? ' selected="selected"' : '';
						return `<option value="${code}"${selected}>${text}</option>`;
					})
					.join('');

				return `
					<div class="my_div">
						<span class="my_div_code_span">코드명 : ${value}</span>
						<select class="my_select" onchange="mySelectChangeHandler(${rowIndex}, this.value, event);">
							${options}
						</select>
					</div>
				`.trim();
			}
		},
		{
			dataField: 'check',
			headerText: 'Template-CheckGroup',
			width: 180,
			editable: false, // 그리드의 에디팅 사용 안함( 템플릿에서 만든 Select 로 에디팅 처리 하기 위함 )
			renderer: {
				// HTML 템플릿 렌더러 사용
				type: IGrid.RendererKind.TemplateRenderer
			},
			labelFunction: (rowIndex, columnIndex, value, headerText, item) => {
				const selectedValues = value.split(',');

				// 체크박스 개수에 맞게 만들기
				const checkboxes = checkboxGroup
					.map(({ value, label }) => {
						const isChecked = selectedValues.includes(value) ? 'checked="checked"' : '';
						return `<label><input type="checkbox" value="${value}" ${isChecked} onclick="myCheckClick(${rowIndex}, event);">${label}</label>`;
					})
					.join('');

				return `
					<div class="my_div">
						<span class="my_div_chk_span">
							${checkboxes}
						</span>
					</div>
				`.trim();
			}
		}
	];

	// 그리드 속성 정의
	const gridProps: IGrid.Props = {
		width: '100%',
		height: 480,
		// 행 높이 설정
		rowHeight: 34,
		editable: true,
		showStateColumn: true,
		selectionMode: 'multipleCells'
	};

	onMounted(() => {
		console.log('RendererTemplate 마운트됨');
		const grid = myGrid.value as AUIGrid;
		grid.setGridData(gridData);

		// TemplateRenderer 에서 사용하는 함수들 등록 하기
		registerAUIGridTemplateHandler('myApplyBtnClick', myApplyBtnClick);
		registerAUIGridTemplateHandler('myPopupBtnClick', myPopupBtnClick);
		registerAUIGridTemplateHandler('mySelectChangeHandler', mySelectChangeHandler);
		registerAUIGridTemplateHandler('myCheckClick', myCheckClick);
	});

	onBeforeUnmount(() => {
		// TemplateRenderer 에서 사용하는 함수들 등록 해제 하기
		unregisterAUIGridTemplateHandler('myApplyBtnClick');
		unregisterAUIGridTemplateHandler('myPopupBtnClick');
		unregisterAUIGridTemplateHandler('mySelectChangeHandler');
		unregisterAUIGridTemplateHandler('myCheckClick');
	});

	// 그리드 템플릿 렌더러 적용 버튼 클릭
	function myApplyBtnClick(rowIndex: number, event: Event) {
		const grid = myGrid.value as AUIGrid;
		grid.updateRow(
			{
				name: '셀 값 예약어로 수정'
			},
			rowIndex
		);
		alert(`eventType : ${event.type}, rowIndex : ${rowIndex} 적용 버턴 클릭`);
	}

	// 그리드 템플릿 렌더러 팝업 버튼 클릭
	function myPopupBtnClick(rowIndex: number, event: Event) {
		alert('rowIndex : ' + rowIndex + ' 팝업 버턴 클릭');
	}

	// 그리드 템플릿 렌더러 select 변경
	function mySelectChangeHandler(rowIndex: number, selectedValue: any, event: Event) {
		alert(selectedValue);
		const grid = myGrid.value as AUIGrid;
		// 그리드에 실제 업데이트 적용 시킴
		grid.updateRow(
			{
				code: selectedValue
			},
			rowIndex
		);
	}

	// 그리드 템플릿 렌더러 체크박스 클릭
	function myCheckClick(rowIndex: number, event: Event) {
		const target = event.target as HTMLInputElement;
		const grid = myGrid.value as AUIGrid;
		alert('rowIndex : ' + rowIndex + ', value : ' + target.value + ', checked : ' + target.checked);

		// 해당 행의 아이템 얻기
		const item = grid.getItemByRowIndex(rowIndex);
		const checkValue = item.check;
		const checkArr = checkValue.split(',');

		// 체크된 경우 포함시킴
		if (target.checked) {
			checkArr.push(target.value);
		} else {
			// 해제된 경우 제거함.
			checkArr.splice(checkArr.indexOf(target.value), 1);
		}

		// 그리드 값 수정함.
		grid.updateRow(
			{
				check: checkArr.join(',')
			},
			rowIndex
		);
	}
</script>

<template>
	<div>
		<div class="desc">
			<p>데이터 값이 HTML 인 경우 그대로 출력하며, 사용자가 임의로 labelFunction 에서 HTML 스트링을 작성할 수 있습니다.(innerHTML 처리)</p>
			<strong>템플릿 렌더러에서 수정 가능한 태그를 어떻게 작성하는지를 보여주는 데모입니다.</strong>
			<p>템플릿 렌더러로 작성된 데이터 수정도 Undo(Ctrl+Z), Redo(Ctrl+Y) 를 지원합니다.</p>
			<p>HTML 템플릿은 행 높이를 벗어날 수 없습니다. 예를 들어 br 태그로 개행을 한다해도 지정된 행 높이를 벗어 날 수 없습니다.(그리드의 rowHeight 속성으로 높이를 크게 하십시오.)</p>
			<p>■ 단점 : 사용자가 HTML 템플릿을 작성하였기 때문에 엑셀 저장, 그룹핑, 필터링, 정렬 등에 제약을 받습니다. (dataField 값 기준으로 처리됩니다.)</p>
		</div>
		<div>
			<AUIGrid ref="myGrid" :gridProps="gridProps" :columnLayout="columnLayout"></AUIGrid>
		</div>
	</div>
</template>
