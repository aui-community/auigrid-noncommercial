import { useCallback, useEffect, useMemo, useRef } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
import axios from 'axios';
import data from './data/EditDropDownData';

const PUBLIC_URL = process.env.PUBLIC_URL;

const gridProps = {
	width: '100%',
	height: 480,
	editable: true
};

const EditDropDown = () => {
	const myGrid = useRef();

	const posListRef = useRef([]);
	const myListRef = useRef([]);
	const colorListRef = useRef([]);
	const keyValueListRef = useRef([]);
	const groupListRef = useRef([]);
	const groupAListRef = useRef([]);
	const groupBListRef = useRef([]);
	const groupCListRef = useRef([]);

	const columnLayout = useMemo(
		() => [
			{
				dataField: 'position',
				headerText: '직급',
				width: 140,
				renderer: {
					type: 'IconRenderer',
					iconWidth: 16,
					iconHeight: 16,
					iconPosition: 'aisleRight',
					iconTableRef: { default: PUBLIC_URL + '/assets/arrow-down-black-icon.png' },
					onClick: () => myGrid.current.openInputer()
				},
				editRenderer: {
					type: 'DropDownListRenderer',
					showEditorBtn: false,
					showEditorBtnOver: false,
					listFunction: () => posListRef.current
				}
			},
			{
				dataField: 'id',
				headerText: '이름',
				headerTooltip: { show: true, tooltipHtml: '출력 리스트를 사용자 정의 하여 복잡한 구조로 작성. key-value 모드' },
				width: 140,
				labelFunction: (rowIndex, columnIndex, value) => {
					const found = myListRef.current.find((item) => item.id === value);
					return found ? found.name : value;
				},
				editRenderer: {
					type: 'DropDownListRenderer',
					showEditorBtnOver: true,
					keyField: 'id',
					valueField: 'name',
					listFunction: () => myListRef.current,
					listTemplateFunction: (rowIndex, columnIndex, text, item, dataField, listItem) => {
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
					listFunction: () => colorListRef.current
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
					listFunction: (rowIndex, columnIndex, item) => {
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
				labelFunction: (rowIndex, columnIndex, value) => {
					const found = keyValueListRef.current.find((item) => item.code === value);
					return found ? found.value : value;
				},
				editRenderer: {
					type: 'DropDownListRenderer',
					keyField: 'code',
					valueField: 'value',
					listFunction: () => keyValueListRef.current
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
					listFunction: () => groupListRef.current
				}
			},
			{
				dataField: 'leaf',
				headerText: '그룹 하위',
				width: 140,
				editRenderer: {
					type: 'DropDownListRenderer',
					listFunction: (rowIndex, columnIndex, item) => {
						if (item.group === 'A') return groupAListRef.current;
						if (item.group === 'B') return groupBListRef.current;
						return groupCListRef.current;
					}
				}
			}
		],
		[]
	);

	useEffect(() => {
		async function fetchListData() {
			const response = await axios.get('./data/drop_list_data.json');
			posListRef.current = response.data.posList;
			myListRef.current = response.data.myList;
			colorListRef.current = response.data.colorList;
			keyValueListRef.current = response.data.keyValueList;
			groupListRef.current = response.data.groupList;
			groupAListRef.current = response.data.groupAList;
			groupBListRef.current = response.data.groupBList;
			groupCListRef.current = response.data.groupCList;

			myGrid.current.setGridData(data);
		}

		fetchListData();
	}, []);

	const getGridData = useCallback(() => {
		console.log(myGrid.current.getGridData());
	}, []);

	return (
		<div>
			<div className="desc">
				<p>리액트에서 상태 관리는 보통 useState 로 하지만, useState 상태는 리액트 라이프사이클에 의해 재렌더링을 하기 때문에 useRef 로 상태 값 관리만 합니다.</p>
				<p>즉, 상태값에 따라 DOM 의 변화가 생겨야 하는 경우는 useState, 그렇지 않은 경우 useRef.</p>
				<p>그리고 useState 로 값 변경 시 함수형 컴포넌트는 해당 함수를 다시 호출함으로써 모든 선언문들이 재정의됩니다. 이것은 메모리 어딘가에 또 다시 선언되어 보관된다는 뜻임.</p>
				<p>최초의 columnLayout 이 그리드의 진짜 칼럼레이아웃이며 이후 useState 나 기타 Hook 에 의해 다시 선언된 columnLayout 들은 그리드와 무관한 메모리 어딘가에 선언만 된 상태임.(이들의 참조값은 엄연히 다름)</p>
				<button className="btn" onClick={getGridData}>
					그리드 데이터 콘솔에 출력
				</button>
			</div>
			<AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default EditDropDown;
