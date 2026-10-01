import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
import axios from 'axios';
import ExportGridDataView from '../samples/ExportGridDataView';
import './Showcase02.css';
import iconMan from '../assets/office_man.png';
import iconFemale from '../assets/office_female.png';
import iconDate from '../assets/calendar-icon.png';

const listItems = [
	{ text: '계층 1 Depth 만 보이기', value: 1 },
	{ text: '계층 2 Depth 만 보이기', value: 2 },
	{ text: '계층 3 Depth 만 보이기', value: 3 }
];

const gridProps = {
	width: '100%',
	height: 480,
	selectionMode: 'singleRow',
	editable: true,
	enableFilter: true,
	showStateColumn: true,
	treeColumnIndex: 1,
	displayTreeOpen: true,
	showRowCheckColumn: false,
	showRowNumColumn: false
};

const calendarEditRenderer = {
	type: 'CalendarRenderer',
	showEditorBtn: false,
	onlyCalendar: true,
	titles: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
	monthTitleString: 'mmm',
	formatMonthString: 'mmm yyyy',
	formatYearString: 'yyyy',
	showExtraDays: true,
	showTodayBtn: true,
	todayText: 'Today'
};

// 데이터 요청과 그리드 반영. 종료된 컴포넌트에는 응답을 적용하지 않습니다.
async function loadGridData(grid, signal) {
	grid.showAjaxLoader();
	try {
		const { data } = await axios.get('./data/schedule_tree.json', { signal });
		if (!signal.aborted) grid.setGridData(data);
	} catch (error) {
		if (!signal.aborted) console.error('데이터 로딩 오류:', error);
	} finally {
		if (!signal.aborted) grid.removeAjaxLoader();
	}
}

const Showcase02 = () => {
	const [isExpanded, setIsExpanded] = useState(true);
	const myGrid = useRef();

	const columnLayout = useMemo(
		() => [
			{
				dataField: 'id',
				headerText: 'ID',
				width: 50
			},
			{
				dataField: 'name',
				headerText: 'Task Name',
				filter: { showIcon: true },
				headerTooltip: {
					show: true,
					tooltipHtml:
						'<div style="width:180px;text-align:left;"><p>Just an incredibly simple <span style="color:#F29661;">AUIGrid</span></p><p>Faucibus sed lobortis aliquam lorem blandit. Lorem eu nunc metus col. Commodo id in arcu ante lorem ipsum sed accumsan erat praesent faucibus commodo ac mi lacus. Adipiscing mi ac commodo. </p></div>' // eslint-disable-line
				},
				style: 'showcase2-my-left-text',
				width: 400
			},
			{
				dataField: 'charge',
				headerText: 'Charge',
				filter: { showIcon: true },
				headerTooltip: {
					show: true,
					tooltipHtml: '<div style="width:120px;text-align:left;"><p>Things I Can Do</p><p> Integer eu ante ornare amet commetus vestibulum blandit integer in curae ac faucibus integer non. Adipiscing cubilia elementum integer lorem ipsum dolor sit amet.</p></div>' // eslint-disable-line
				},
				style: 'showcase2-my-left-text',
				width: 120,
				renderer: {
					type: 'IconRenderer',
					iconWidth: 20,
					iconHeight: 20,
					iconFunction: (rowIndex, columnIndex, value) => {
						if (value && value.substr(0, 1) === 'A') return iconFemale;
						return iconMan;
					}
				},
				editRenderer: {
					type: 'ComboBoxRenderer',
					showEditorBtnOver: true,
					historyMode: true,
					listAlign: 'left'
				}
			},
			{
				dataField: 'complete',
				headerText: 'Complete(%)',
				width: 100,
				dataType: 'numeric',
				renderer: { type: 'BarRenderer', min: 0, max: 100 },
				editRenderer: { type: 'NumberStepRenderer', min: 0, max: 100, step: 1 },
				styleFunction: (rowIndex, columnIndex, value) => {
					if (value === 100) return 'showcase2-complete-red';
				}
			},
			{
				dataField: 'start',
				headerText: 'Start Date',
				formatString: 'mm/dd/yyyy',
				dataType: 'date',
				width: 120,
				renderer: {
					type: 'IconRenderer',
					iconWidth: 16,
					iconHeight: 16,
					iconPosition: 'aisleRight',
					iconTableRef: { default: iconDate },
					onClick: () => myGrid.current.openInputer()
				},
				editRenderer: calendarEditRenderer
			},
			{
				dataField: 'end',
				headerText: 'End Date',
				formatString: 'mm/dd/yyyy',
				dataType: 'date',
				width: 120,
				renderer: {
					type: 'IconRenderer',
					iconWidth: 16,
					iconHeight: 16,
					iconPosition: 'aisleRight',
					iconTableRef: { default: iconDate },
					onClick: () => myGrid.current.openInputer()
				},
				editRenderer: calendarEditRenderer
			},
			{
				dataField: 'issue',
				headerText: 'Issues',
				style: 'showcase2-my-left-text'
			}
		],
		[]
	);

	// 생성된 wrapper 참조에 초기화하고, effect가 종료되면 요청/작업을 정리합니다.
	useEffect(() => {
		const grid = myGrid.current;
		const controller = new AbortController();
		loadGridData(grid, controller.signal);
		return () => {
			controller.abort();
		};
	}, []);

	const handleSelect = useCallback((e) => {
		myGrid.current.showItemsOnDepth(Number(e.target.value));
	}, []);

	const handleExpandBtnClick = useCallback(() => {
		const grid = myGrid.current;
		isExpanded ? grid.collapseAll() : grid.expandAll();
		setIsExpanded((prev) => !prev);
	}, [isExpanded]);

	return (
		<div>
			<div className="desc">
				<ExportGridDataView myGrid={myGrid} xlsxProps={{ fileName: '쇼케이스-02' }} pdfProps={{ fileName: '쇼케이스-02' }} />
				<p>프로젝트 일정 관리 테이블을 출력한 모습입니다. ( 계층구조 데이터 표현 )</p>
				<div>
					<button className="btn" onClick={handleExpandBtnClick}>
						모두 열기/닫기
					</button>
					<select onChange={handleSelect} defaultValue="0">
						<option value="0" disabled="disabled">
							-- 특정 계층까지만 보이기 --
						</option>
						{listItems.map(({ text, value }) => (
							<option value={value} key={value}>
								{text}
							</option>
						))}
					</select>
				</div>
			</div>
			<AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default Showcase02;
