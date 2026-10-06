import { useEffect, useRef, useState } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import FileSaver from 'file-saver';
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit';
import './SampleBandBody.css';

// 파일 저장 도구와 한글 PDF 글꼴의 기준 경로를 연결합니다.
window.saveAs = FileSaver.saveAs;
// 배포 하위 경로에서도 public의 데이터와 이미지에 접근하도록 끝 슬래시를 정리합니다.
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

// 레이아웃 모드는 aui-grid의 공식 속성 타입에서 가져옵니다.
type LayoutMode = NonNullable<IGrid.Props['bodyLayoutMode']>;
type BodyField = 'team' | 'position' | 'checked';

// WebDemo와 같은 계층을 사용하고 bodyCell의 초기값은 명시적으로 지정합니다.
const columnLayout: IGrid.Column[] = [
    {
        dataField: "id",
        headerText: "ID",
        width: 70,
        editable: false
    },
    {
        dataField: "team",
        headerText: "소속",
        bodyCell: true, // team(소속)도 바디에 출력
        style: "band-basic-team",
        children: [
            {
                dataField: "name",
                headerText: "이름",
                width: 130
            },
            {
                dataField: "position",
                headerText: "직급",
                bodyCell: true,
                children: [
                    {
                        dataField: "age",
                        headerText: "나이",
                        width: 70,
                        dataType: "numeric"
                    },
                    {
                        dataField: "birth",
                        headerText: "생년월일",
                        width: 120,
                        dataType: "date",
                        dateInputFormat: "yyyy-mm-dd",
                        formatString: "yyyy/mm/dd"
                    }
                ]
            }
        ]
    },
    {
        // 확인은 출력용 상위 셀입니다. 자식 수량과 금액은 아래쪽에 나란히 표시합니다.
        dataField: "checked",
        headerText: "확인",
        bodyCell: true,
        editable: false,
        renderer: { type: IGrid.RendererKind.CheckBoxEditRenderer },
        children: [
            {
                dataField: "qty",
                headerText: "수량",
                width: 95,
                dataType: "numeric"
            },
            {
                dataField: "amount",
                headerText: "금액",
                width: 120,
                dataType: "numeric",
                formatString: "#,##0",
                style: "band-basic-number"
            }
        ]
    }
];

const gridProps: IGrid.Props = {
    width: '100%', height: 480,
    bodyLayoutMode: 'band', // 밴드형 바디 레이아웃 설정
    rowHeight: 120, // 행 높이 지정. (밴드형에 맞게 지정)
    editable: true, selectionMode: 'multipleCells'
};
const bodyFields: { field: BodyField; label: string }[] = [
    { field: 'team', label: '소속' },
    { field: 'position', label: '직급' },
    { field: 'checked', label: '확인' }
];

export default function SampleBandBody() {
    const myGrid = useRef<AUIGrid>(null);
    const [mode, setMode] = useState<LayoutMode>('band');
    const [bodyCells, setBodyCells] = useState({ team: true, position: true, checked: true });

    // WebDemo의 정적 JSON을 사용하며, 화면을 떠나면 진행 중인 요청을 취소합니다.
    useEffect(() => {
        const grid = myGrid.current!;
        const controller = new AbortController();
        grid.showAjaxLoader();
        async function requestGridData() {
            try {
                const response = await fetch(`${baseUrl}/data/band_body.json`, { signal: controller.signal });
                if (!response.ok) throw new Error('데이터 요청 실패');
                const rows = await response.json();
                if (!controller.signal.aborted) grid.setGridData(rows);
            } catch (error) {
                if (!controller.signal.aborted) alert('데이터를 불러오지 못했습니다. 페이지를 새로고침해 주세요.');
            } finally {
                if (!controller.signal.aborted) grid.removeAjaxLoader();
            }
        }
        requestGridData();
        return () => controller.abort();
    }, []);

    // 바뀐 체크값을 먼저 받은 뒤 해당 상위 칼럼의 바디 표시 여부만 변경합니다.
    function changeBodyCell(field: BodyField, show: boolean) {
        const props: IGrid.Column = { bodyCell: show };
        myGrid.current?.setColumnPropByDataField(field, props);
        myGrid.current?.refresh();
        setBodyCells(current => ({ ...current, [field]: show }));
    }
    // 그리드를 재생성하거나 데이터를 다시 넣지 않고 표시 구조와 행 높이만 바꿉니다.
    function changeBodyMode(value: LayoutMode) {
        myGrid.current?.setProp({ bodyLayoutMode: value, rowHeight: value === 'band' ? 120 : 30 });
        myGrid.current?.refresh();
        setMode(value);
    }
    // 현재 레이아웃, 편집한 데이터와 셀 스타일을 그대로 Excel로 내보냅니다.
    function exportExcel() {
        myGrid.current?.exportToXlsx({
            fileName: '밴드형_바디_레이아웃',
            sheetName: '밴드형 바디 레이아웃',
            exportWithStyle: true
        });
    }
    // 한글 글꼴과 가로 용지를 사용하여 현재 레이아웃을 PDF로 내보냅니다.
    function exportPdf() {
        myGrid.current?.exportToPdf({
            fileName: '밴드형_바디_레이아웃',
            fontPath: `${baseUrl}/fonts/nyjgothic-medium.ttf`,
            orientation: 'landscape'
        });
    }
    return (
        <div>
            <div className="desc">
                <p>한 행의 데이터를 그룹형 헤더에서 정의한 구조대로 바디에도 표현합니다.</p>
                <p>bodyLayoutMode: "band" 설정 그리고 원하는 크기의 rowHeight를 설정하십시오. (데모는 rowHeight: 120 설정)</p>
                <p>칼럼 레이아웃을 정의할 때 그룹형 헤더는 dataField 설정만으로 해당 값을 표시하지 않습니다. (헤더의 그룹만 형성함)</p>
                <p>bodyLayoutMode: "band" 설정과 그룹형 헤더 칼럼에 dataField: "team", bodyCell: true를 지정하면 소속(team) 값도 칼럼 레이아웃 구조와 동일하게 바디에 표시됩니다.</p>
                <p>밴드형에서 체크를 해제하면 해당 상위 바디 셀만 숨깁니다. 전체 칼럼 보기에서는 bodyCell 설정과 관계없이 표시합니다.</p>
                <p className="band-basic-controls"><strong>상위 바디 셀 표시: </strong>
                    {bodyFields.map(({ field, label }) => <label key={field}>
                        <input type="checkbox" checked={bodyCells[field]} disabled={mode !== 'band'} onChange={event => changeBodyCell(field, event.target.checked)} /> {label}
                    </label>)}
                </p>
                <p>setProp()으로 bodyLayoutMode를 바꾸고 refresh()로 적용합니다. 행 높이는 별도로 설정합니다.</p>
                <p className="band-basic-modes">
                    <button aria-pressed={mode === 'flat'} onClick={() => changeBodyMode('flat')}>기본(flat) 보기</button>
                    <button aria-pressed={mode === 'band'} onClick={() => changeBodyMode('band')}>밴드형(band) 보기</button>
                    <button aria-pressed={mode === 'flatAll'} onClick={() => changeBodyMode('flatAll')}>전체 칼럼 펼쳐서(flatAll) 보기</button>
                </p>
                <p className="band-basic-exports">
                    <button onClick={exportExcel}>Excel 내보내기</button>
                    <button onClick={exportPdf}>PDF 내보내기</button>
                </p>
            </div>
            <AUIGrid ref={myGrid} name="band-basic" gridProps={gridProps} columnLayout={columnLayout} />
        </div>
    );
}
