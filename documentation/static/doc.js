document.addEventListener(
	'DOMContentLoaded',
	() => {
		const iQuery = document.getElementById('i_query');
		if (iQuery) {
			let debounceTimer = null;

			iQuery.onkeyup = function (e) {
				clearTimeout(debounceTimer); // 이전 타이머 제거
				debounceTimer = setTimeout(function () {
					const value = String(iQuery.value).toLowerCase();
					const trs = document.querySelectorAll('#summaryTableStyle tr');
					let count = 0;

					for (let i = 0, len = trs.length; i < len; i++) {
						const v = trs[i];
						const id = v.getAttribute('id');
						if (id) {
							if (id.toLowerCase().indexOf(value) === -1) {
								v.style.display = 'none';
								count++;
							} else {
								v.style.display = '';
							}
						}
					}

					document.getElementById('desc_top').style.display = count > 0 ? 'none' : '';
				}, 500); // 500ms 딜레이
			};
		}
	},
	false
);
