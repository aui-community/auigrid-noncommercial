import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
import FileSaver from 'file-saver';
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit';
import './Showcase08.css';
// 현재 WebDemo 쇼케이스 9을 React 샘플 8번으로 제공합니다.
window.saveAs = FileSaver.saveAs;
const baseUrl = process.env.PUBLIC_URL || '';
// 데이터의 문자가 셀 안에서 HTML 태그로 해석되지 않게 합니다.
function escapeText(value) {
    return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
// 하위 칼럼은 남은 폭을 25%씩 나누고, 좁은 화면에서도 최소 66px을 유지합니다.
// 전체 펼치기에서는 applyRestPercentWidth로 상위 칼럼의 고정 폭을 제외합니다.
const columnLayout = [{
        dataField: 'project', headerText: '프로젝트', bodyCell: true, width: 215,
        style: 'sc-project-cell',
        renderer: {
            type: 'TemplateRenderer',
            // 화면의 번호, 프로젝트명과 ID를 Excel 및 PDF에서는 두 줄의 텍스트로 표시합니다.
            aliasFunction: function (row, col, value, header, item) {
                return item.code + ' ' + value + '\n' + item.id;
            }
        },
        labelFunction: function (row, col, value, header, item) {
            return '<div class="sc-project-label"><span class="sc-project-icon">' + escapeText(item.code) + '</span><span><b>' + escapeText(value) + '</b><small>' + escapeText(item.id) + '</small></span></div>';
        },
        children: [{
                dataField: 'client', headerText: '고객사', bodyCell: true, width: 145, style: 'sc-client-cell',
                children: [
                    { dataField: 'owner', headerText: '담당자', width: '25%', minWidth: 66 },
                    { dataField: 'due', headerText: '목표일', width: '25%', minWidth: 66, dataType: 'date', dateInputFormat: 'yyyy-mm-dd', formatString: 'mm/dd' }
                ]
            }, {
                dataField: 'status', headerText: '진행 상태', bodyCell: true, width: 110,
                renderer: { type: 'TemplateRenderer' },
                labelFunction: function (row, col, value) {
                    const kind = value === '완료' ? 'done' : value === '검토중' ? 'review' : '';
                    return '<span class="sc-status ' + kind + '">' + escapeText(value) + '</span>';
                },
                children: [{
                        dataField: 'progress', headerText: '진행률', width: '25%', minWidth: 66, dataType: 'numeric',
                        renderer: { type: 'TemplateRenderer' },
                        labelFunction: function (row, col, value) {
                            const percent = Math.max(0, Math.min(100, Number(value) || 0));
                            return '<div class="sc-progress"><div class="sc-progress-track"><i style="width:' + percent + '%"></i></div><span>' + percent + '%</span></div>';
                        }
                    }, {
                        dataField: 'budget', headerText: '예산(백만)', width: '25%', minWidth: 66, dataType: 'numeric', formatString: '#,##0'
                    }]
            }]
    }];
const gridProps = {
    bodyLayoutMode: 'band', rowHeight: 122, headerHeight: 28, showRowNumColumn: false,
    rowIdField: 'id', selectionMode: 'singleRow', enableSorting: true, applyRestPercentWidth: true,
    showStateColumn: false,
    width: '100%', height: 430
};
const modeNames = { band: '밴드형', flat: '일반형', flatAll: '전체 펼치기' };
const modeHints = {
    band: '프로젝트와 고객 정보를 위아래로 쌓아 한눈에.',
    flat: '담당자, 일정, 진행률, 예산을 간결하게 비교.',
    flatAll: '상위 필드까지 모두 펼쳐 가로로 비교.'
};
const modes = ['band', 'flat', 'flatAll'];
export default function Showcase08() {
    const myGrid = useRef(null);
    const description = useRef(null);
    const resizeFrame = useRef(0);
    const inputFrame = useRef(0);
    const [availableWidth, setAvailableWidth] = useState(1200);
    // null은 화면 전체 폭을 뜻하며, 좁은 폭을 선택하면 그 값을 화면 안에서 유지합니다.
    const [requestedWidth, setRequestedWidth] = useState(null);
    const [automatic, setAutomatic] = useState(true);
    const [manualMode, setManualMode] = useState('band');
    const width = Math.min(requestedWidth ?? availableWidth, availableWidth);
    const mode = automatic ? (width < 600 ? 'band' : width < 920 ? 'flat' : 'flatAll') : manualMode;
    // 메뉴와 창 크기 변경을 관찰합니다. 연속 입력은 프레임당 한 번만 반영합니다.
    useLayoutEffect(() => {
        const measure = () => {
            const available = Math.floor(description.current?.clientWidth ?? 0);
            if (available > 0)
                setAvailableWidth(available);
        };
        const observer = new ResizeObserver(() => {
            cancelAnimationFrame(resizeFrame.current);
            resizeFrame.current = requestAnimationFrame(measure);
        });
        if (description.current)
            observer.observe(description.current);
        measure();
        return () => {
            observer.disconnect();
            cancelAnimationFrame(resizeFrame.current);
            cancelAnimationFrame(inputFrame.current);
        };
    }, []);
    // 슬라이더의 폭이 반영되면 표시 구조를 전환하고 그리드의 크기를 갱신합니다.
    useLayoutEffect(() => {
        const grid = myGrid.current;
        if (!grid || !width)
            return;
        if (grid.getProp('bodyLayoutMode') !== mode) {
            grid.setProp({ bodyLayoutMode: mode, rowHeight: mode === 'band' ? 122 : 52 });
            grid.refresh();
        }
        grid.resize();
    }, [mode, width]);
    // 늦게 도착한 응답이 이전 화면의 그리드를 변경하지 않도록 요청을 취소합니다.
    useEffect(() => {
        const grid = myGrid.current;
        const controller = new AbortController();
        grid.showAjaxLoader();
        async function loadProjects() {
            try {
                const response = await fetch(`${baseUrl}/data/showcase8.json`, { signal: controller.signal });
                if (!response.ok)
                    throw new Error('데이터 요청 실패');
                const rows = await response.json();
                if (controller.signal.aborted)
                    return;
                grid.setGridData(rows);
            }
            catch (error) {
                if (!controller.signal.aborted)
                    alert('프로젝트 데이터를 불러오지 못했습니다. 페이지를 새로고침해 주세요.');
            }
            finally {
                if (!controller.signal.aborted)
                    grid.removeAjaxLoader();
            }
        }
        loadProjects();
        return () => controller.abort();
    }, []);
    function changeWidth(value) {
        cancelAnimationFrame(inputFrame.current);
        inputFrame.current = requestAnimationFrame(() => {
            setRequestedWidth(value === availableWidth ? null : value);
            setAutomatic(true);
        });
    }
    function changeLayout(value) {
        setManualMode(value);
        setAutomatic(false);
    }
    function exportExcel() {
        myGrid.current?.exportToXlsx({ fileName: '프로젝트_현황', sheetName: '프로젝트 현황' });
    }
    function exportPdf() {
        // 전체 펼치기의 프로젝트명과 ID가 잘리지 않도록 PDF 행 높이를 지정합니다.
        myGrid.current?.exportToPdf({ fileName: '프로젝트_현황', fontPath: `${baseUrl}/fonts/nyjgothic-medium.ttf`,
            orientation: 'landscape', ...(mode === 'flatAll' ? { rowHeight: 52 } : {}) });
    }
    return (<div>
            <div className="desc" ref={description}>
                <p>슬라이더로 폭을 줄이거나 넓혀 반응형 레이아웃을 확인해 보세요.</p>
                <p>좁은 화면은 밴드형, 중간 화면은 일반형, 넓은 화면은 전체 펼치기로 실시간 전환됩니다.</p>
                <div className="showcase8-width">
                    <label htmlFor="showcase8-width">그리드 폭</label>
                    <input id="showcase8-width" type="range" min={Math.min(320, availableWidth)} max={availableWidth} step="1" value={width} onChange={event => changeWidth(Number(event.target.value))}/>
                    <output htmlFor="showcase8-width">{width} px</output>
                </div>
                <p className="showcase8-controls">
                    {modes.map(value => <button key={value} aria-pressed={mode === value} onClick={() => changeLayout(value)}>{modeNames[value]}</button>)}
                    <button aria-pressed={automatic} onClick={() => { setManualMode(mode); setAutomatic(!automatic); }}>화면에 맞게</button>
                </p>
                <p className="showcase8-controls"><button onClick={exportExcel}>Excel 내보내기</button><button onClick={exportPdf}>PDF 내보내기</button></p>
                <p>{modeHints[mode]} ({automatic ? '자동 전환' : '직접 선택'} / {modeNames[mode]})</p>
            </div>
            <div className="showcase8-preview" style={{ maxWidth: width }}>
                <AUIGrid ref={myGrid} name="showcase8" gridProps={gridProps} columnLayout={columnLayout} autoResize={false}/>
            </div>
        </div>);
}
