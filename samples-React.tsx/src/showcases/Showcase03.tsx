import { useEffect, useRef, useState } from 'react';
import AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import FileSaver from 'file-saver';
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import { createDemo, initialView } from './showcase3Model';
import './showcase-workspaces.css';

// public 자원은 Vite 배포 경로를 기준으로 읽습니다.
window.saveAs = FileSaver.saveAs;
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function Showcase03() {
    const myGrid = useRef<AUIGrid>(null);
    const [view, setView] = useState(initialView);
    // 데이터와 칼럼 정의는 인스턴스별로 만들고 React가 조작 UI를 갱신합니다.
    const [demo] = useState(() => createDemo(setView, baseUrl));
    useEffect(() => {
        demo.attach(myGrid.current!);
        // StrictMode의 재연결에서도 이벤트와 타이머가 중복되지 않게 정리합니다.
        return () => demo.detach();
    }, [demo]);
    return (
        <div className="workspace-demo energy-report">
            <div className="energy-masthead">
                <div>
                    <div id="energy-report-period" className="energy-period">
                        {view.reportPeriod}
                    </div>
                    <h2>재생에너지 월별 성과 리포트</h2>
                    <p>발전량과 목표를 함께 읽고, 색상으로 월별 달성률을 비교하세요.</p>
                </div>
                <div className="energy-total">
                    {' '}
                    기간 발전량<strong id="energy-total">{view.total}</strong>
                    <small id="energy-achievement">{view.achievement}</small>
                </div>
            </div>
            <div className="workspace-toolbar">
                <div className="workspace-controls">
                    <label>
                        기간
                        <select
                            id="energy-period"
                            value={view.period}
                            onChange={(event) => demo.setControl('period', event.target.value)}
                        >
                            <option value="1">1~6월</option>
                            <option value="4">4~9월</option>
                        </select>
                    </label>
                    <label>
                        권역
                        <select
                            id="energy-region"
                            value={view.region}
                            onChange={(event) => demo.setControl('region', event.target.value)}
                        >
                            <option>전체</option>
                            <option>호남</option>
                            <option>영남</option>
                            <option>강원</option>
                            <option>제주</option>
                        </select>
                    </label>
                    <label>
                        발전원
                        <select
                            id="energy-source"
                            value={view.source}
                            onChange={(event) => demo.setControl('source', event.target.value)}
                        >
                            <option>전체</option>
                            <option>태양광</option>
                            <option>풍력</option>
                        </select>
                    </label>
                </div>
                <div className="workspace-controls">
                    <button className="btn" type="button" onClick={() => demo.exportReport('xlsx')}>
                        Excel 내보내기
                    </button>
                    <button className="btn" type="button" onClick={() => demo.exportReport('pdf')}>
                        PDF 내보내기
                    </button>
                </div>
            </div>
            <div className="energy-options">
                <span id="energy-count">{view.count}</span>
                <div className="energy-views" aria-label="리포트 표시 지표">
                    <button
                        type="button"
                        data-report-view="all"
                        aria-pressed={!view.rateOnly}
                        onClick={() => demo.setReportView(false)}
                    >
                        {' '}
                        전체 지표
                    </button>
                    <button
                        type="button"
                        data-report-view="rate"
                        aria-pressed={view.rateOnly}
                        onClick={() => demo.setReportView(true)}
                    >
                        {' '}
                        달성률만{' '}
                    </button>
                </div>
            </div>
            <div className="energy-legend">
                <span>달성률</span>
                <span>
                    <i style={{ background: '#fcf0dd' }}></i>95% 미만
                </span>
                <span>
                    <i style={{ background: '#edf4fb' }}></i>95~100% 미만
                </span>
                <span>
                    <i style={{ background: '#def1ea' }}></i>100% 이상
                </span>
            </div>
            <div className="showcase-grid">
                <AUIGrid ref={myGrid} name="showcase3" columnLayout={demo.columnLayout} gridProps={demo.gridProps} />
            </div>
            <div className="workspace-note">
                <p>누계 달성률 = 기간 발전량 합계 ÷ 기간 목표 합계 × 100</p>
                <p>가상 발전 데이터 / MWh, %</p>
            </div>
        </div>
    );
}
