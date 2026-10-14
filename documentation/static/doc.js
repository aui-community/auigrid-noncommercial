document.addEventListener('DOMContentLoaded', () => {
	const input = document.getElementById('i_query');
	const table = document.getElementById('summaryTableStyle');
	if (!input || !table) return;

	const intro = document.getElementById('desc_top');
	const status = document.getElementById('search-status');
	// 대소문자, 연속 공백 및 복사한 한글의 조합 방식이 달라도 같은 검색어로 처리합니다.
	const normalize = value => String(value).normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim();
	// 항목 본문은 한 번만 읽습니다. 설명 안의 중첩 표와 코드 원문은 변경하지 않습니다.
	const entries = Array.from(table.rows).filter(row => row.id).map(row => ({
		row,
		text: normalize([
			row.id,
			...Array.from(row.cells[0].querySelectorAll('a[id]'), alias => alias.id),
			row.textContent
		].join(' '))
	}));
	let timer = null;

	function filter() {
		// 여러 단어는 이름과 설명 전체에서 모두 포함된 항목을 찾습니다.
		const query = normalize(input.value);
		const terms = query ? query.split(' ') : [];
		let count = 0;
		for (const entry of entries) {
			const matches = terms.every(term => entry.text.includes(term));
			entry.row.style.display = matches ? '' : 'none';
			if (matches) count++;
		}
		if (intro) intro.style.display = count < entries.length ? 'none' : '';
		if (status) status.textContent = query
			? `검색 결과 ${count} / ${entries.length}개${count === 0 ? '. 일치하는 항목이 없습니다.' : ''}`
			: `전체 ${entries.length}개 항목`;
	}

	// 키 입력뿐 아니라 붙여넣기와 검색창 지우기도 같은 경로로 반영합니다.
	input.addEventListener('input', () => {
		clearTimeout(timer);
		timer = setTimeout(filter, 500);
	});
	input.addEventListener('keydown', event => {
		if (event.key !== 'Escape') return;
		event.preventDefault();
		clearTimeout(timer);
		input.value = '';
		filter();
	});
	filter();
});
