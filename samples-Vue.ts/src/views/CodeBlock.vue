<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Prism from 'prismjs';
// Prism 1.30.0 Tomorrow와 예제에 사용하는 문법만 불러옵니다.
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

const props = defineProps<{ code: string; language?: string }>();
const codeBlock = ref<HTMLElement | null>(null);
const feedback = ref('');

// 슬롯 DOM과 Prism 토큰의 충돌을 피하고 원문이 변경된 경우에만 다시 강조합니다.
function highlight() {
	if (!codeBlock.value) return;
	codeBlock.value.textContent = props.code;
	Prism.highlightElement(codeBlock.value);
}
onMounted(highlight);
watch(() => [props.code, props.language], highlight, { flush: 'post' });
	// 토큰 HTML 대신 원문을 복사하고, 권한이 없으면 직접 복사할 영역을 선택합니다.
	async function copyCode() {
		try {
			await navigator.clipboard.writeText(props.code.trim());
			feedback.value = '복사했습니다.';
		} catch (error) {
			const element = codeBlock.value;
			if (!element) return;
			const range = document.createRange();
			range.selectNodeContents(element);
			const selection = window.getSelection();
			if (selection) { selection.removeAllRanges(); selection.addRange(range); }
			feedback.value = '선택한 코드를 Ctrl+C 또는 ⌘C로 복사하세요.';
		}
	}
</script>
<template>
	<div class="demo-code-frame">
		<pre tabindex="0" aria-label="코드 예제"><code :class="`language-${language || 'markup'}`" ref="codeBlock"></code></pre>
		<div class="demo-code-tools">
			<span class="demo-code-feedback" role="status">{{ feedback }}</span>
			<button type="button" class="demo-code-copy" @click="copyCode">코드 복사</button>
		</div>
	</div>
</template>
