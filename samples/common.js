document.addEventListener('DOMContentLoaded', function () {
		document.removeEventListener('DOMContentLoaded', arguments.callee, false);
		if (typeof init === 'function') init();
}, false);

// AUIGrid.defaultProps 에 공통적인 속성을 설정합니다.
// AUIGrid.defaultProps 설정은 AUIGrid.js 정의 이후 선언해야 합니다.
// 선언하면 AUIGrid 를 생성 할 때 기본적으로 defaultProps 를 확장하여 생성합니다.
// 따라서 매 페이지의 그리드를 생성할 때 공통적인 사항을 여기서 작성하십시오.
if (typeof window !== 'undefined' && typeof window.AUIGrid !== 'undefined') {
	window.AUIGrid.defaultProps = {
		// 모바일인 경우 자동으로 작은 사이즈의 스크롤을 표시할지 여부
		// 여기서 생성했기 때문에 앞으로 모든 그리드는 autoScrollSize: true 를 상속 받아 적용됨.
		autoScrollSize: true,
		
		// selectionChange 이벤트 발생 시 간소화된 정보만 받을지 여부를 지정합니다.
		// 간소화한 경우 selectionChange 이벤트의 파라메터 요소인 event.selectedItems 를 포함시키지 않습니다.
		// 성능 향상을 위해 true 설정을 권장합니다.
		simplifySelectionEvent: true
	};
}

//데이터 요청하여 그리드에 데이터 삽입합니다.
function requestGridData(url, gridId = '#grid_wrap') {
	AUIGrid.showAjaxLoader(gridId);
	fetch(url)
		.then((res) => {
			if (!res.ok) throw new Error('데이터 요청 실패');
			return res.json();
		})
		.then((data) => {
			AUIGrid.removeAjaxLoader(gridId);
			AUIGrid.setGridData(gridId, data);
		})
		.catch((err) => console.error('데이터 로딩 오류:', err));
}

function changeLocation(href) {
	location.href = href;
}

// async confirm
function asyncConfirm(text) {
	return new Promise(function (resolve) {
		const wrapper = document.createElement('div');
		wrapper.className = 'popup-layer';
		const popup = document.createElement('div');
		popup.className = 'popup-confirm';
		wrapper.appendChild(popup);

		const textDiv = document.createElement('div');
		textDiv.textContent = text;
		popup.appendChild(textDiv);

		const footerDiv = document.createElement('div');
		footerDiv.className = 'popup-confirm-footer';
		const okBtn = document.createElement('button');
		const cancelBtn = document.createElement('button');
		okBtn.className = 'btn';
		cancelBtn.className = 'btn';
		okBtn.textContent = '확인';
		cancelBtn.textContent = '취소';

		footerDiv.appendChild(okBtn);
		footerDiv.appendChild(cancelBtn);
		popup.appendChild(footerDiv);
		window.document.body.appendChild(wrapper);

		const onClickOk = function () {
			okBtn.removeEventListener('click', onClickOk);
			cancelBtn.removeEventListener('click', onClickCancel);
			resolve(true);
			wrapper.remove();
		};

		const onClickCancel = function () {
			okBtn.removeEventListener('click', onClickOk);
			cancelBtn.removeEventListener('click', onClickCancel);
			resolve(false);
			wrapper.remove();
		};

		okBtn.addEventListener('click', onClickOk);
		cancelBtn.addEventListener('click', onClickCancel);
	});
}
