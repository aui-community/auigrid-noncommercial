import { useEffect, useRef, useState } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
import FileSaver from 'file-saver';
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import { createDemo, initialView } from './showcase2Model';
import './showcase-workspaces.css';

// public 자원은 Vite 배포 경로를 기준으로 읽습니다.
window.saveAs = FileSaver.saveAs;
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function Showcase02() {
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
        <div className="workspace-demo bom-workspace">
            <div className="workspace-heading">
                <div>
                    <h2>자율주행 로봇 BOM 원가 시뮬레이터</h2>
                    <p>제품 20개, 조립체 80개, 부품 320개. 부품 단가와 투입 수량을 바꾸며 원가를 검토하세요.</p>
                </div>
            </div>
            <div className="bom-summary">
                <div>
                    <span>선택 제품 / 1대 기준</span>
                    <h3 id="bom-product">{view.product}</h3>
                    <small id="bom-lead">{view.lead}</small>
                </div>
                <div className="bom-total">
                    <span>자재 원가</span>
                    <strong id="bom-cost">{view.cost}</strong>
                </div>
            </div>
            <div className="workspace-toolbar">
                <div className="workspace-controls">
                    <label>
                        구성 보기
                        <select
                            id="bom-depth"
                            value={view.depth}
                            onChange={(event) => demo.setControl('depth', event.target.value)}
                        >
                            <option value="all">부품까지</option>
                            <option value="2">조립체까지</option>
                            <option value="1">제품만</option>
                        </select>
                    </label>
                    <span id="bom-visible">{view.visible}</span>
                    <button type="button" className="btn" onClick={() => demo.resetCosts()}>
                        입력 초기화
                    </button>
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
            <div className="showcase-grid">
                <AUIGrid ref={myGrid} name="showcase2" columnLayout={demo.columnLayout} gridProps={demo.gridProps} />
            </div>
            <div className="workspace-note">
                <p>파란 수량과 단가를 더블클릭하거나 F2로 편집하세요. 상위 금액은 자동 합산됩니다.</p>
                <p>가상 BOM / 부품 비용만 반영, 가공비 및 세금 제외</p>
            </div>
        </div>
    );
}
