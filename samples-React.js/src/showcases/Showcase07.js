import React, { useEffect, useRef, useState } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
// AUIGrid 커스텀렌더러 import
import MyCalendarRenderer from '../renderers/MyCalendarRenderer';
import './Showcase07.css';

const genGridData = (inputDate) => {
	const originDate = new Date(inputDate);
	const year = originDate.getFullYear();
	const month = originDate.getMonth(); // 0-based
	const startOfMonth = new Date(year, month, 1);
	const endOfMonth = new Date(year, month + 1, 0);
	const totalDays = endOfMonth.getDate();
	const startWeekday = startOfMonth.getDay(); // 0 (일) ~ 6 (토)

	const weeks = [];
	let week = [];

	// 달력 앞쪽 공백 삽입
	for (let i = 0; i < startWeekday; i++) {
		week.push(null);
	}

	// 날짜 + 랜덤값 삽입
	for (let day = 1; day <= totalDays; day++) {
		week.push({
			date: day,
			value: Math.floor(Math.random() * 100)
		});

		if (week.length === 7) {
			weeks.push(week);
			week = [];
		}
	}

	// 마지막 주가 남아있다면 추가
	if (week.length > 0) {
		weeks.push(week);
	}

	console.log(weeks);
	return weeks;
};

const Showcase07 = () => {
	// 그리드 객체
	const myGrid = useRef();

	const [originDate, setOriginDate] = useState(new Date());

	// 그리드 칼럼 레이아웃
	const columnLayout = [
		{
			dataField: '0',
			headerText: '일',
			style: 'my-sunday-style',
			headerStyle: 'my-sunday-style',
			renderer: {
				type: 'CustomRenderer',
				jsClass: MyCalendarRenderer
			}
		},
		{
			dataField: '1',
			headerText: '월',
			renderer: {
				type: 'CustomRenderer',
				jsClass: MyCalendarRenderer
			}
		},
		{
			dataField: '2',
			headerText: '화',
			renderer: {
				type: 'CustomRenderer',
				jsClass: MyCalendarRenderer
			}
		},
		{
			dataField: '3',
			headerText: '수',
			renderer: {
				type: 'CustomRenderer',
				jsClass: MyCalendarRenderer
			}
		},
		{
			dataField: '4',
			headerText: '목',
			renderer: {
				type: 'CustomRenderer',
				jsClass: MyCalendarRenderer
			}
		},
		{
			dataField: '5',
			headerText: '금',
			renderer: {
				type: 'CustomRenderer',
				jsClass: MyCalendarRenderer
			}
		},
		{
			dataField: '6',
			headerText: '토',
			style: 'my-saturday-style',
			headerStyle: 'my-saturday-style',
			renderer: {
				type: 'CustomRenderer',
				jsClass: MyCalendarRenderer
			}
		}
	];

	// 그리드 속성 정의
	const gridProps = {
		width: '100%',
		height: 480,
		selectionMode: 'none',
		enableSorting: false,
		showRowNumColumn: false,
		enableColumnResize: false,
		//rowHeight 80으로 설정
		rowHeight: 80
	};

	useEffect(() => {
		console.log('Showcase07 마운트됨');
		return () => {
			console.log('Showcase07 언마운트됨');
		};
	}, []);

	useEffect(() => {
		// 최초 마운팅 될 때 그리드 데이터 생성(오늘 날짜 기반)
		const gridData = genGridData(originDate);

		// 데이터 삽입
		myGrid.current.setGridData(gridData);
	}, [originDate]);

	// 다음달 데이터로 변경
	const changeDataToNext = () => {
		const date = new Date(originDate);
		// 다음 달
		date.setMonth(date.getMonth() + 1);

		setOriginDate(date);
	};

	// 이전달 데이터로 변경
	const changeDataToPrev = () => {
		const date = new Date(originDate);
		// 이전 달
		date.setMonth(date.getMonth() - 1);

		setOriginDate(date);
	};

	return (
		<div>
			<div className="desc">
				<p>달력에 개별 날짜마다 목표치 달성률을 표시한 데모입니다.</p>
				<p>그리드에 출력되는 셀은 사용자 정의 렌더러(CustomRenderer)를 사용하였습니다.</p>
				<p>이와 같이 사용자가 원하는 셀 형식을 자바스크립트로 작성할 수 있습니다.</p>
				<div className="force-text-center">
					<button className="btn" onClick={changeDataToPrev}>
						이전 달
					</button>
					<span style={{ margin: '2px 40px' }}>{originDate.getFullYear() + '년 ' + (originDate.getMonth() + 1) + '월'}</span>
					<button className="btn" onClick={changeDataToNext}>
						다음 달
					</button>
				</div>
			</div>
			<AUIGrid name="showcase7" ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default Showcase07;
