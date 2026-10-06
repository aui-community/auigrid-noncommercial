/* 모든 판본의 패키지는 공용 메뉴의 제목, 순서와 링크를 사용합니다. */
(function () {
    'use strict';
    const guide = document.getElementById('run-guide');
    document.getElementById('open-guide').addEventListener('click', function () {
        guide.open = true;
    });
    if (window.location.hash === '#run-guide') guide.open = true;

    const source = document.getElementById('nav-wrapper');
    if (!source) return;
    const catalog = document.getElementById('demo-catalog');
    const search = document.getElementById('demo-search');
    const status = document.getElementById('search-status');
    const empty = document.getElementById('empty-result');
    const categories = [];
    const showcaseEntries = [];

    // 메뉴 식별자에 기능 설명만 연결하고 제목과 URL은 메뉴를 그대로 사용합니다.
    const showcaseFeatures = {
        sh01: '셀 편집과 날짜별 집계', sh02: '트리 구조와 원가 계산',
        sh03: '그룹 헤더와 월별 데이터', sh04: '실시간 데이터 갱신',
        sh05: '병합 셀과 지표 비교', sh06: '변경 전후 데이터 대조',
        sh07: '구매 요청과 결재 흐름', sh08: '날짜별 목표와 실적',
        sh09: '반응형 밴드형 레이아웃', sh10: '밴드형 편집과 검수'
    };
    const categoryDescriptions = [
        '데이터 출력, 병합과 화면 구성', '그룹 헤더와 칼럼 설정', '합계와 사용자 수식',
        '셀 설명과 툴팁 구성', '계층 구조와 트리 탐색', '그룹별 합계와 소계',
        '조건에 맞는 데이터 추리기', '셀 값과 표시 텍스트 검색', '페이지 구성과 이동',
        '마우스 메뉴 구성', '셀 값의 다양한 시각적 표현', '입력 방식과 편집 도구',
        '셀 안의 작은 차트', '행 번호, 체크박스와 행 상태', '직접 만드는 셀 표현',
        '직접 만드는 편집 도구', '숫자, 날짜와 표시 형식', '입력 검증과 데이터 변경',
        '수정 복구와 실행 취소', '행, 열과 셀의 이동', 'Excel, PDF와 파일 저장',
        '한 행을 여러 줄로 구성', '이벤트 처리와 그리드 제어', '프레임워크와 UI 연동'
    ];

    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function section(title, description) {
        const node = element('section', 'catalog-section');
        const heading = element('div', 'section-heading');
        const text = element('div');
        const titleNode = element('h2', '', title);
        const count = element('span', 'count-badge');
        titleNode.append(count);
        text.append(titleNode, element('p', '', description));
        heading.append(text);
        node.append(heading);
        catalog.append(node);
        return { node, heading, count };
    }

    const showcase = section('쇼케이스', '여러 그리드 기능을 함께 활용한 업무 화면입니다.');
    const showcaseGrid = element('div', 'showcase-grid');
    showcase.node.append(showcaseGrid);
    const features = section('기능별 데모', '분류를 펼쳐 원하는 예제를 선택하세요.');
    const toggleAll = element('button', '', '모두 펼치기');
    toggleAll.type = 'button';
    features.heading.append(toggleAll);
    const categoryGrid = element('div', 'category-grid');
    features.node.append(categoryGrid);

    Array.from(source.querySelectorAll('.root-nav-categories > li')).forEach(function (item) {
        const label = item.querySelector(':scope > .category');
        const list = item.querySelector(':scope > ul');
        if (!label || !list) return;
        const title = label.textContent.trim();
        if (title === '쇼케이스') {
            list.querySelectorAll('a').forEach(function (link, index) {
                const card = link.cloneNode(true);
                const name = link.textContent.trim().replace(/^\d+\.\s*/, '');
                const feature = showcaseFeatures[link.parentElement.id] || 'AUIGrid 기능 활용 예제';
                card.className = 'showcase-card';
                card.replaceChildren(element('span', 'showcase-number', String(index + 1).padStart(2, '0')),
                    element('strong', '', name), element('span', 'showcase-feature', feature));
                showcaseGrid.append(card);
                showcaseEntries.push({ node: card, text: ('쇼케이스 ' + name + ' ' + feature).toLocaleLowerCase() });
            });
            return;
        }
        const match = title.match(/^(\d+)\.\s*(.*)$/);
        const number = match ? match[1] : '';
        const name = match ? match[2] : title;
        const description = categoryDescriptions[Number(number) - 1] || '';
        const card = element('details', 'category-card');
        const summary = element('summary');
        const summaryText = element('span', 'category-title');
        const count = element('span', 'category-count');
        summaryText.append(element('strong', '', name), element('span', 'category-description', description));
        summary.append(element('span', 'category-number', number.padStart(2, '0')), summaryText, count);
        card.append(summary, list);
        categoryGrid.append(card);
        const entries = Array.from(list.querySelectorAll('a')).map(function (link) {
            return { node: link.parentElement, text: (title + ' ' + link.textContent).toLocaleLowerCase() };
        });
        const groups = Array.from(list.querySelectorAll('li')).filter(function (row) {
            return row.querySelector(':scope > ul');
        });
        groups.forEach(function (row) { row.classList.add('sub-category'); });
        categories.push({ node: card, count, entries, groups, wasOpen: false });
    });
    source.remove();
    document.getElementById('search-area').hidden = false;
    const total = showcaseEntries.length + categories.reduce((sum, category) => sum + category.entries.length, 0);
    let searching = false;

    // 검색 시 일치하는 분류만 펼치며 검색을 지우면 사용자가 열어두었던 상태로 복원합니다.
    function filter() {
        const terms = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
        const active = terms.length > 0;
        const matches = text => terms.every(term => text.includes(term));
        if (active && !searching) categories.forEach(category => { category.wasOpen = category.node.open; });
        let showcaseCount = 0;
        showcaseEntries.forEach(function (entry) {
            entry.node.hidden = !matches(entry.text);
            if (!entry.node.hidden) showcaseCount++;
        });
        let featureCount = 0;
        categories.forEach(function (category) {
            let count = 0;
            category.entries.forEach(function (entry) {
                entry.node.hidden = !matches(entry.text);
                if (!entry.node.hidden) count++;
            });
            // 헤더렌더러처럼 중첩된 분류는 자식의 검색 결과가 있을 때만 표시합니다.
            category.groups.forEach(group => { group.hidden = !Array.from(group.querySelectorAll('a')).some(link => !link.parentElement.hidden); });
            category.node.hidden = count === 0;
            category.count.textContent = count + '개';
            if (active) category.node.open = count > 0;
            else if (searching) category.node.open = category.wasOpen;
            featureCount += count;
        });
        searching = active;
        showcase.count.textContent = showcaseCount;
        features.count.textContent = featureCount;
        showcase.node.hidden = showcaseCount === 0;
        features.node.hidden = featureCount === 0;
        empty.hidden = showcaseCount + featureCount > 0;
        toggleAll.hidden = active;
        status.textContent = active ? '검색 결과 ' + (showcaseCount + featureCount) + '개 / 전체 ' + total + '개' : '전체 ' + total + '개 데모';
        updateToggle();
    }

    function updateToggle() {
        toggleAll.textContent = categories.every(category => category.node.open) ? '모두 접기' : '모두 펼치기';
    }
    toggleAll.addEventListener('click', function () {
        const open = !categories.every(category => category.node.open);
        categories.forEach(category => { category.node.open = open; });
        updateToggle();
    });
    categories.forEach(category => category.node.addEventListener('toggle', updateToggle));
    search.addEventListener('input', filter);
    document.getElementById('clear-search').addEventListener('click', function () {
        search.value = '';
        filter();
        search.focus();
    });
    filter();
})();
