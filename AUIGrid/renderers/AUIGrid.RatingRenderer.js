/*!
 * AUIGrid Non-Commercial v3.0.20.2 - 별점 평가 렌더러 예제
 * Copyright (c) AUISoft Co., Ltd. All rights reserved.
 *
 * AUIGrid 예제 파일입니다. AUIGrid 사용권 범위 안에서 이 파일을 복사하거나 수정하여 사용할 수 있습니다.
 * 이 허용은 이 예제 파일에만 적용되며 AUIGrid.js에는 적용되지 않습니다.
 * This is an AUIGrid sample file. You may copy and modify it for use with AUIGrid within the
 * scope of your AUIGrid license. This permission applies only to this sample file, not to AUIGrid.js.
 * License: https://github.com/aui-community/auigrid-noncommercial/blob/main/LICENSE
 */
/*
 * AUIGrid 사용자 정의 렌더러 - 별점 평가
 *
 * 숫자 1~5를 별 다섯 개로 표시합니다. 값이 없으면 빈 별로 표시합니다.
 * AUIGrid.js 다음에 이 파일과 AUIGrid.RatingRenderer.css를 연결합니다.
 * renderer: { type: "CustomRenderer", jsClass: AUIGrid.RatingRenderer }
 * 전체 사용 예: renderer_custom_status.html, 문서 8. 사용자 정의 렌더러 만들기
 */
window.AUIGrid.RatingRenderer = window.AUIGrid.Class({
    tagName: "div",
    cssClass: "aui-grid-renderer-base aui-rating-renderer",
    __filled: null,
    __empty: null,

    // 셀이 재사용되므로 별을 담을 요소는 한 번 만들고 표시 값만 갱신합니다.
    update: function () {
        if (!this.__filled) {
            this.__filled = document.createElement("span");
            this.__empty = document.createElement("span");
            this.__filled.className = "aui-rating-filled";
            this.__empty.className = "aui-rating-empty";
            this.element.append(this.__filled, this.__empty);
            this.element.setAttribute("role", "img");
        }
        // 데이터가 아직 없는 초기 셀도 빈 별로 표시합니다.
        const value = this.data ? Number(this.data[this.dataField]) : 0;
        const score = Number.isInteger(value) && value >= 1 && value <= 5 ? value : 0;
        this.__filled.textContent = "★".repeat(score);
        this.__empty.textContent = "☆".repeat(5 - score);
        this.element.setAttribute("aria-label", score ? "5점 만점에 " + score + "점" : "미평가");
        this.setHeight(this.rowHeight - 2);
    },

    // 직접 보관한 DOM 참조를 해제합니다.
    destroy: function (unload) {
        this.__filled = this.__empty = null;
        this.$super.destroy(unload);
    }
}).extend(window.AUIGrid.RendererBase);
