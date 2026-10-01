import { useEffect, useMemo, useRef } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
import AUIGridReactDatepicker from '../editRenderers/AUIGrid.ReactDatepicker';
import AUIGridCounterEditor from '../editRenderers/AUIGrid.CounterEditor';
import iconDate from '../assets/calendar-icon.png';
import './CustomEditRendererDatePicker.css';

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

const gridProps = {
	width: '100%',
	height: 480,
	editable: true
};

const CustomEditRendererDatePicker = () => {
	const myGrid = useRef();

	const columnLayout = useMemo(
		() => [
			{
				dataField: 'field0',
				headerText: 'ReactDatepicker 달력',
				dataType: 'date',
				dateInputFormat: 'yyyy/mm/dd',
				formatString: 'yyyy년 mm월 dd일',
				width: 240,
				renderer: {
					type: 'IconRenderer',
					iconWidth: 16,
					iconHeight: 16,
					iconPosition: 'aisleRight',
					iconTableRef: { default: iconDate },
					onClick: () => myGrid.current.openInputer()
				},
				editRenderer: {
					type: 'CustomEditRenderer',
					jsClass: AUIGridReactDatepicker,
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
				dateInputFormat: 'yyyy/mm/dd',
				formatString: 'yyyy. mm. dd.',
				width: 240,
				editRenderer: {
					type: 'CustomEditRenderer',
					jsClass: AUIGridReactDatepicker,
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
				dateInputFormat: 'yyyy/mm/dd HH:MM',
				formatString: 'HH:MM',
				width: 240,
				editRenderer: {
					type: 'CustomEditRenderer',
					jsClass: AUIGridReactDatepicker,
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
		],
		[]
	);

	useEffect(() => {
		const grid = myGrid.current;

		grid.bind(['cellEditBegin', 'cellEditEnd', 'cellEditCancel'], (event) => {
			console.log(event);
		});

		grid.setGridData(gridData);
	}, []);

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
