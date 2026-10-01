<script setup>
	import AUIGrid from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
	import 'file-saver';
	import '@/static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
	import { ref, onMounted, onBeforeUnmount } from 'vue';

	const myGrid = ref(null);

	const BASE_URL = import.meta.env.BASE_URL;

	// eslint-disable-next-line
	// prettier-ignore
	const names = ['A 전자', 'B 상사', 'C 철강', 'D 회사', 'E 통신', 'F 공사', 'G 주식회사', 'H 인터넷', 'I 식품', 'J 제과', 'K 연구소', 'L 전자', 'M 화학', 'N 인터넷', 'O로 통신', 'P 주식회사', 'Q 코스메틱', 'R 청과', 'S 방송', 'T 자동차', 'UU 엔터'];

	// eslint-disable-next-line
	// prettier-ignore
	const prices = [150000, 230000, 420000, 1200000, 320000, 100000, 240000, 320000, 520000, 820000, 300000, 200000, 200000, 200000, 200000, 200000, 200000, 200000, 200000, 200000, 200000];

	const createRandomData = () =>
		names.map((name, i) => ({
			id: i + 1,
			name,
			price: prices[i],
			open: prices[i],
			high: prices[i],
			low: prices[i],
			gap: 0,
			volume: 0
		}));

	const createRandomRows = (gaps, volumes) => {
		const codeCount = names.length;
		const randomCount = Math.floor(Math.random() * 10);
		const codes = [];

		for (let i = 0; i < randomCount; i++) {
			codes.push(Math.ceil(Math.random() * codeCount));
		}

		return codes.map((code) => {
			const isPlus = Math.random() > 0.5;
			let gap = isPlus ? 3000 : -3000;
			const index = code - 1;
			const limitGap = prices[index] * 0.3;

			gaps[index] += gap;
			gap = gaps[index];

			if (Math.abs(gap) > limitGap) {
				gap = gap > 0 ? limitGap : -limitGap;
			}

			const price = prices[index] + gap;
			volumes[index] += Math.floor(Math.random() * 10000);

			return { id: code, price, gap, volume: volumes[index] };
		});
	};

	const columnLayout = [
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
				type: 'IconRenderer',
				iconPosition: 'aisle',
				iconWidth: 7,
				iconHeight: 6,
				iconFunction: (_rowIndex, _columnIndex, _value, item) => {
					if (item.gap < 0) return `${BASE_URL}/assets/ico_down.gif`;
					if (item.gap > 0) return `${BASE_URL}/assets/ico_up.gif`;
					return `${BASE_URL}/assets/ico_flat.gif`;
				}
			},
			styleFunction: (_rowIndex, _columnIndex, _value, _headerText, item) => {
				if (item.gap < 0) return 'my-custom-down';
				if (item.gap > 0) return 'my-custom-up';
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
			expFunction: (_rowIndex, _columnIndex, item) => {
				const oldPrice = item.price - item.gap;
				return Number(((item.gap / oldPrice) * 100).toFixed(2));
			},
			// eslint-disable-next-line
			styleFunction: (_rowIndex, _columnIndex, _value, _headerText, item) => {
				if (item.gap < 0) return 'my-custom-down';
				if (item.gap > 0) return 'my-custom-up';
				return 'my-custom-normal';
			}
		},
		{
			dataField: 'rateGraph',
			headerText: '등락율 그래프',
			width: 120,
			expFunction: (_rowIndex, _columnIndex, item) => item.rate,
			renderer: {
				type: 'BarRenderer',
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
			expFunction: (_rowIndex, _columnIndex, item) => Math.max(item.high, item.price),
			width: 120
		},
		{
			dataField: 'low',
			headerText: '저가',
			dataType: 'numeric',
			formatString: '#,##0',
			style: 'my-custom-down',
			expFunction: (_rowIndex, _columnIndex, item) => Math.min(item.price, item.low),
			width: 120
		}
	];

	const gridProps = {
		width: '100%',
		height: 480,
		rowIdField: 'id'
	};

	const exportClick = () => {
		myGrid.value.exportToXlsx({
			progressBar: true,
			fileName: '쇼케이스-02'
		});
	};

	const exportPdfClick = () => {
		const grid = myGrid.value;
		if (!grid.isAvailabePdf()) {
			alert('PDF 저장은 HTML5를 지원하는 최신 브라우저에서 가능합니다.(IE는 10부터 가능)');
			return;
		}
		grid.exportToPdf({
			fontPath: './fonts/jejugothic-regular.ttf',
			fileName: '쇼케이스-02'
		});
	};

	// 초기 데이터 삽입과 주기 갱신을 분리합니다.
	function loadGridData(grid) {
		grid.setGridData(createRandomData());
	}

	function startUpdates(grid) {
		// 다른 mount 또는 다른 그리드와 누적 값을 공유하지 않습니다.
		const gaps = Array(names.length).fill(0);
		const volumes = Array(names.length).fill(0);
		const timer = setInterval(() => {
			grid.refreshRows(createRandomRows(gaps, volumes), 'my-refresh-row-flash-style', 200);
		}, 300);
		return () => clearInterval(timer);
	}

	let stopUpdates = () => {};
	onMounted(() => {
		const grid = myGrid.value;
		loadGridData(grid);
		stopUpdates = startUpdates(grid);
	});
	// KeepAlive의 비활성화에서는 기존 갱신을 유지합니다.
	onBeforeUnmount(() => stopUpdates());
</script>
<template>
	<div>
		<div class="desc">
			<p>실시간 주식 현황(나의 관심 종목)을 구현한 데모입니다.</p>
			<p>주식은 가상의 주식으로 랜덤하게 로컬에서 0.3초 마다 거래가 이루어진 종목만 갱신하도록 설정한 모습입니다.</p>
			<p>처음 데이터를 그리드에 삽입 한 후 그리드에 특정 행의 셀 값(현재가, 대비가, 거래량)만 갱신하는 모습입니다.</p>
			<p>참고 : AUIGrid 가 서버와 통신하는 방법 및 속도까지 커버하지 않습니다. AUIGrid 는 단순히 출력해 주는 역할만 할 뿐입니다.</p>
			<p>이 데모와 같이 빠른 속도로 주식 정보를 갱신하는 것은 일반 Ajax 통신으론 불가능합니다.</p>
			<p>만약, 웹 상에서 주식 정보를 실시간으로 빠르게 갱신하고자 한다면 웹소켓(Web Socket)으로 구성하는 것이 최선일 것입니다.</p>
		</div>
		<AUIGrid ref="myGrid" name="showcase4" :columnLayout="columnLayout" :gridProps="gridProps" />
	</div>
</template>
<style>
	#aui-grid-wrap-showcase4 .my-right-style {
		text-align: right;
	}

	#aui-grid-wrap-showcase4 .my-refresh-row-flash-style {
		background: #dfdfdf;
	}

	#aui-grid-wrap-showcase4 .my-custom-down {
		color: #0000ff;
		text-align: right;
	}
	#aui-grid-wrap-showcase4 .my-custom-up {
		color: #ff0000;
		text-align: right;
	}
	#aui-grid-wrap-showcase4 .my-custom-normal {
		color: inherit;
		text-align: right;
	}

	#aui-grid-wrap-showcase4 .aui-grid-bar-renderer-negative {
		background: #4641d9;
		border: 1px solid #4641d9;
	}
	#aui-grid-wrap-showcase4 .aui-grid-bar-renderer-positive {
		background: #df4d4d;
		border: 1px solid #df4d4d;
	}
</style>
