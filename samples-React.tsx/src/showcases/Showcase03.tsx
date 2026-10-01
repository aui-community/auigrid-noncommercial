import { useEffect, useRef } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid, { agUtils } from '../static/AUIGrid-React.tsx/AUIGridReact';
import axios from 'axios';
import ExportGridDataView from '../samples/ExportGridDataView';
import './Showcase03.css';

const columnLayout: IGrid.Column[] = [
	{
		dataField: 'title',
		headerText: ' ',
		width: 280
	},
	{
		dataField: 'm1,m2,m3,m4,m5,m6,m7,m8,m9,m10,m11,m12',
		headerText: '추 세',
		headerTooltip: {
			show: true,
			tooltipHtml: '합계 행에 대하여 1월에서 12월 간 추세를 나타냅니다.'
		},
		renderer: {
			type: IGrid.RendererKind.SparkLineRenderer,
			renderingField: '_isMySum'
		},
		width: 120
	},
	{
		headerText: '2014 상반기',
		children: [
			{ dataField: 'm1', headerText: '1월', width: 60, dataType: 'numeric', formatString: '#,##0', style: 'showcase3-my-column-text-right' },
			{ dataField: 'm2', headerText: '2월', width: 60, dataType: 'numeric', formatString: '#,##0', style: 'showcase3-my-column-text-right' },
			{ dataField: 'm3', headerText: '3월', width: 60, dataType: 'numeric', formatString: '#,##0', style: 'showcase3-my-column-text-right' },
			{ dataField: 'm4', headerText: '4월', width: 60, dataType: 'numeric', formatString: '#,##0', style: 'showcase3-my-column-text-right' },
			{ dataField: 'm5', headerText: '5월', width: 60, dataType: 'numeric', formatString: '#,##0', style: 'showcase3-my-column-text-right' },
			{ dataField: 'm6', headerText: '6월', width: 60, dataType: 'numeric', formatString: '#,##0', style: 'showcase3-my-column-text-right' }
		]
	},
	{
		headerText: '2014 하반기',
		children: [
			{ dataField: 'm7', headerText: '7월', width: 60, dataType: 'numeric', formatString: '#,##0', style: 'showcase3-my-column-text-right' },
			{ dataField: 'm8', headerText: '8월', width: 60, dataType: 'numeric', formatString: '#,##0', style: 'showcase3-my-column-text-right' },
			{ dataField: 'm9', headerText: '9월', width: 60, dataType: 'numeric', formatString: '#,##0', style: 'showcase3-my-column-text-right' },
			{ dataField: 'm10', headerText: '10월', width: 60, dataType: 'numeric', formatString: '#,##0', style: 'showcase3-my-column-text-right' },
			{ dataField: 'm11', headerText: '11월', width: 60, dataType: 'numeric', formatString: '#,##0', style: 'showcase3-my-column-text-right' },
			{ dataField: 'm12', headerText: '12월', width: 60, dataType: 'numeric', formatString: '#,##0', style: 'showcase3-my-column-text-right' }
		]
	},
	{
		headerText: '합계',
		dataField: 'mySumCol',
		dataType: 'numeric',
		style: 'showcase3-strong-cells',
		xlsxTextConversion: true,
		labelFunction: (_rowIndex, _columnIndex, _labelText, _headerText, item) => {
			if (item._$isBranch) return '';
			let sum = 0;
			for (let i = 1; i <= 12; i++) {
				const val = Number(item['m' + i]);
				if (!isNaN(val)) sum += val;
			}
			return isNaN(sum) ? '' : agUtils.formatNumber(sum, '#,##0.00');
		}
	}
];

const gridProps: IGrid.Props = {
	width: '100%',
	height: 480,
	enableFilter: true,
	useContextMenu: true,
	fixedColumnCount: 1,
	fixedRowCount: 2,
	displayTreeOpen: true,
	showRowCheckColumn: false,
	showRowNumColumn: false,
	rowStyleFunction: (_rowIndex, item) => {
		if (!item._isMySum) return null;
		switch (item._$depth) {
			case 1:
				return 'aui-grid-row-depth1-style';
			case 2:
				return 'aui-grid-row-depth2-style';
			case 3:
				return 'aui-grid-row-depth3-style';
			default:
				return 'aui-grid-row-depth-default-style';
		}
	}
};

// 데이터 요청과 그리드 반영. 종료된 컴포넌트에는 응답을 적용하지 않습니다.
async function loadGridData(grid: AUIGrid, signal: AbortSignal) {
	grid.showAjaxLoader();
	try {
		const { data } = await axios.get('./data/chanel_marketing.json', { signal });
		if (!signal.aborted) grid.setGridData(data);
	} catch (error) {
		if (!signal.aborted) console.error('데이터 로딩 오류:', error);
	} finally {
		if (!signal.aborted) grid.removeAjaxLoader();
	}
}

const Showcase03 = () => {
	const myGrid = useRef<AUIGrid>(null);

	// 생성된 wrapper 참조에 초기화하고, effect가 종료되면 요청/작업을 정리합니다.
	useEffect(() => {
		const grid = myGrid.current as AUIGrid;
		const controller = new AbortController();
		loadGridData(grid, controller.signal);
		return () => {
			controller.abort();
		};
	}, []);

	return (
		<div>
			<div className="desc">
				<ExportGridDataView myGrid={myGrid} xlsxProps={{ fileName: '쇼케이스-03', isRowStyleFront: false }} pdfProps={{ fileName: '쇼케이스-03', isRowStyleFront: false }} />
				<p>마케팅 예산을 계층 구조로 출력한 모습입니다. ( 계층구조 데이터 표현 )</p>
				<p>추세를 나타내는 스파크 라인은 합계에 해당되는 행(Row)에만 선택적으로 그리도록 설정한 모습입니다.</p>
			</div>
			<AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default Showcase03;
