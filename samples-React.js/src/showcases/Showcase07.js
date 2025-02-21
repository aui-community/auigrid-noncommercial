import React, { useEffect, useRef, useState } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
// AUIGrid 커스텀렌더러 import
import MyCalendarRenderer from '../renderers/MyCalendarRenderer';
import './Showcase07.css';

const genGridData = (currentDate) => {
	let date = new Date(currentDate);
	let thisYear = date.getFullYear();
	let thisMonth = date.getMonth() + 1; // 실제 보이는 월
	let startDay = new Date(thisYear, thisMonth - 1, 1);
	let endDay = new Date(thisYear, thisMonth, 0); // 말일
	let endCount = endDay.getDate();
	let weekArray = [];
	let data = [];
	let i;
	startDay = startDay.getDay();
	// 달력 앞의 빈 날짜들
	for (let i = 0; i < startDay; i++) {
		weekArray.push(null);
	}

	// 진짜 날짜들
	for (i = 1; i <= endCount; i++) {
		if (weekArray.length === 7) {
			data.push(weekArray);
			weekArray = [];
		}
		weekArray.push({
			date: i,
			value: Math.floor(Math.random() * 100)
		});
	}

	// 달력 마지막 주의 날짜들
	if (weekArray.length !== 0) {
		data.push(weekArray);
	}
	//console.log(JSON.stringify(data));
	return data;
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
