import { useEffect, useRef } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import { gridData, selectList, checkboxGroup } from './data/RendererTemplateData';
import { registerAUIGridTemplateHandler, unregisterAUIGridTemplateHandler } from './useAUIGridTemplateHandler';
import './RendererTemplate.css';

const columnLayout: IGrid.Column[] = [
	{
		dataField: 'name',
		headerText: 'Template-ButtonGroup',
		width: 260,
		renderer: { type: IGrid.RendererKind.TemplateRenderer },
		labelFunction: (rowIndex, _columnIndex, value) =>
			`<div class="my_div">
				<span class="my_div_text_box">${value}</span>
				<span class="my_div_btn" onclick="myApplyBtnClick(${rowIndex}, event)">적용</span>
				<span class="my_div_btn2" onclick="myPopupBtnClick(${rowIndex}, event)">팝업</span>
			</div>`.trim()
	},
	{
		dataField: 'code',
		headerText: 'Template-Select',
		width: 280,
		editable: false,
		renderer: { type: IGrid.RendererKind.TemplateRenderer },
		labelFunction: (rowIndex, _columnIndex, value) => {
			if (!value) return '';
			if (value === 'None') {
				return `<div class="my_div"><span style="line-height:2em;">선택할 수 없도록 작성됨(즉, 동적 select 표현)</span></div>`.trim();
			}
			const options = selectList
				.map(({ value: code, text }) => `<option value="${code}"${code === value ? ' selected="selected"' : ''}>${text}</option>`)
				.join('');
			return `<div class="my_div">
				<span class="my_div_code_span">코드명 : ${value}</span>
				<select class="my_select" onchange="mySelectChangeHandler(${rowIndex}, this.value, event);">${options}</select>
			</div>`.trim();
		}
	},
	{
		dataField: 'check',
		headerText: 'Template-CheckGroup',
		width: 180,
		editable: false,
		renderer: { type: IGrid.RendererKind.TemplateRenderer },
		labelFunction: (rowIndex, _columnIndex, value) => {
			const selectedValues = value.split(',');
			const checkboxes = checkboxGroup
				.map(({ value: v, label }) => `<label><input type="checkbox" value="${v}" ${selectedValues.includes(v) ? 'checked="checked"' : ''} onclick="myCheckClick(${rowIndex}, event);">${label}</label>`)
				.join('');
			return `<div class="my_div"><span class="my_div_chk_span">${checkboxes}</span></div>`.trim();
		}
	}
];

const gridProps: IGrid.Props = {
	width: '100%',
	height: 480,
	rowHeight: 34,
	editable: true,
	showStateColumn: true,
	selectionMode: 'multipleCells'
};

const RendererTemplate = () => {
	const myGrid = useRef<AUIGrid>(null);

	useEffect(() => {
		const grid = myGrid.current as AUIGrid;
		grid.setGridData(gridData);

		const myApplyBtnClick = (rowIndex: number, event: Event) => {
			grid.updateRow({ name: '셀 값 예약어로 수정' }, rowIndex);
			alert(`eventType : ${event.type}, rowIndex : ${rowIndex} 적용 버턴 클릭`);
		};

		const myPopupBtnClick = (rowIndex: number) => {
			alert('rowIndex : ' + rowIndex + ' 팝업 버턴 클릭');
		};

		const mySelectChangeHandler = (rowIndex: number, selectedValue: any) => {
			alert(selectedValue);
			grid.updateRow({ code: selectedValue }, rowIndex);
		};

		const myCheckClick = (rowIndex: number, event: Event) => {
			const target = event.target as HTMLInputElement;
			alert('rowIndex : ' + rowIndex + ', value : ' + target.value + ', checked : ' + target.checked);

			const item = grid.getItemByRowIndex(rowIndex);
			const checkArr = item.check.split(',');
			if (target.checked) {
				checkArr.push(target.value);
			} else {
				checkArr.splice(checkArr.indexOf(target.value), 1);
			}
			grid.updateRow({ check: checkArr.join(',') }, rowIndex);
		};

		registerAUIGridTemplateHandler('myApplyBtnClick', myApplyBtnClick);
		registerAUIGridTemplateHandler('myPopupBtnClick', myPopupBtnClick);
		registerAUIGridTemplateHandler('mySelectChangeHandler', mySelectChangeHandler);
		registerAUIGridTemplateHandler('myCheckClick', myCheckClick);

		return () => {
			unregisterAUIGridTemplateHandler('myApplyBtnClick');
			unregisterAUIGridTemplateHandler('myPopupBtnClick');
			unregisterAUIGridTemplateHandler('mySelectChangeHandler');
			unregisterAUIGridTemplateHandler('myCheckClick');
		};
	}, []);

	return (
		<div>
			<div className="desc">
				<p>데이터 값이 HTML 인 경우 그대로 출력하며, 사용자가 임의로 labelFunction 에서 HTML 스트링을 작성할 수 있습니다.(innerHTML 처리)</p>
				<strong>템플릿 렌더러에서 수정 가능한 태그를 어떻게 작성하는지를 보여주는 데모입니다.</strong>
				<p>템플릿 렌더러로 작성된 데이터 수정도 Undo(Ctrl+Z), Redo(Ctrl+Y) 를 지원합니다.</p>
				<p>HTML 템플릿은 행 높이를 벗어날 수 없습니다. 예를 들어 br 태그로 개행을 한다해도 지정된 행 높이를 벗어 날 수 없습니다.(그리드의 rowHeight 속성으로 높이를 크게 하십시오.)</p>
				<p>■ 단점 : 사용자가 HTML 템플릿을 작성하였기 때문에 엑셀 저장, 그룹핑, 필터링, 정렬 등에 제약을 받습니다. (dataField 값 기준으로 처리됩니다.)</p>
			</div>
			<AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default RendererTemplate;
