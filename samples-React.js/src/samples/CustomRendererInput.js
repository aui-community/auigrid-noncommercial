import React, { useEffect, useRef, useId } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
import MyInputRenderer from '../renderers/MyInputRenderer';

const gridData = [
	{ name: 'Anna', country: 'Japan' },
	{ name: 'Emma', country: 'USA' },
	{ name: 'Steve', country: 'Italy' },
	{ name: 'Jennifer', country: 'China' },
	{ name: 'Jennifer', country: 'UK' },
	{ name: 'Lawrence', country: 'Singapore' },
	{ name: 'Jennifer', country: 'Japan' },
	{ name: 'Steve', country: 'Ireland' },
	{ name: 'Anna', country: 'Italy' },
	{ name: 'Kim', country: 'France' },
	{ name: 'Emma', country: 'China' },
	{ name: 'Jennifer', country: 'France' },
	{ name: 'Kim', country: 'Japan' },
	{ name: 'Steve', country: 'USA' },
	{ name: 'Emma', country: 'France' },
	{ name: 'Emma', country: 'USA' },
	{ name: 'Emma', country: 'Italy' },
	{ name: 'Emma', country: 'Japan' },
	{ name: 'Lawrence', country: 'Korea' },
	{ name: 'Jennifer', country: 'Japan' },
	{ name: 'Steve', country: 'USA' }
];

const CustomRendererInput = () => {
	// 그리드 객체
	const myGrid = useRef();

	// 그리드 name 에 정의할 고유값
	const uid = useId();

	// 그리드 칼럼 레이아웃 정의
	const columnLayout = [
		{
			dataField: 'name',
			headerText: 'Name',
			width: 260
		},
		{
			dataField: 'country',
			headerText: '커스텀 렌더러-Input',
			width: 280,
			widthFit: 140,
			editable: false, // 그리드의 에디팅 사용 안함( 커스텀 렌더러에 자체 에디팅 가능한 input 이 존재하여 에디팅 처리 하기 위함 )
			headerTooltip: {
				show: true,
				tooltipHtml: '사용자 정의 렌더러를 작성한 칼럼입니다.'
			},
			renderer: {
				type: 'CustomRenderer',
				jsClass: MyInputRenderer
			}
		}
	];

	// 그리드 속성 정의
	const gridProps = {
		width: '100%',
		height: 480,
		// 행 높이 설정
		rowHeight: 34,
		editable: true,
		showStateColumn: true
	};

	useEffect(() => {
		console.log('CustomRendererInput 마운트됨');

		// 최초 마운팅 될 때 그리드 이벤트 세팅
		setupGridEvents();

		const grid = myGrid.current;
		// 그리드 데이터 삽입
		grid.setGridData(gridData);

		return () => {
			console.log('CustomRendererInput 언마운트됨');
		};
	}, []);

	// 그리드 이벤트 세팅
	const setupGridEvents = () => {
		const grid = myGrid.current;
		// 그리드 이벤트 바인딩
		grid.bind(['cellClick'], (event) => {
			console.log(event);
		});
	};

	return (
		<div>
			<div className="desc">
				<p>React.js에서 어떻게 CustomRenderer 를 정의하고 사용하는지를 보여주는 데모입니다.</p>
				<p>이 샘플은 일반 JS에 작성한 AUIGrid.MyInputRenderer 를 React.js로 출력한 모습입니다.</p>
				<p>
					즉,{' '}
					<a href="https://www.auisoft.net/demo/auigrid/renderer_custom_input.html?er_cus_1&theme=default&s=5700" target="_blank" rel="noreferrer">
						{' '}
						<strong>사용자 정의 렌더러 - Input 샘플</strong>
					</a>
					을 그대로 React.js로 작성한 데모입니다.
				</p>
			</div>
			<AUIGrid ref={myGrid} name={uid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default CustomRendererInput;
