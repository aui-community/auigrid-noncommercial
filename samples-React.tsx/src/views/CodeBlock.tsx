import React, { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
// Prism 1.30.0 Tomorrow와 예제에 사용하는 문법만 불러옵니다.
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

export default function CodeBlock({ language = 'javascript', children }: { language?: string; children: string }) {
	const codeRef = useRef<HTMLElement>(null);
	const [feedback, setFeedback] = useState('');
	// React가 토큰 자식을 관리하지 않도록 원문 갱신과 강조를 이 영역에서만 처리합니다.
	useEffect(() => {
		if (!codeRef.current) return;
		codeRef.current.textContent = children;
		Prism.highlightElement(codeRef.current);
	}, [children, language]);
	// 토큰 HTML 대신 원문을 복사하고, 권한이 없으면 직접 복사할 영역을 선택합니다.
	async function copyCode() {
		try {
			await navigator.clipboard.writeText(children.trim());
			setFeedback('복사했습니다.');
		} catch (error) {
			const element = codeRef.current;
			if (!element) return;
			const range = document.createRange();
			range.selectNodeContents(element);
			const selection = window.getSelection();
			if (selection) { selection.removeAllRanges(); selection.addRange(range); }
			setFeedback('선택한 코드를 Ctrl+C 또는 ⌘C로 복사하세요.');
		}
	}
	return (
		<div className="demo-code-frame">
			<pre tabIndex={0} aria-label="코드 예제"><code className={`language-${language}`} ref={codeRef} /></pre>
			<div className="demo-code-tools">
				<span className="demo-code-feedback" role="status">{feedback}</span>
				<button type="button" className="demo-code-copy" onClick={copyCode}>코드 복사</button>
			</div>
		</div>
	);
}
