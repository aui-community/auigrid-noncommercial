import React, { useEffect, useRef } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import './Showcase04.css';

const PUBLIC_URL = process.env.PUBLIC_URL;

// eslint-disable-next-line
// prettier-ignore
const names:string[] = ['A 전자', 'B 상사', 'C 철강', 'D 회사', 'E 통신', 'F 공사', 'G 주식회사', 'H 인터넷', 'I 식품', 'J 제과', 'K 연구소', 'L 전자', 'M 화학', 'N 인터넷', 'O로 통신', 'P 주식회사', 'Q 코스메틱', 'R 청과', 'S 방송', 'T 자동차', 'UU 엔터'];

// eslint-disable-next-line
// prettier-ignore
const prices:number[] = [150000, 230000, 420000, 1200000, 320000, 100000, 240000, 320000, 520000, 820000, 300000, 200000, 200000, 200000, 200000, 200000, 200000, 200000, 200000, 200000, 200000];

// eslint-disable-next-line
const gaps: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// eslint-disable-next-line
const volumes: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// 랜덤 데이터 생성
const createRandomData = () => {
	let data: any[] = [];
	let count: number = names.length;
	for (let i: number = 0; i < count; i++) {
		data.push({
			id: i + 1,
			name: names[i],
			price: prices[i],
			open: prices[i],
			high: prices[i],
			low: prices[i],
			gap: 0,
			volume: 0
		});
	}

	// AUIGrid 에 데이터 삽입합니다.
	return data;
};

// 주식 종목 중 랜덤하게 갱신할 종목을 선택해서...랜덤하게 상승, 하락을 결정해 그리드에 반영시킴.
const createRandomRows = () => {
	let rows: any[] = [];
	let codes: number[] = [];
	let code: number;
	let gap: number;
	let isPlus: boolean = false;
	let index: number;
	let price: number;
	let codeCount: number = names.length; // 종목개수
	let limitGap: number;
	let i: number;

	// 랜덤 개수만큼 갱신
	let count: number = Math.floor(Math.random() * 10);

	for (i = 0; i < count; i++) {
		code = Math.ceil(Math.random() * codeCount);
		codes.push(code);
	}

	for (i = 0, count = codes.length; i < count; i++) {
		isPlus = Math.random() > 0.5 ? true : false; // 상승, 하락 랜덤 결정
		gap = 3000; // 호가

		if (!isPlus) {
			gap *= -1;
		}

		index = codes[i] - 1;

		price = prices[index];

		// 상하한 제한
		limitGap = price * 0.3;

		// 대비 값(상승 또는 하락 대비 가격)
		gaps[index] += gap;
		gap = gaps[index];

		// 상하한가인 경우
		if (Math.abs(gap) > limitGap) {
			gap = gap > 0 ? limitGap : -limitGap;
		}

		price += gap;
		volumes[index] += Math.floor(Math.random() * 10000); // 거래량 랜덤 누적

		// 갱신할 행들
		rows.push({
			id: codes[i], // rowIdField 로 설정한 id(중요)
			price: price, // 현재가
			gap: gap, // 대비가
			volume: volumes[index] // 거래량
		});
	}
	return rows;
};

const Showcase04 = () => {
	// 그리드 객체
	const myGrid = useRef<AUIGrid>(null);

	// 그리드 칼럼 레이아웃 정의
	const columnLayout: IGrid.Column[] = [
		{
			dataField: 'name',
			headerText: '종목명'
		},
		{
			dataField: 'price',
			headerText: '현재가',
			width: 120,
			dataType: 'numeric',
			style: 'my-right-style',
			formatString: '#,##0'
		},
		{
			dataField: 'gap',
			headerText: '대비',
			dataType: 'numeric',
			formatString: '#,##0',
			style: 'my-right-style',
			width: 120,
			renderer: {
				type: IGrid.RendererKind.IconRenderer,
				iconPosition: 'aisle',
				iconWidth: 7, // icon 가로 사이즈, 지정하지 않으면 24로 기본값 적용됨
				iconHeight: 6,
				iconFunction: (rowIndex, columnIndex, value, item) => {
					if (item.gap < 0) return PUBLIC_URL + '/assets/ico_down.gif';
					else if (item.gap > 0) return PUBLIC_URL + '/assets/ico_up.gif';
					return PUBLIC_URL + '/assets/ico_flat.gif';
				}
			},
			styleFunction: (rowIndex, columnIndex, value, headerText, item) => {
				if (item.gap < 0) return 'my-custom-down';
				else if (item.gap > 0) return 'my-custom-up';
				return 'my-custom-normal';
			}
		},
		{
			dataField: 'rate',
			headerText: '등락율',
			dataType: 'numeric',
			formatString: '#,##0.00',
			postfix: ' %',
			style: 'my-right-style',
			width: 120,
			expFunction: (rowIndex, columnIndex, item) => {
				// 여기서 실제로 출력할 값을 계산해서 리턴시킴.
				// expFunction 의 리턴형은 항상 Number 여야 합니다.(즉, 수식만 가능)
				let oldPrice: number = item.price - item.gap;
				let rate: number = Number(((item.gap / oldPrice) * 100).toFixed(2));
				return rate;
			},
			// eslint-disable-next-line
			styleFunction: (rowIndex, columnIndex, value, headerText, item) => {
				if (item.gap < 0) return 'my-custom-down';
				else if (item.gap > 0) return 'my-custom-up';
				return 'my-custom-normal';
			}
		},
		{
			dataField: 'rateGraph',
			headerText: '등락율 그래프',
			width: 120,
			expFunction: (rowIndex, columnIndex, item) => {
				// 여기서 실제로 출력할 값을 계산해서 리턴시킴.
				return item.rate;
			},
			renderer: {
				type: IGrid.RendererKind.BarRenderer,
				showLabel: false,
				min: -30,
				max: 30,
				offset: 30
			}
		},
		{
			dataField: 'volume',
			headerText: '거래량',
			dataType: 'numeric',
			formatString: '#,##0',
			style: 'my-right-style',
			width: 120
		},
		{
			dataField: 'open',
			headerText: '시가',
			dataType: 'numeric',
			formatString: '#,##0',
			style: 'my-right-style',
			width: 120
		},
		{
			dataField: 'high',
			headerText: '고가',
			dataType: 'numeric',
			formatString: '#,##0',
			style: 'my-custom-up',
			expFunction: (rowIndex, columnIndex, item) => {
				// 여기서 실제로 출력할 값을 계산해서 리턴시킴.
				return Math.max(item.high, item.price);
			},
			width: 120
		},
		{
			dataField: 'low',
			headerText: '저가',
			dataType: 'numeric',
			formatString: '#,##0',
			style: 'my-custom-down',
			expFunction: (rowIndex, columnIndex, item) => {
				// 여기서 실제로 출력할 값을 계산해서 리턴시킴.
				return Math.min(item.price, item.low);
			},
			width: 120
		}
	];

	// 그리드 속성 정의
	const gridProps = {
		width: '100%',
		height: 480,
		// row 를 구별짓는 유니크한 값을 갖는 필드 설정
		rowIdField: 'id'
	};

	useEffect(() => {
		console.log('Showcase04 마운트됨');

		// 최초 마운팅 될 때 그리드 데이터 조회시키기
		const grid = myGrid.current as AUIGrid;
		grid.setGridData(createRandomData());

		// 0.3초마다 특정 행들 갱신
		const timer: any = setInterval(refreshRows, 300);

		return () => {
			clearInterval(timer);
			console.log('Showcase04 언마운트됨');
		};
	}, []);

	// 특정 행들만 갱신
	// 주식 종목 중 랜덤하게 갱신할 종목을 선택해서...랜덤하게 상승, 하락을 결정해 그리드에 반영시킴.
	const refreshRows = () => {
		const grid = myGrid.current as AUIGrid;

		// 변경 시킬 행들 얻어 옴.
		const rows: any[] = createRandomRows();

		// AUIGrid 에 갱신할 행들 삽입
		// refreshRows 사용하기 전에 반드시 rowIdField 속성을 선행으로 설정해야합니다.
		grid.refreshRows(rows, 'my-refresh-row-flash-style', 200);
	};

	return (
		<div>
			<div className="desc">
				<p>실시간 주식 현황(나의 관심 종목)을 구현한 데모입니다.</p>
				<p>주식은 가상의 주식으로 랜덤하게 로컬에서 0.3초 마다 거래가 이루어진 종목만 갱신하도록 설정한 모습입니다.</p>
				<p>처음 데이터를 그리드에 삽입 한 후 그리드에 특정 행의 셀 값(현재가, 대비가, 거래량)만 갱신하는 모습입니다.</p>
				<p>참고 : AUIGrid 가 서버와 통신하는 방법 및 속도까지 커버하지 않습니다. AUIGrid 는 단순히 출력해 주는 역할만 할 뿐입니다.</p>
				<p>이 데모와 같이 빠른 속도로 주식 정보를 갱신하는 것은 일반 Ajax 통신으론 불가능합니다.</p>
				<p>만약, 웹 상에서 주식 정보를 실시간으로 빠르게 갱신하고자 한다면 웹소켓(Web Socket)으로 구성하는 것이 최선일 것입니다.</p>
			</div>
			<AUIGrid name="showcase4" ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default Showcase04;
