import { useEffect, useRef, useState } from 'react';
import AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import FileSaver from 'file-saver';
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit';
import { createPurchaseDemo, filters, gridProps, initialView, Layout, Status } from './purchaseDemo';
import './Showcase07.css';
import './showcase-options.css';

window.saveAs = FileSaver.saveAs;
// 배포 하위 경로에서도 public의 데이터와 이미지에 접근하도록 끝 슬래시를 정리합니다.
var baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

// WebDemo와 같은 설명, 선택 메뉴, 그리드 및 하단 정보 순서로 표시합니다.
export default function Showcase07() {
    var myGrid = useRef<AUIGrid>(null);
    var dialog = useRef<HTMLDialogElement>(null);
    var [view, setView] = useState(initialView);
    var [demo] = useState(function () {
        return createPurchaseDemo(setView, baseUrl);
    });
    useEffect(
        function () {
            demo.attach(myGrid.current!);
            return function () {
                demo.detach();
            };
        },
        [demo]
    );
    // 대화상자는 셀 밖에 두고 React 상태와 네이티브 닫기 동작을 함께 정리합니다.
    useEffect(
        function () {
            if (view.dialog && !dialog.current?.open) dialog.current?.showModal();
            else if (!view.dialog && dialog.current?.open) dialog.current.close();
        },
        [view.dialog]
    );
    function actOnDialog(action: string) {
        dialog.current?.close();
        demo.actOnDialog(action);
    }
    // 첨부파일을 누르는 시점에도 현재 열려 있는 요청을 확인합니다.
    function openFile(value: number) {
        var detail = view.dialog;
        if (detail) demo.handleAction({ id: detail.id, action: 'file', value: value });
    }
    var detail = view.dialog;
    return (
        <div className="showcase7-demo">
            <div className="desc">
                <p>
                    밴드형 바디 레이아웃과 사용자 정의 렌더러(CustomRenderer)로 요청자, 결재 단계, 첨부파일과 납기
                    상태를 표시합니다.
                </p>
                <p>헤더를 눌러 정렬하고 필터 아이콘으로 검색할 수 있습니다.</p>
                <div className="demo-options">
                    <div className="demo-option-row demo-option-row--split">
                        <div className="demo-option-group">
                            <label>
                                <span className="demo-option-label">진행 상태</span>
                                <select
                                    id="showcase7-status"
                                    value={view.status}
                                    onChange={(event) => demo.setStatus(event.target.value as Status)}
                                >
                                    {filters.map((filter) => (
                                        <option key={filter.value} value={filter.value}>
                                            {filter.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                <span className="demo-option-label">셀 배치</span>
                                <select
                                    id="showcase7-layout"
                                    value={view.mode}
                                    onChange={(event) => demo.setLayout(event.target.value as Layout)}
                                >
                                    <option value="band">밴드형</option>
                                    <option value="flatAll">일반형</option>
                                </select>
                            </label>
                            <button type="button" className="btn" onClick={demo.clearGridView}>
                                정렬 및 필터 해제
                            </button>
                        </div>
                        <div className="demo-option-group" role="group" aria-label="내보내기">
                            <button type="button" className="btn" disabled={!view.count} onClick={demo.exportExcel}>
                                엑셀(xlsx)로 저장
                            </button>
                            <button type="button" className="btn" disabled={!view.count} onClick={demo.exportPdf}>
                                PDF로 저장
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <AUIGrid ref={myGrid} name="showcase7" gridProps={gridProps} columnLayout={demo.columns} />
            </div>
            <div className="desc_bottom">
                <div className="purchase-summary">
                    <div className="purchase-legend" aria-label="결재 단계 안내">
                        <span>
                            <span className="purchase-legend-marker" data-state="done" aria-hidden="true">
                                ✓
                            </span>
                            완료
                        </span>
                        <span>
                            <span className="purchase-legend-marker" data-state="current" aria-hidden="true"></span>현재
                            단계
                        </span>
                        <span>
                            <span className="purchase-legend-marker" data-state="rejected" aria-hidden="true">
                                !
                            </span>
                            반려
                        </span>
                        <span>
                            <span className="purchase-legend-marker" aria-hidden="true"></span>대기
                        </span>
                    </div>
                    <span className="purchase-layout-note">일반형과 밴드형에 같은 렌더러를 사용합니다.</span>
                </div>
                <p aria-live="polite">
                    {
                        filters.find(function (filter) {
                            return filter.value === view.status;
                        })?.label
                    }{' '}
                    {view.count}건 / {view.total}건
                </p>
            </div>
            <dialog
                ref={dialog}
                className="request-dialog"
                aria-label={detail?.title || '구매 요청 상세'}
                onCancel={demo.closeDialog}
                onClose={demo.closeDialog}
            >
                {detail && (
                    <>
                        <p>
                            <strong>{detail.title}</strong>
                        </p>
                        <div>
                            {detail.files.map(function (file, value) {
                                return (
                                    <button
                                        type="button"
                                        key={file.name}
                                        className="btn"
                                        onClick={function () {
                                            openFile(value);
                                        }}
                                    >
                                        {file.name}
                                    </button>
                                );
                            })}
                            {detail.facts.map(function ([name, value]) {
                                return (
                                    <p key={name}>
                                        {name} : {value}
                                    </p>
                                );
                            })}
                        </div>
                        <p style={{ textAlign: 'right' }}>
                            <button
                                type="button"
                                className="btn"
                                hidden={!detail.editable}
                                disabled={detail.completed || detail.rejected}
                                onClick={function () {
                                    actOnDialog('reject');
                                }}
                            >
                                반려 처리
                            </button>{' '}
                            <button
                                type="button"
                                className="btn"
                                hidden={!detail.editable}
                                disabled={detail.completed}
                                onClick={function () {
                                    actOnDialog('advance');
                                }}
                            >
                                {detail.advanceLabel}
                            </button>{' '}
                            <button type="button" className="btn" onClick={demo.closeDialog}>
                                닫기
                            </button>
                        </p>
                    </>
                )}
            </dialog>
        </div>
    );
}
