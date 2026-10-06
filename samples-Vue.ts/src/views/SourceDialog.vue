<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import CodeBlock from './CodeBlock.vue';
import { demoSources } from '../demoSources';
import './source-files.css';
const props = defineProps<{ path: string; title: string }>();
const emit = defineEmits(['close']);
const dialog = ref<HTMLDialogElement | null>(null);
const code = ref('');
const status = ref('소스를 불러오는 중입니다.');
const selected = ref(0);
const files = computed(() => {
    const entry = demoSources[props.path];
    return [entry, ...(entry.files || [])];
});
const source = computed(() => files.value[selected.value] || files.value[0]);
watch(
    () => props.path,
    () => {
        selected.value = 0;
    }
);
// 소스 파일을 바꾸거나 창을 닫으면 이전 요청이 새 화면을 덮지 않게 합니다.
watch(
    source,
    (file, previous, onCleanup) => {
        let active = true;
        code.value = '';
        status.value = '소스를 불러오는 중입니다.';
        file.load()
            .then((text) => {
                if (active) {
                    code.value = text;
                    status.value = '';
                }
            })
            .catch(() => {
                if (active) status.value = '소스를 불러오지 못했습니다. 창을 닫고 다시 열어 주세요.';
            });
        onCleanup(() => {
            active = false;
        });
    },
    { immediate: true }
);
onMounted(() => dialog.value?.showModal());
</script>
<template>
    <dialog
        class="sample-source-dialog"
        ref="dialog"
        aria-labelledby="sample-source-title"
        @close="emit('close')"
        @click.self="dialog?.close()"
    >
        <div class="sample-source-heading">
            <h2 id="sample-source-title">소스 보기</h2>
            <button type="button" @click="dialog?.close()" autofocus>닫기</button>
        </div>
        <p>{{ title }}</p>
        <label v-if="files.length > 1" class="source-file-select"
            >소스 파일<select v-model="selected">
                <option v-for="(file, index) in files" :key="file.file" :value="index">{{ file.file }}</option>
            </select></label
        >
        <code class="sample-source-file">{{ source.file }}</code>
        <p v-if="status" role="status">{{ status }}</p>
        <CodeBlock v-else :code="code" :language="source.language || 'markup'" />
    </dialog>
</template>
