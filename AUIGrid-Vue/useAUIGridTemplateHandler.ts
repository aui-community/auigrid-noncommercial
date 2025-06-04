// useAUIGridTemplateHandler.ts

type GlobalHandler = (...args: any[]) => void;

/**
 * AUIGrid 템플릿 렌더러(TemplateRenderer)에서 사용하는 함수를 등록합니다.
 * @param name 등록할 템플릿 함수 이름 (ex: "myApplyBtnClick")
 * @param handlerFn 실제 호출될 핸들러 함수
 */
export function registerAUIGridTemplateHandler(name: string, handlerFn: GlobalHandler): void {
	if (typeof handlerFn !== 'function') {
		console.warn(`registerAUIGridTemplateHandler: '${name}' 는 함수가 아닙니다.`);
		return;
	}
	(window as any)[name] = (...args: any[]) => {
		try {
			handlerFn(...args);
		} catch (e) {
			console.error(`[${name}] 템플릿 렌더러 함수 실행 중 오류 발생:`, e);
		}
	};
}

/**
 * AUIGrid 템플릿 렌더러(TemplateRenderer)에서 사용하는 함수가 등록된 경우 해제합니다.
 * @param name 해제할 함수 이름
 */
export function unregisterAUIGridTemplateHandler(name: string): void {
	if ((window as any)[name]) {
		delete (window as any)[name];
	}
}
