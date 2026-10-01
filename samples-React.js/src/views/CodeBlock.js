import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';

// Prism CSS 테마 불러오기 (다크 테마 예제)
import 'prismjs/themes/prism-tomorrow.css';

// 필요한 언어 컴포넌트 불러오기
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';

const CodeBlock = ({ language = 'javascript', children }) => {
	const codeRef = useRef(null);

	useEffect(() => {
		if (codeRef.current) {
			Prism.highlightElement(codeRef.current);
		}
	}, [children]);

	return (
		<pre style={{ borderRadius: '8px', padding: '1rem', overflowX: 'auto' }}>
			<code className={`language-${language}`} ref={codeRef}>
				{children}
			</code>
		</pre>
	);
};

export default CodeBlock;
