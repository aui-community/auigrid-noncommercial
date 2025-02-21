import React, { useEffect, useRef } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
import AUIGridReactDatepicker from '../editRenderers/AUIGrid.ReactDatepicker';
import AUIGridCounterEditor from '../editRenderers/AUIGrid.CounterEditor';
import iconDate from '../assets/calendar-icon.png';
import './CustomEditRendererDatePicker.css';

const CustomEditRendererDatePicker = () => {
	// 그리드 객체
	const myGrid = useRef();

	// 그리드 칼럼 레이아웃 정의
	const columnLayout = [
		{
			dataField: 'field0',
			headerText: 'ReactDatepicker 달력',
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
					default: iconDate // default
				},
				onClick: () => {
					const grid = myGrid.current;
					grid.openInputer();
				}
			},
			editRenderer: {
				type: 'CustomEditRenderer',
				jsClass: AUIGridReactDatepicker,
				// 여기서 ReactDatepicker 속성 정의
				extraProps: {
					locale: 'ko',
					dateFormatCalendar: 'yyyy년 MM월',
					todayButton: '오늘'
				}
			}
		},
		{
			dataField: 'field1',
			headerText: 'ReactDatepicker 2달력',
			dataType: 'date',
			dateInputFormat: 'yyyy/mm/dd', // 실제 데이터의 형식 지정
			formatString: 'yyyy. mm. dd.', // 실제 데이터 형식을 어떻게 표시할지 지정
			width: 240,
			editRenderer: {
				type: 'CustomEditRenderer',
				jsClass: AUIGridReactDatepicker,
				// 여기서 ReactDatepicker 속성 정의
				extraProps: {
					locale: 'ko',
					dateFormatCalendar: 'yyyy년 MM월',
					todayButton: '오늘',
					monthsShown: 2
				}
			}
		},
		{
			dataField: 'field2',
			headerText: 'ReactDatepicker 시간',
			dataType: 'date',
			dateInputFormat: 'yyyy/mm/dd HH:MM', // 실제 데이터의 형식 지정
			formatString: 'HH:MM', // 실제 데이터 형식을 어떻게 표시할지 지정
			width: 240,
			editRenderer: {
				type: 'CustomEditRenderer',
				jsClass: AUIGridReactDatepicker,
				// 여기서 ReactDatepicker 속성 정의
				extraProps: {
					locale: 'ko',
					showTimeSelect: true,
					showTimeSelectOnly: true
				}
			}
		},
		{
			dataField: 'count',
			headerText: '번외: Count 사용자 에디터',
			width: 200,
			editRenderer: {
				type: 'CustomEditRenderer',
				jsClass: AUIGridCounterEditor
			}
		}
	];

	// 그리드 속성 정의
	const gridProps = {
		width: '100%',
		height: 480,
		// 편집 가능 여부 (기본값 : false)
		editable: true
	};

	useEffect(() => {
		console.log('CustomEditRendererDatePicker 마운트됨');

		// 최초 마운팅 될 때 그리드 이벤트 세팅
		setupGridEvents();

		// 최초 마운팅 될 때 그리드 데이터 조회시키기
		requestGridData();

		return () => {
			console.log('CustomEditRendererDatePicker 언마운트됨');
		};
	}, []);

	// 그리드 이벤트 세팅
	const setupGridEvents = () => {
		const grid = myGrid.current;
		// 그리드 이벤트 바인딩
		grid.bind(['cellEditBegin', 'cellEditEnd', 'cellEditCancel'], (event) => {
			console.log(event);
		});
	};

	// 그리드 데이터 조회하여 삽입
	const requestGridData = () => {
		const grid = myGrid.current;
		// 그리드 데이터
		const gridData = [
			{ field0: '2019/12/22', field1: '2019/12/22', field2: '2019/12/22 11:30', count: 1 },
			{ field0: '2019/12/12', field1: '2019/12/12', field2: '2019/12/12 11:30', count: 1 },
			{ field0: '2019/12/02', field1: '2019/12/02', field2: '2019/12/02 11:30', count: 2 },
			{ field0: '2019/11/22', field1: '2019/11/22', field2: '2019/11/22 11:30', count: 2 },
			{ field0: '2019/11/12', field1: '2019/11/12', field2: '2019/11/12 11:30', count: 3 },
			{ field0: '2019/11/02', field1: '2019/11/02', field2: '2019/11/02 11:30', count: 3 },
			{ field0: '2019/10/23', field1: '2019/10/23', field2: '2019/10/23 11:30', count: 3 },
			{ field0: '2019/10/13', field1: '2019/10/13', field2: '2019/10/13 11:30', count: 4 },
			{ field0: '2019/10/03', field1: '2019/10/03', field2: '2019/10/03 11:30', count: 3 }
		];
		grid.setGridData(gridData);
	};

	return (
		<div>
			<div className="desc">
				<p>React Datepicker 커스텀 에디트 렌더러 작성한 예제입니다.</p>
				<p>React Datepicker is licensed under the MIT License.</p>
				<a href="https://reactdatepicker.com/" target="_blank" rel="noreferrer" className="link-is-link">
					https://reactdatepicker.com/
				</a>
			</div>
			<AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default CustomEditRendererDatePicker;
