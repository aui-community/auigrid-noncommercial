/*!
 * AUIGrid Non-Commercial v3.0.20.2 - 별점 선택 편집 렌더러 예제
 * Copyright (c) AUISoft Co., Ltd. All rights reserved.
 *
 * AUIGrid 예제 파일입니다. AUIGrid 사용권 범위 안에서 이 파일을 복사하거나 수정하여 사용할 수 있습니다.
 * 이 허용은 이 예제 파일에만 적용되며 AUIGrid.js에는 적용되지 않습니다.
 * This is an AUIGrid sample file. You may copy and modify it for use with AUIGrid within the
 * scope of your AUIGrid license. This permission applies only to this sample file, not to AUIGrid.js.
 * License: https://github.com/aui-community/auigrid-noncommercial/blob/main/LICENSE
 */
/*
 * AUIGrid 사용자 정의 에디트 렌더러 - 별점 선택
 *
 * 별을 눌러 1~5점을 선택합니다. 확인은 적용, 취소 또는 Esc는 원래 값을 유지합니다.
 * Tab으로 버튼을 이동하고 Enter 또는 Space로 누를 수 있습니다.
 * 바깥 셀을 클릭해도 선택한 점수를 적용합니다. 데이터에는 숫자 하나를 저장합니다.
 *
 * AUIGrid.js 다음에 이 파일과 AUIGrid.RatingEditor.css를 연결합니다.
 * editRenderer: { type: "CustomEditRenderer", jsClass: AUIGrid.RatingEditor, vPosition: "bottom" }
 * 그리드에 editable: true, 칼럼에 dataType: "numeric"을 지정합니다.
 * 전체 사용 예: renderer_custom_status.html, 문서 8. 사용자 정의 렌더러 만들기
 */
window.AUIGrid.RatingEditor = window.AUIGrid.Class({
    tagName: "div",
    cssClass: "aui-grid-edit-renderer-custom aui-rating-editor",
    __score: 0,
    __focusTimer: null,

    create: function () {
        const original = this.data[this.dataField];
        this.__score = Number(original) || 0;
        // 선택하지 않고 닫아도 원래 점수가 보존됩니다.
        this.injectValue(original);
        // 현재 칼럼 정보는 엔진이 전달한 columnData에서 바로 읽습니다.
        this.element.setAttribute("role", "group");
        this.element.setAttribute("aria-label", this.columnData.headerText + " 선택");
        const stars = document.createElement("div");
        stars.className = "aui-rating-stars";
        for (let score = 1; score <= 5; score++) {
            const button = document.createElement("button");
            button.type = "button";
            button.dataset.score = score;
            button.setAttribute("aria-label", score + "점");
            stars.appendChild(button);
        }
        const actions = document.createElement("div");
        actions.className = "aui-rating-actions";
        // 데이터가 아닌 고정된 버튼만 HTML로 만듭니다.
        actions.innerHTML = '<button type="button" data-action="confirm">확인</button> <button type="button" data-action="cancel">취소</button>';
        this.element.append(stars, actions);
        this.__refreshStars();
        this.__onClick = this.__onClick.bind(this);
        this.__onKeyDown = this.__onKeyDown.bind(this);
        this.element.addEventListener("click", this.__onClick);
        this.element.addEventListener("keydown", this.__onKeyDown);
        // 그리드가 레이어를 배치한 뒤 첫 별에 포커스를 옮깁니다.
        this.__focusTimer = setTimeout(function () { stars.firstChild.focus(); }, 0);
    },

    // 별을 다시 그려도 버튼은 유지하므로 키보드 포커스가 사라지지 않습니다.
    __refreshStars: function () {
        const score = this.__score;
        this.element.querySelectorAll("[data-score]").forEach(function (button) {
            const filled = Number(button.dataset.score) <= score;
            button.textContent = filled ? "★" : "☆";
            button.classList.toggle("is-filled", filled);
            button.setAttribute("aria-pressed", Number(button.dataset.score) === score ? "true" : "false");
        });
        this.element.querySelector('[data-action="confirm"]').disabled = !Number.isInteger(score) || score < 1 || score > 5;
    },

    __onClick: function (event) {
        const button = event.target.closest("button");
        if (!button) return;
        if (button.dataset.score) {
            this.__score = Number(button.dataset.score);
            // 행 데이터를 직접 바꾸지 않고 그리드에 적용 후보만 전달합니다.
            this.injectValue(this.__score);
            this.__refreshStars();
        } else if (button.dataset.action === "confirm") {
            this.triggerEditEndEvent(this.__score);
        } else if (button.dataset.action === "cancel") {
            this.triggerEditCancelEvent();
        }
    },

    __onKeyDown: function (event) {
        // Tab, Enter, Space는 버튼의 기본 동작을 사용하고 그리드에는 전달하지 않습니다.
        event.stopPropagation();
        if (event.key === "Escape") {
            event.preventDefault();
            this.triggerEditCancelEvent();
        }
    },

    destroy: function (unload) {
        clearTimeout(this.__focusTimer);
        this.element.removeEventListener("click", this.__onClick);
        this.element.removeEventListener("keydown", this.__onKeyDown);
        this.$super.destroy(unload);
    }
}).extend(window.AUIGrid.EditRendererBase);
