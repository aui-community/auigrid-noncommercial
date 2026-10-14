/* 제품 패키지 전용 데이터 어댑터입니다. PHP 없이 실행할 수 있도록 로컬 예제
 * 데이터로 응답하며 엔진 및 브라우저의 전역 fetch 함수는 변경하지 않습니다. */
(function () {
    const base = new URL('./', document.currentScript.src);
    const cache = new Map();
    function readJSON(file) {
        if (!cache.has(file)) {
            cache.set(file, fetch(new URL('data/' + file, base)).then(response => {
                if (!response.ok) throw new Error('패키지 예제 데이터 로딩 실패: ' + file);
                return response.json();
            }).catch(error => { cache.delete(file); throw error; }));
        }
        return cache.get(file);
    }
    const json = data => new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
    const xmlEscape = value => String(value).replace(/[&<>"']/g, value => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[value]);
    // 조회 버튼의 행 수와 페이지 경계를 유지합니다. 반복 데이터에도 고유 ID를 부여합니다.
    async function rows(parameters) {
        const count = Number(parameters.get('count') ?? 100);
        const page = Number(parameters.get('page') ?? 1);
        if (!Number.isSafeInteger(count) || count < 0 || count > 500000 || !Number.isSafeInteger(page) || page < 0) throw new Error('예제 데이터의 행 수 또는 페이지를 확인하십시오.');
        const seed = await readJSON('normal_100.json');
        const offset = Math.max(0, page - 1) * count;
        return Array.from({ length: count }, (_, index) => ({ ...seed[(offset + index) % seed.length], id: '#Cust' + (offset + index) }));
    }
    // 서버 페이징 화면의 패키지 전용 모의 응답입니다. WebDemo는 실제 PHP 요청을 사용합니다.
    // 동일 자료와 검색 순서를 사용하되 패키지 본문에서 로컬 시연임을 명시합니다.
    async function serverPaging(parameters) {
        const seed = await readJSON('normal_100.json');
        const totalRows = 10003, pageSize = 20;
        const search = (parameters.get('search') || '').trim().toLowerCase();
        const country = parameters.get('country') || '';
        const minPrice = parameters.get('minPrice') || '';
        const sort = JSON.parse(parameters.get('sort') || '[]');
        const allowed = ['id', 'name', 'country', 'product', 'quantity', 'price', 'date'];
        const requestedPage = Number(parameters.get('page') || 1);
        if (!Number.isSafeInteger(requestedPage) || requestedPage < 1 || requestedPage > 1000000 ||
            Number(parameters.get('pageSize') || 20) !== 20 || search.length > 80 ||
            (country && !seed.some(row => row.country === country)) ||
            (minPrice !== '' && (!/^\d{1,8}$/.test(minPrice) || Number(minPrice) > 10000000)) ||
            !Array.isArray(sort) || sort.length > allowed.length || new Set(sort.map(entry => entry?.dataField)).size !== sort.length ||
            sort.some(entry => !entry || !allowed.includes(entry.dataField) || ![1, -1].includes(entry.sortType))) {
            return new Response(JSON.stringify({ error: '페이지 또는 검색 조건을 확인하십시오.' }), { status: 400 });
        }
        const rows = [];
        for (let index = 0; index < totalRows; index++) {
            const source = seed[index % seed.length];
            if ((country && source.country !== country) || (minPrice !== '' && source.price < Number(minPrice)) ||
                (search && !source.name.toLowerCase().includes(search) && !source.product.toLowerCase().includes(search))) continue;
            rows.push({ ...source, id: 'ORD-' + String(index + 1).padStart(5, '0'), price: Number(source.price), quantity: Number(source.quantity) });
        }
        const compare = (a, b) => a === b ? 0 : a < b ? -1 : 1;
        if (sort.length) rows.sort((a, b) => {
            for (const entry of sort) {
                const order = compare(a[entry.dataField], b[entry.dataField]);
                if (order) return order * entry.sortType;
            }
            return compare(a.id, b.id);
        });
        const total = rows.length, totalPages = Math.ceil(total / pageSize);
        const page = Math.min(requestedPage, Math.max(1, totalPages));
        return json({ items: rows.slice((page - 1) * pageSize, page * pageSize), totalRows, total, page, pageSize, totalPages });
    }
    window.AUIGridPackageData = {
        async fetch(input, options) {
            const url = new URL(input, location.href);
            if (url.origin !== base.origin) return fetch(input, options);
            const path = url.pathname;
            const parameters = url.searchParams;
            if (path === new URL('data/getServerPaging.php', base).pathname) return serverPaging(parameters);
            if (path === new URL('data/getJson.php', base).pathname) return json(await rows(parameters));
            if (path === new URL('data/getXml.php', base).pathname) {
                const data = await rows(parameters);
                return new Response('<?xml version="1.0" encoding="UTF-8"?><rows>' + data.map(row => '<row>' + Object.entries(row).map(([key, value]) => `<${key}>${xmlEscape(value)}</${key}>`).join('') + '</row>').join('') + '</rows>', { headers: { 'Content-Type': 'application/xml' } });
            }
            if (path === new URL('data/getCsv.php', base).pathname) {
                const fields = ['id', 'name', 'country', 'flag', 'product', 'color', 'price', 'quantity', 'date'];
                const quote = value => '"' + String(value).replace(/"/g, '""') + '"';
                return new Response((await rows(parameters)).map(row => fields.map(field => quote(row[field])).join(',')).join('\r\n'), { headers: { 'Content-Type': 'text/csv' } });
            }
            if (path === new URL('data/getJsonMasters.php', base).pathname) return json(await readJSON('getMaster.json'));
            if (path === new URL('data/getJsonDetails.php', base).pathname) {
                const id = parameters.get('id');
                return json((await readJSON('getDetails.json')).map((row, index) => ({ ...row, custId: id, orderId: `${id}-${String(index + 1).padStart(3, '0')}` })));
            }
            if (path === new URL('data/get_my_children.php', base).pathname) {
                const id = parameters.get('pid');
                // 자식 요청/응답 흐름은 유지하며 예제는 세 단계에서 끝냅니다.
                return json(id.split('-').length >= 3 ? [] : [0, 1].map(index => ({ id: `${id}-${index}`, name: `하위 작업 ${index + 1}` })));
            }
            if (path === new URL('../../blog/api/search_books.php', base).pathname) {
                // 실제 도서 검색 API가 아닌 패키지용 예제임을 본문 안내에 명시합니다.
                const books = [
                    { title: 'JavaScript 시작하기', isbn: 'SAMPLE-JS-001', author: '예제 저자', publisher: '예제 출판사' },
                    { title: 'TypeScript 실습', isbn: 'SAMPLE-TS-002', author: '예제 저자', publisher: '예제 출판사' },
                    { title: 'React와 Vue 화면 만들기', isbn: 'SAMPLE-UI-003', author: '예제 저자', publisher: '예제 출판사' }
                ];
                const query = (parameters.get('query') || '').toLowerCase();
                const found = books.filter(book => (book.title + book.isbn).toLowerCase().includes(query));
                return json(parameters.has('title') ? found.map(book => book.title) : found);
            }
            return fetch(input, options);
        }
    };
}());
