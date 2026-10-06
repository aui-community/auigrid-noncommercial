import { useEffect, useRef, useState } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
import FileSaver from 'file-saver';
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import { createDemo, initialView } from './showcase5Model';
import './showcase-workspaces.css';
import './showcase-grid-features.css';

// public 자원은 Vite 배포 경로를 기준으로 읽습니다.
window.saveAs = FileSaver.saveAs;
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function Showcase05() {
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
        <div className="workspace-demo grid-feature-showcase benchmark-showcase">
            <div className="workspace-heading">
                <div>
                    <h2>AI 모델 벤치마크 비교</h2>
                    <p>지표는 세로로, 모델은 가로로. 같은 항목의 수치를 한 줄에서 비교하세요.</p>
                </div>
                <span className="feature-volume">18개 지표 × 4개 모델</span>
            </div>
            <div className="workspace-toolbar">
                <div className="workspace-controls" aria-label="비교 모델 선택">
                    <label>
                        <input
                            type="checkbox"
                            data-model="aster"
                            checked={view.aster}
                            onChange={(event) => demo.setControl('aster', event.target.checked)}
                        />{' '}
                        ASTER 32B
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            data-model="orbit"
                            checked={view.orbit}
                            onChange={(event) => demo.setControl('orbit', event.target.checked)}
                        />{' '}
                        ORBIT 70B
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            data-model="pico"
                            checked={view.pico}
                            onChange={(event) => demo.setControl('pico', event.target.checked)}
                        />{' '}
                        PICO 8B
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            data-model="nova"
                            checked={view.nova}
                            onChange={(event) => demo.setControl('nova', event.target.checked)}
                        />{' '}
                        NOVA 14B
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
                <span>셀 템플릿 / 세로 병합 / 고정 칼럼 / 칼럼 표시 전환</span>
                <span className="benchmark-key">최고값 강조 (동점 포함)</span>
            </div>
            <div className="showcase-grid">
                <AUIGrid ref={myGrid} name="showcase5" columnLayout={demo.columnLayout} gridProps={demo.gridProps} />
            </div>
            <div className="workspace-note">
                <span id="benchmark-status" role="status">
                    {view.status}
                </span>
                <span>모델과 측정값은 기능 설명을 위한 가상 데이터입니다.</span>
            </div>
        </div>
    );
}
