import React, { useEffect, useRef } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
//import axios from 'axios';
// AUIGrid 엑셀, PDF 바로 다운로딩 처리 모듈
// eslint-disable-next-line
import FileSaver from 'file-saver';

const PUBLIC_URL = process.env.PUBLIC_URL;

// 그리드 데이터
const gridData = [
	{
		id: '#Cust0',
		date: '2014-10-01',
		name: 'Steve',
		country: 'USA',
		flag: 'usa.png',
		product: 'IPad Air',
		color: 'Green',
		quantity: 3,
		price: 630700
	},
	{
		id: '#Cust1',
		date: '2014-09-30',
		name: 'Emma',
		country: 'Korea',
		flag: 'korea.png',
		product: 'LG G3',
		color: 'Pink',
		quantity: 1,
		price: 503800
	},
	{
		id: '#Cust2',
		date: '2014-09-29',
		name: 'Emma',
		country: 'Japan',
		flag: 'japan.png',
		product: 'IPad Air',
		color: 'Yellow',
		quantity: 7,
		price: 66900
	},
	{
		id: '#Cust3',
		date: '2014-09-28',
		name: 'Emma',
		country: 'UK',
		flag: 'uk.png',
		product: 'Galaxy Note3',
		color: 'Orange',
		quantity: 9,
		price: 458300
	},
	{
		id: '#Cust4',
		date: '2014-09-27',
		name: 'Anna',
		country: 'China',
		flag: 'china.png',
		product: 'LG G3',
		color: 'Violet',
		quantity: 10,
		price: 168100
	},
	{
		id: '#Cust5',
		date: '2014-09-26',
		name: 'Anna',
		country: 'USA',
		flag: 'usa.png',
		product: 'Galaxy S5',
		color: 'Gray',
		quantity: 3,
		price: 10400
	}
];

const ExportMultiXlsx = () => {
	// 그리드 객체
	const myGrid = useRef();
	const myGrid2 = useRef();
	const myGrid3 = useRef();
	const myGrid4 = useRef();

	// 그리드 칼럼 레이아웃 정의
	const columnLayout = [
		{
			dataField: 'id',
			headerText: 'ID',
			width: 120
		},
		{
			dataField: 'name',
			headerText: 'Name',
			width: 140
		},
		{
			dataField: 'country',
			headerText: 'Country',
			width: 140
		},
		{
			dataField: 'flag',
			headerText: 'Flag IMG',
			editable: false,
			prefix: PUBLIC_URL + '/assets/',
			renderer: {
				type: 'ImageRenderer',
				imgHeight: 24,
				altField: 'country'
			},
			width: 100
		},
		{
			dataField: 'product',
			headerText: 'Product',
			width: 140
		},
		{
			dataField: 'color',
			headerText: 'Color',
			width: 100
		},
		{
			dataField: 'price',
			headerText: 'Price',
			dataType: 'numeric',
			style: 'my-column',
			width: 120,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true, // 0~9만 입력가능
				textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
				autoThousandSeparator: true // 천단위 구분자 삽입 여부
			}
		},
		{
			dataField: 'quantity',
			headerText: 'Quantity',
			dataType: 'numeric',
			style: 'my-column',
			width: 100,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true, // 0~9만 입력가능
				textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
				autoThousandSeparator: true // 천단위 구분자 삽입 여부
			}
		},
		{
			dataField: 'date',
			headerText: 'Date',
			dataType: 'date',
			dateInputFormat: 'yyyy-mm-dd', // 데이터의 날짜 형식
			formatString: 'yyyy년 mm월 dd일' // 그리드에 보여줄 날짜 형식
		}
	];

	// 그리드 속성 정의
	const gridProps = {
		width: '100%',
		height: 280
	};

	useEffect(() => {
		// 최초 마운팅 될 때 그리드 데이터 조회시키기
		requestGridData();
	}, []);

	// 그리드 데이터 조회하여 삽입
	const requestGridData = () => {
		const grid = myGrid.current;
		const grid2 = myGrid2.current;
		const grid3 = myGrid3.current;
		const grid4 = myGrid4.current;

		grid.setGridData(gridData);
		grid2.setGridData(gridData.slice(1, 3));
		grid3.setGridData(gridData.slice(2, 4));
		grid4.setGridData(gridData.slice(3, 5));
	};

	const exportClick = () => {
		const grid = myGrid.current;
		const grid2 = myGrid2.current;
		const grid3 = myGrid3.current;
		const grid4 = myGrid4.current;

		const exportProps = [
			{
				fileName: '그리드 4개 1개의 엑셀로 저장 테스트',
				sheetName: '일반 데이터',
				progressBar: true,
				// 헤더 내용
				headers: [
					{
						text: '원본 데이터 리스트',
						height: 24,
						style: { fontSize: 20, textAlign: 'center', fontWeight: 'bold', underline: true, background: '#DAD9FF' }
					},
					{
						text: '',
						height: 5,
						style: { background: '#555555' } // 빈줄 색깔 경계 만듬
					}
				]
			},
			{
				sheetName: 'Type 1',
				// 헤더 내용
				headers: [
					{
						text: 'Type 1 리스트',
						height: 24,
						style: { fontSize: 20, textAlign: 'center', fontWeight: 'bold', underline: true, background: '#DAD9FF' }
					},
					{
						text: '',
						height: 5,
						style: { background: '#555555' } // 빈줄 색깔 경계 만듬
					}
				]
			},
			{
				sheetName: 'Type 2',
				// 헤더 내용
				headers: [
					{
						text: 'Type 2 리스트',
						height: 24,
						style: { fontSize: 20, textAlign: 'center', fontWeight: 'bold', underline: true, background: '#DAD9FF' }
					},
					{
						text: '',
						height: 5,
						style: { background: '#555555' } // 빈줄 색깔 경계 만듬
					}
				]
			},
			{
				sheetName: 'Type 3',
				// 헤더 내용
				headers: [
					{
						text: 'Type 3 리스트',
						height: 24,
						style: { fontSize: 20, textAlign: 'center', fontWeight: 'bold', underline: true, background: '#DAD9FF' }
					},
					{
						text: '',
						height: 5,
						style: { background: '#555555' } // 빈줄 색깔 경계 만듬
					}
				]
			}
		];
		// 다수의 그리드를 1개의 엑셀의 각각의 시트(Sheets)로  내보내기 하기
		grid.exportToXlsxMulti([grid2.pid, grid3.pid, grid4.pid], exportProps);
	};

	return (
		<div>
			<div className="desc">
				<button className="btn" onClick={exportClick}>
					4개 그리드 각각의 시트로 엑셀(xlsx) 저장하기
				</button>
			</div>
			<h3>그리드1</h3>
			<AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
			<h3>그리드2</h3>
			<AUIGrid ref={myGrid2} columnLayout={columnLayout} gridProps={gridProps} />
			<h3>그리드3</h3>
			<AUIGrid ref={myGrid3} columnLayout={columnLayout} gridProps={gridProps} />
			<h3>그리드4</h3>
			<AUIGrid ref={myGrid4} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default ExportMultiXlsx;
