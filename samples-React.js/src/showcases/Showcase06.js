import { useEffect, useRef, useState } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
import FileSaver from 'file-saver';
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import { createDemo, initialView } from './showcase6Model';
import './showcase-workspaces.css';
import './showcase-grid-features.css';

// public 자원은 Vite 배포 경로를 기준으로 읽습니다.
window.saveAs = FileSaver.saveAs;
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function Showcase06() {
    const myGrid = useRef(null);
    const [view, setView] = useState(initialView);
    // 데이터와 칼럼 정의는 인스턴스별로 만들고 React가 조작 UI를 갱신합니다.
    const [demo] = useState(() => createDemo(setView, baseUrl));
    useEffect(() => {
        demo.attach(myGrid.current);
        // StrictMode의 재연결에서도 이벤트와 타이머가 중복되지 않게 정리합니다.
        return () => demo.detach();
    }, [demo]);
    return (
        <div className="workspace-demo grid-feature-showcase revision-showcase">
            <div className="workspace-heading">
                <div>
                    <h2>설계 변경 전후 대조표</h2>
                    <p>부품은 세로로 묶고, 바뀌지 않은 값은 가로로 합쳐 변경 지점만 선명하게 보여줍니다.</p>
                </div>
                <span className="feature-volume">75개 부품 / 300개 비교 항목</span>
            </div>
            <div className="workspace-toolbar">
                <div className="workspace-controls">
                    <input
                        id="revision-search"
                        className="workspace-search"
                        type="search"
                        placeholder="부품 번호 또는 이름 검색"
                        aria-label="부품 검색"
                        value={view.query}
                        onChange={(event) => demo.setControl('query', event.target.value)}
                    />
                    <label>
                        <input
                            id="changes-only"
                            type="checkbox"
                            checked={view.changesOnly}
                            onChange={(event) => demo.setControl('changesOnly', event.target.checked)}
                        />{' '}
                        변경 항목만
                    </label>
                    <label>
                        <input
                            id="merge-cells"
                            type="checkbox"
                            checked={view.merge}
                            onChange={(event) => demo.setControl('merge', event.target.checked)}
                        />{' '}
                        셀 병합
                    </label>
                </div>
                <div className="workspace-controls">
                    <button type="button" className="btn" onClick={() => demo.exportReport('xlsx')}>
                        Excel 내보내기
                    </button>
                    <button type="button" className="btn" onClick={() => demo.exportReport('pdf')}>
                        PDF 내보내기
                    </button>
                </div>
            </div>
            <div className="comparison-caption">
                <span>가로 및 세로 병합 / 조건부 서식 / 필터 / 체크박스</span>
                <span className="revision-legend">
                    <i className="revision-before-key"></i>변경 전<i className="revision-after-key"></i>변경 후
                </span>
            </div>
            <div className="showcase-grid">
                <AUIGrid ref={myGrid} name="showcase6" columnLayout={demo.columnLayout} gridProps={demo.gridProps} />
            </div>
            <div className="workspace-note">
                <span id="revision-status" role="status">
                    {view.status}
                </span>
                <span>가상의 설계 변경 자료입니다. 검토 체크는 현재 페이지에서만 유지됩니다.</span>
            </div>
        </div>
    );
}
