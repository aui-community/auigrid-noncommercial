import { useEffect, useRef, useState } from 'react';
import AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import FileSaver from 'file-saver';
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import { createDemo, initialView } from './showcase1Model';
import './showcase-workspaces.css';

// public 자원은 Vite 배포 경로를 기준으로 읽습니다.
window.saveAs = FileSaver.saveAs;
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function Showcase01() {
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
        <div className="workspace-demo resource-planner">
            <div className="workspace-heading">
                <div>
                    <h2>산업 장비 자원 운영표</h2>
                    <p>600개 장비의 날짜별 가동, 예약과 점검 일정을 한눈에 관리하세요.</p>
                </div>
                <strong className="resource-month">2026년 10월</strong>
            </div>
            <div className="workspace-toolbar">
                <div className="workspace-controls">
                    <label>
                        거점
                        <select
                            id="resource-site"
                            value={view.site}
                            onChange={(event) => demo.setControl('site', event.target.value)}
                        >
                            <option>전체</option>
                            <option>수도권 센터</option>
                            <option>중부 센터</option>
                            <option>남부 센터</option>
                            <option>동부 센터</option>
                            <option>서부 센터</option>
                        </select>
                    </label>
                    <label>
                        자원 종류
                        <select
                            id="resource-type"
                            value={view.category}
                            onChange={(event) => demo.setControl('category', event.target.value)}
                        >
                            <option>전체</option>
                            <option>자율이동 로봇</option>
                            <option>무인 운반차</option>
                            <option>전동 지게차</option>
                            <option>3D 프린터</option>
                            <option>정밀 측정기</option>
                            <option>비전 검사기</option>
                        </select>
                    </label>
                    <input
                        type="search"
                        id="resource-search"
                        className="workspace-search"
                        placeholder="자원명 또는 번호 검색"
                        aria-label="자원 검색"
                        value={view.query}
                        onChange={(event) => demo.setControl('query', event.target.value)}
                    />
                </div>
                <span id="resource-count">{view.count}</span>
            </div>
            <div className="resource-legend" aria-label="운영 상태 범례">
                <span className="resource-active">가동</span>
                <span className="resource-reserved">예약</span>
                <span className="resource-maintenance">점검</span>
                <span className="resource-idle">유휴</span>
                <small>날짜를 더블클릭해 상태를 변경하세요. 집계는 자동 계산됩니다.</small>
            </div>
            <div className="workspace-toolbar">
                <div className="workspace-controls">
                    <select
                        id="resource-state"
                        aria-label="범위에 적용할 상태"
                        value={view.state}
                        onChange={(event) => demo.setControl('state', event.target.value)}
                    >
                        <option>가동</option>
                        <option>예약</option>
                        <option>점검</option>
                        <option>유휴</option>
                    </select>
                    <button type="button" className="btn" onClick={() => demo.applyState()}>
                        선택 날짜에 적용
                    </button>
                    <button
                        type="button"
                        className="btn"
                        id="resource-undo"
                        disabled={view.undoDisabled}
                        onClick={() => demo.undoResource()}
                    >
                        {' '}
                        실행 취소{' '}
                    </button>
                </div>
                <div className="workspace-controls">
                    <button type="button" className="btn" onClick={() => demo.addResource()}>
                        자원 추가
                    </button>
                    <button type="button" className="btn" onClick={() => demo.removeResource()}>
                        선택 삭제
                    </button>
                    <button type="button" className="btn" onClick={() => demo.exportReport('xlsx')}>
                        Excel 내보내기
                    </button>
                    <button type="button" className="btn" onClick={() => demo.exportReport('pdf')}>
                        PDF 내보내기
                    </button>
                </div>
            </div>
            <div className="showcase-grid">
                <AUIGrid ref={myGrid} name="showcase1" columnLayout={demo.columnLayout} gridProps={demo.gridProps} />
            </div>
            <div className="workspace-note">
                <p id="resource-message" role="status">
                    {view.message}
                </p>
                <p>가상 자원 데이터 / 가동률 = 가동 일수 ÷ 31일</p>
            </div>
        </div>
    );
}
