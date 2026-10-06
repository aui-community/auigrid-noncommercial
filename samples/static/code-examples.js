/* 문서와 데모의 표시용 코드만 다룹니다. 제품 생성, 데이터 요청과 이벤트는 각 예제에 둡니다. */
(function () {
    'use strict';
    var useSourceViewer = document.currentScript.hasAttribute('data-source-viewer');
    var productSelector = '.aui-grid, [class^="aui-grid-"], [class*=" aui-grid-"]';
    var records = new WeakMap();

    // 기존 예제의 언어를 보존합니다. 언어 표기가 없던 pre/xmp에만 보수적인 기본값을 사용합니다.
    function languageOf(pre, source) {
        // 동적으로 지정한 언어를 이전 강조가 pre에 남긴 클래스보다 우선합니다.
        if (pre.dataset.language) return pre.dataset.language;
        var code = pre.querySelector('code');
        var match = ((code && code.className) || pre.className).match(/\blanguage-([\w-]+)/);
        if (match) return match[1];
        if (/^\s*</.test(source)) return 'markup';
        if (/^\s*(?:\/\*[\s\S]*?\*\/\s*)?[.#][\w-]+[^{}]*\{/.test(source)) return 'css';
        return 'javascript';
    }

    // 강조 토큰을 복사하지 않습니다. 실패하면 원문을 선택하여 직접 복사할 수 있게 합니다.
    async function copyCode(pre, feedback) {
        var code = pre.querySelector('code') || pre;
        try {
            await navigator.clipboard.writeText(code.textContent.trim());
            feedback.textContent = '복사했습니다.';
        } catch (error) {
            var range = document.createRange();
            range.selectNodeContents(code);
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            feedback.textContent = '선택한 코드를 Ctrl+C 또는 ⌘C로 복사하세요.';
        }
    }

    function enhance(pre) {
        if (pre.closest(productSelector) || pre.hasAttribute('data-plain-text')) return;
        var state = records.get(pre);
        if (!state) {
            var frame = document.createElement('div');
            frame.className = 'demo-code-frame';
            pre.before(frame);
            frame.appendChild(pre);
            var tools = document.createElement('div');
            tools.className = 'demo-code-tools';
            var feedback = document.createElement('span');
            feedback.className = 'demo-code-feedback';
            feedback.setAttribute('role', 'status');
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'demo-code-copy';
            button.textContent = '코드 복사';
            button.addEventListener('click', function () { copyCode(pre, feedback); });
            tools.append(feedback, button);
            frame.appendChild(tools);
            pre.tabIndex = 0;
            if (!pre.hasAttribute('aria-label')) pre.setAttribute('aria-label', '코드 예제');
            state = { source: null, language: null };
            records.set(pre, state);
            // 제품 DOM이나 문서 전체를 감시하지 않고 기존 동적 코드 영역만 관찰합니다.
            if (pre.id || pre.hasAttribute('data-dynamic-code')) {
                var observer = new MutationObserver(function () { enhance(pre); });
                observer.observe(pre, { childList: true, characterData: true, subtree: true });
            }
        }
        var source = pre.textContent;
        var language = languageOf(pre, source);
        if (source === state.source && language === state.language && pre.firstElementChild && pre.firstElementChild.tagName === 'CODE') return;
        state.source = source;
        state.language = language;
        var code = document.createElement('code');
        code.className = 'language-' + language;
        code.textContent = source;
        pre.replaceChildren(code);
        if (window.Prism && window.Prism.languages[language]) window.Prism.highlightElement(code);
    }

    function initExamples(root) {
        // pre 안의 xmp를 따로 감싸지 않습니다. 원문과 중첩 예제를 한 번만 처리합니다.
        root.querySelectorAll('pre, xmp').forEach(function (element) {
            if (element.closest(productSelector) || element.parentElement.closest('pre, xmp')) return;
            if (element.hasAttribute('aria-live') || element.getAttribute('role') === 'status' || /(?:log|events|status|state|result|selection|clipboard|cache)/i.test(element.id)) return;
            var pre = element;
            if (element.tagName === 'XMP') {
                pre = document.createElement('pre');
                Array.from(element.attributes).forEach(function (attr) { pre.setAttribute(attr.name, attr.value); });
                pre.textContent = element.textContent;
                element.replaceWith(pre);
            }
            enhance(pre);
        });
    }

    function createSourceViewer() {
        var host = document.getElementById('main_top');
        if (!host) return;
        var actions = document.createElement('span');
        actions.className = 'demo-source-actions';
        var open = document.createElement('button');
        open.type = 'button'; open.className = 'btn'; open.textContent = '전체 소스 보기';
        actions.appendChild(open); host.appendChild(actions);
        var dialog = document.createElement('dialog');
        dialog.className = 'demo-source-dialog';
        dialog.setAttribute('aria-labelledby', 'demo-source-title');
        var heading = document.createElement('div'); heading.className = 'demo-source-heading';
        var title = document.createElement('h2'); title.id = 'demo-source-title'; title.textContent = '전체 HTML 소스';
        var close = document.createElement('button'); close.type = 'button'; close.className = 'btn'; close.textContent = '닫기';
        heading.append(title, close);
        var note = document.createElement('p');
        note.textContent = '서버가 반환한 HTML입니다. 현재 데모와 같은 폴더에 저장하고 연결된 js, style, data 등 상대 경로의 자원을 함께 사용하세요.';
        var status = document.createElement('p'); status.className = 'demo-source-status'; status.setAttribute('role', 'status');
        var retry = document.createElement('button'); retry.type = 'button'; retry.className = 'btn'; retry.textContent = '다시 불러오기'; retry.hidden = true;
        var pre = document.createElement('pre'); pre.dataset.language = 'markup';
        dialog.append(heading, note, status, retry, pre); document.body.appendChild(dialog);
        enhance(pre);
        var loaded = false, loading = false;
        async function loadSource() {
            if (loading) return;
            loading = true; retry.hidden = true; status.textContent = '소스를 불러오는 중입니다.';
            try {
                var response = await fetch(location.href, { cache: 'no-store' });
                if (!response.ok) throw new Error(String(response.status));
                // HTML을 실행하지 않고 텍스트로 넣어 include가 처리된 실제 응답을 그대로 제공합니다.
                pre.textContent = await response.text();
                enhance(pre); status.textContent = ''; loaded = true;
            } catch (error) { status.textContent = '소스를 불러오지 못했습니다. 연결 상태를 확인한 뒤 다시 시도하세요.'; retry.hidden = false; }
            finally { loading = false; }
        }
        open.addEventListener('click', function () { dialog.showModal(); if (!loaded) loadSource(); });
        close.addEventListener('click', function () { dialog.close(); });
        retry.addEventListener('click', loadSource);
    }

    function init() { initExamples(document); if (useSourceViewer) createSourceViewer(); }
    window.AUIDemoCode = { highlight: enhance, refresh: initExamples };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
}());
