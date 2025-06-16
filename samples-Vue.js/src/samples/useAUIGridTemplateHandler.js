// useAUIGridTemplateHandler.js

/**
 * AUIGrid TemplateRenderer에서 사용할 함수를 전역(window)에 등록합니다.
 * @param {string} name 전역 함수 이름 (예: "myApplyBtnClick")
 * @param {Function} handlerFn 실제 핸들러 함수
 */
export function registerAUIGridTemplateHandler(name, handlerFn) {
	if (typeof handlerFn !== 'function') {
		console.warn(`[AUIGrid] '${name}' 등록 실패: handlerFn은 함수가 아닙니다.`);
		return;
	}

	if (typeof window === 'undefined') {
		console.error(`[AUIGrid] '${name}' 등록 실패: window 객체가 존재하지 않습니다.`);
		return;
	}

	Object.defineProperty(window, name, {
		value: function (...args) {
			try {
				handlerFn(...args);
			} catch (e) {
				console.error(`[AUIGrid] '${name}' 실행 중 오류:`, e);
			}
		},
		writable: true,
		configurable: true
	});
}

/**
 * 등록된 AUIGrid TemplateRenderer 전역 함수를 해제합니다.
 * @param {string} name 해제할 함수 이름
 */
export function unregisterAUIGridTemplateHandler(name) {
	if (typeof window !== 'undefined' && Object.prototype.hasOwnProperty.call(window, name)) {
		delete window[name];
	}
}
