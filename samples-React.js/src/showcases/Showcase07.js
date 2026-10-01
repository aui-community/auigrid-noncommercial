import { useEffect, useRef, useState } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
import MyCalendarRenderer from '../renderers/MyCalendarRenderer';
import './Showcase07.css';

// 표시 월의 주별 데이터를 생성합니다. 앞쪽 빈 셀과 마지막 주의 길이를 유지합니다.
function genGridData(inputDate) {
	const year = inputDate.getFullYear();
	const month = inputDate.getMonth();
	const startWeekday = new Date(year, month, 1).getDay();
	const totalDays = new Date(year, month + 1, 0).getDate();
	const weeks = [];
	let week = [];
	for (let i = 0; i < startWeekday; i++) week.push(null);
	for (let day = 1; day <= totalDays; day++) {
		week.push({ date: day, value: Math.floor(Math.random() * 100) });
		if (week.length === 7) {
			weeks.push(week);
			week = [];
		}
	}
	if (week.length > 0) weeks.push(week);
	return weeks;
}

const calendarRenderer = {
	type: 'CustomRenderer',
	jsClass: MyCalendarRenderer
};

const columnLayout = [
	{ dataField: '0', headerText: '일', style: 'my-sunday-style', headerStyle: 'my-sunday-style', renderer: calendarRenderer },
	{ dataField: '1', headerText: '월', renderer: calendarRenderer },
	{ dataField: '2', headerText: '화', renderer: calendarRenderer },
	{ dataField: '3', headerText: '수', renderer: calendarRenderer },
	{ dataField: '4', headerText: '목', renderer: calendarRenderer },
	{ dataField: '5', headerText: '금', renderer: calendarRenderer },
	{ dataField: '6', headerText: '토', style: 'my-saturday-style', headerStyle: 'my-saturday-style', renderer: calendarRenderer }
];

const gridProps = {
	width: '100%',
	height: 480,
	selectionMode: 'none',
	enableSorting: false,
	showRowNumColumn: false,
	enableColumnResize: false,
	rowHeight: 80
};

// 생성한 달력 데이터를 그리드에 반영합니다.
function loadGridData(grid, date) {
	grid.setGridData(genGridData(date));
}

const Showcase07 = () => {
	const myGrid = useRef();
	const [originDate, setOriginDate] = useState(new Date());

	useEffect(() => {
		loadGridData(myGrid.current, originDate);
	}, [originDate]);

	// React 상태 변경을 effect가 감지하여 그리드 데이터에 반영합니다.
	const changeData = (direction) => {
		setOriginDate((previous) => {
			const date = new Date(previous);
			date.setMonth(date.getMonth() + direction);
			return date;
		});
	};

	return (
		<div>
			<div className="desc">
				<p>달력에 개별 날짜마다 목표치 달성률을 표시한 데모입니다.</p>
				<p>그리드에 출력되는 셀은 사용자 정의 렌더러(CustomRenderer)를 사용하였습니다.</p>
				<p>이와 같이 사용자가 원하는 셀 형식을 자바스크립트로 작성할 수 있습니다.</p>
				<div className="force-text-center">
					<button className="btn" onClick={() => changeData(-1)}>
						이전 달
					</button>
					<span style={{ margin: '2px 40px' }}>{originDate.getFullYear() + '년 ' + (originDate.getMonth() + 1) + '월'}</span>
					<button className="btn" onClick={() => changeData(1)}>
						다음 달
					</button>
				</div>
			</div>
			<AUIGrid name="showcase7" ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default Showcase07;
