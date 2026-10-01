<template>
	<pre><code :class="`language-${language}`" ref="codeBlock">
    <slot />
  </code></pre>
</template>

<script setup>
	import { onMounted, ref, nextTick } from 'vue';
	import Prism from 'prismjs';

	// Prism CSS 테마 불러오기 (다크 테마 예제)
	import 'prismjs/themes/prism-tomorrow.css';

	// 필요한 언어 컴포넌트 불러오기
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-css';
	import 'prismjs/components/prism-markup';

	const props = defineProps({
		language: {
			type: String,
			default: 'javascript'
		}
	});

	const codeBlock = ref(null);

	const highlight = () => {
		if (codeBlock.value) {
			Prism.highlightElement(codeBlock.value);
		}
	};

	onMounted(() => {
		nextTick(highlight); // slot 내용이 렌더링된 후 하이라이트
	});
</script>

<style scoped>
	pre {
		border-radius: 8px;
		padding: 1rem;
		overflow-x: auto;
	}
</style>
