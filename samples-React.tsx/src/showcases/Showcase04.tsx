import { useEffect, useRef, useState } from 'react';
import AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import FileSaver from 'file-saver';
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import { createDemo, initialView } from './showcase4Model';
import './showcase-workspaces.css';

import './Showcase04.css';
// public 자원은 Vite 배포 경로를 기준으로 읽습니다.
window.saveAs = FileSaver.saveAs;
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function Showcase04() {
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
        <div className="live-demo">
            <div className="live-heading">
                <div>
                    <h2>서비스 운영 현황</h2>
                    <p>가상 서비스의 운영 지표를 실시간으로 모니터링합니다.</p>
                </div>
                <span id="live-state" className="live-stream" role="status" data-paused={view.paused}>
                    {view.state}
                </span>
            </div>
            <dl className="live-summary" aria-label="서비스 운영 요약">
                <div className="live-metric">
                    <dt>정상 서비스</dt>
                    <dd>
                        <strong id="live-healthy" className="live-value">
                            {view.healthy}
                        </strong>
                        <span id="live-total" className="live-unit">
                            {view.total}
                        </span>
                        <span className="live-caption">현재 수신 상태 기준</span>
                    </dd>
                </div>
                <div className="live-metric">
                    <dt>처리 요청</dt>
                    <dd>
                        <strong id="live-requests" className="live-value">
                            {view.requests}
                        </strong>
                        <span className="live-unit">/초</span>
                        <span className="live-caption">전체 서비스 합계</span>
                    </dd>
                </div>
                <div className="live-metric">
                    <dt>평균 응답 시간</dt>
                    <dd>
                        <strong id="live-latency" className="live-value">
                            {view.latency}
                        </strong>
                        <span className="live-unit">ms</span>
                        <span className="live-caption">요청량 기준 가중 평균</span>
                    </dd>
                </div>
                <div id="live-attention-card" className="live-metric live-attention" data-active={view.attentionActive}>
                    <dt>확인 필요</dt>
                    <dd>
                        <strong id="live-attention" className="live-value">
                            {view.attention}
                        </strong>
                        <span className="live-unit">개</span>
                        <span className="live-caption">주의 또는 응답 지연</span>
                    </dd>
                </div>
            </dl>
            <div className="live-toolbar">
                <div className="live-grid-title">
                    <h3>서비스별 상태</h3>
                    <span>요청 추이: 최근 12회 측정</span>
                </div>
                <div className="live-controls" role="group" aria-label="실시간 갱신 설정">
                    <label>
                        트래픽
                        <select
                            id="live-traffic"
                            value={view.traffic}
                            onChange={(event) => demo.setControl('traffic', event.target.value)}
                        >
                            <option value="normal">평시</option>
                            <option value="peak">증가</option>
                        </select>
                    </label>
                    <label>
                        갱신 주기
                        <select
                            id="live-interval"
                            value={view.interval}
                            onChange={(event) => demo.setControl('interval', event.target.value)}
                        >
                            <option value="500">0.5초</option>
                            <option value="1000">1초</option>
                            <option value="2000">2초</option>
                        </select>
                    </label>
                    <button type="button" className="btn" id="live-toggle" onClick={() => demo.toggleUpdates()}>
                        {view.toggle}
                    </button>
                    <button
                        type="button"
                        className="btn"
                        id="live-step"
                        disabled={view.stepDisabled}
                        onClick={() => demo.refreshRows()}
                    >
                        한 번 갱신
                    </button>
                </div>
            </div>
            <div className="showcase-grid">
                <AUIGrid ref={myGrid} name="showcase4" columnLayout={demo.columnLayout} gridProps={demo.gridProps} />
            </div>
            <div className="live-footnote">
                <p>
                    <span className="live-key" aria-hidden="true"></span>
                    <span id="live-updated">{view.updated}</span> / 마지막 수신{' '}
                    <time id="live-last-update" dateTime={view.dateTime}>
                        {view.time}
                    </time>
                </p>
                <p>모의 데이터이며 외부 서버에 연결하지 않습니다.</p>
            </div>
            <div className="desc_bottom">
                <p>
                    <code>refreshRows()</code>로 변경된 행만 갱신하며, 선택한 행과 현재 화면을 유지합니다.
                </p>
            </div>
        </div>
    );
}
