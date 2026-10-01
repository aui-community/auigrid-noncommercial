import { useEffect, useRef } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
import axios from 'axios';
import ExportGridDataView from '../samples/ExportGridDataView';
import './Showcase06.css';

const columnLayout = [
	{
		dataField: 'type0',
		headerText: '구분',
		cellMerge: true,
		style: 'showcase6-my-column-strong',
		filter: { showIcon: true }
	},
	{
		dataField: 'type',
		headerText: '유형',
		width: 120
	},
	{
		dataField: 'p131,p132,p133,p134,p135,p136,p137,p138,p139,p1310,p1311,p1312',
		headerText: '월별 추이',
		width: 120,
		renderer: { type: 'SparkColumnRenderer' }
	},
	...['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((m) => ({
		dataField: `p13${m}`,
		headerText: `'13 ${m}월`,
		style: 'showcase6-my-column-text-right',
		dataType: 'numeric',
		formatString: '#,##0'
	}))
];

const gridProps = {
	width: '100%',
	height: 480,
	enableCellMerge: true,
	enableFilter: true,
	editable: true,
	selectionMode: 'multipleCells',
	showRowNumColumn: false,
	showRowCheckColumn: false,
	rowStyleFunction: (rowIndex, item) => {
		if (item._mySum || item._mySum === 'true') return 'aui-grid-row-depth2-style';
	}
};

// 데이터 요청과 그리드 반영. 종료된 컴포넌트에는 응답을 적용하지 않습니다.
async function loadGridData(grid, signal) {
	grid.showAjaxLoader();
	try {
		const { data } = await axios.get('./data/profit.json', { signal });
		if (!signal.aborted) grid.setGridData(data);
	} catch (error) {
		if (!signal.aborted) console.error('데이터 로딩 오류:', error);
	} finally {
		if (!signal.aborted) grid.removeAjaxLoader();
	}
}

// 그리드 생성 뒤 이벤트를 연결합니다. 리스너 해제는 wrapper가 담당합니다.
function bindGridEvents(grid) {
	grid.bind(['cellClick', 'headerClick'], (event) => {
		console.log(event.type);
	});
}

const Showcase06 = () => {
	const myGrid = useRef();

	// 생성된 wrapper 참조에 초기화하고, effect가 종료되면 요청/작업을 정리합니다.
	useEffect(() => {
		const grid = myGrid.current;
		const controller = new AbortController();
		bindGridEvents(grid);
		loadGridData(grid, controller.signal);
		return () => {
			controller.abort();
		};
	}, []);

	return (
		<div>
			<div className="desc">
				<ExportGridDataView myGrid={myGrid} xlsxProps={{ fileName: '쇼케이스-06' }} pdfProps={{ fileName: '쇼케이스-06' }} />
				<p>손익을 크게 매출 수익, 원가, 경비로 보고 해당 내역을 출력한 모습입니다.</p>
			</div>
			<AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default Showcase06;
