import React, { useEffect, useRef } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import axios from 'axios';
import data from './data/EditDropDownData';

const PUBLIC_URL = process.env.PUBLIC_URL;

const EditDropDown = () => {
	// 그리드 객체
	const myGrid = useRef<AUIGrid>(null);

	// 드랍다운리스트의 리스트들
	const posListRef = useRef<any>([]);
	const myListRef = useRef<any>([]);
	const colorListRef = useRef<any>([]);
	const keyValueListRef = useRef<any>([]);
	const groupListRef = useRef<any>([]);
	const groupAListRef = useRef<any>([]);
	const groupBListRef = useRef<any>([]);
	const groupCListRef = useRef<any>([]);

	// 그리드 칼럼 레이아웃 정의
	const columnLayout: IGrid.Column[] = [
		{
			dataField: 'position',
			headerText: '직급',
			width: 140,
			renderer: {
				type: IGrid.RendererKind.IconRenderer,
				iconWidth: 16, // icon 사이즈, 지정하지 않으면 rowHeight에 맞게 기본값 적용됨
				iconHeight: 16,
				iconPosition: 'aisleRight',
				iconTableRef: {
					// icon 값 참조할 테이블 레퍼런스
					default: PUBLIC_URL + '/assets/arrow-down-black-icon.png' // default
				},
				onClick: () => {
					// 수정으로 진입함.
					myGrid.current?.openInputer();
				}
			},
			editRenderer: {
				type: IGrid.EditRendererKind.DropDownListRenderer,
				showEditorBtn: false,
				showEditorBtnOver: false, // 마우스 오버 시 에디터버턴 보이기
				listFunction: () => {
					return posListRef.current;
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
				const myList = myListRef.current;
				for (let i = 0, len = myList.length; i < len; i++) {
					if (myList[i]['id'] === value) {
						retStr = myList[i]['name'];
						break;
					}
				}
				return retStr === '' ? value : retStr;
			},
			editRenderer: {
				type: IGrid.EditRendererKind.DropDownListRenderer,
				showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
				keyField: 'id',
				valueField: 'name',
				listFunction: () => {
					return myListRef.current;
				},
				// 드랍 리스트의 개별 아이템에 대하여 출력할 양식을 HTML 로 작성하여 반환하면 리스트로 출력됩니다.
				listTemplateFunction: (rowIndex: number, columnIndex: number, text: string, item: any, dataField: string, listItem: any) => {
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
				type: IGrid.EditRendererKind.DropDownListRenderer,
				showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
				easyMode: false,
				listFunction: () => {
					return colorListRef.current;
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
				type: IGrid.EditRendererKind.DropDownListRenderer,
				showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
				// 같은 행의 color 값을 보고 출력시킬 list 를 결정함.
				listFunction: (rowIndex: number, columnIndex: number, item: any) => {
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
				const keyValueList = keyValueListRef.current;
				for (let i = 0, len = keyValueList.length; i < len; i++) {
					if (keyValueList[i]['code'] === value) {
						retStr = keyValueList[i]['value'];
						break;
					}
				}
				return retStr;
			},
			editRenderer: {
				type: IGrid.EditRendererKind.DropDownListRenderer,
				keyField: 'code', // key 에 해당되는 필드명
				valueField: 'value', // value 에 해당되는 필드명
				listFunction: () => {
					return keyValueListRef.current; //key-value Object 로 구성된 리스트
				}
			}
		},
		{
			dataField: 'group',
			headerText: '그룹',
			width: 140,
			editRenderer: {
				type: IGrid.EditRendererKind.DropDownListRenderer,
				descendants: ['leaf'], // 자손 필드들
				descendantDefaultValues: ['-'], // 변경 시 자손들에게 기본값 지정
				listFunction: () => {
					return groupListRef.current;
				}
			}
		},
		{
			dataField: 'leaf',
			headerText: '그룹 하위',
			width: 140,
			editRenderer: {
				type: IGrid.EditRendererKind.DropDownListRenderer,
				listFunction: (rowIndex: number, columnIndex: number, item: any) => {
					if (item.group === 'A') {
						// 그룹 필드에서 선택된 값 비교
						return groupAListRef.current;
					} else if (item.group === 'B') {
						return groupBListRef.current;
					} else {
						return groupCListRef.current;
					}
				}
			}
		}
	];

	// 그리드 속성 정의
	const gridProps: IGrid.Props = {
		width: '100%',
		height: 480,
		editable: true
	};

	useEffect(() => {
		async function fetchListData() {
			// 드랍다운리스트에서 사용할 list 들 async로 얻기
			const response = await axios.get('./data/drop_list_data.json');
			console.log(response);

			// 드랍다운 리스트들 값 할당.
			posListRef.current = response.data.posList;
			myListRef.current = response.data.myList;
			colorListRef.current = response.data.colorList;
			keyValueListRef.current = response.data.keyValueList;
			groupListRef.current = response.data.groupList;
			groupAListRef.current = response.data.groupAList;
			groupBListRef.current = response.data.groupBList;
			groupCListRef.current = response.data.groupCList;

			// 최초 마운팅 될 때 그리드 데이터 조회시키기
			requestGridData();
		}

		// 드랍다운리스트의 리스트들 요청
		fetchListData();

		console.log('EditDropDown 마운트됨');

		return () => {
			console.log('EditDropDown 언마운트됨');
		};
	}, []);

	// 그리드 데이터 삽입
	const requestGridData = () => {
		const grid = myGrid.current as AUIGrid;
		grid?.setGridData(data);
	};

	// 그리드 데이터 확인
	const getGridData = () => {
		const grid = myGrid.current as AUIGrid;
		console.log(grid.getGridData());
	};

	return (
		<div>
			<div className="desc">
				<p>리액트에서 상태 관리는 보통 useState 로 하지만, useState 상태는 리액트 라이프사이클에 의해 재렌더링을 하기 때문에 useRef 로 상태 값 관리만 합니다.</p>
				<p>즉, 상태값에 따라 DOM 의 변화가 생겨야 하는 경우는 useState, 그렇지 않은 경우 useRef.</p>
				<p>그리고 useState 로 값 변경 시 함수형 컴포넌트는 해당 함수를 다시 호출함으로써 모든 선언문들이 재정의됩니다. 이것은 메모리 어딘가에 또 다시 선언되어 보관된다는 뜻임.</p>
				<p>최초의 columnLayout 이 그리드의 진짜 칼럼레이아웃이며 이후 useState 나 기타 Hook 에 의해 다시 선언된 columnLayout 들은 그리드와 무관한 메모리 어딘가에 선언만 된 상태임.(이들의 참조값은 엄연히 다름)</p>
				<button onClick={getGridData}>그리드 데이터 콘솔에 출력</button>
			</div>
			<AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default EditDropDown;
