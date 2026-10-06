import { useEffect, useRef, useState } from 'react';
import CodeBlock from './CodeBlock';
import { demoSources } from '../demoSources';
import './source-files.css';

// 실행 컴포넌트와 보조 파일을 선택해 원문을 읽습니다. 이전 요청의 완료는 무시합니다.
export default function SourceDialog({ path, title, onClose }) {
    const dialog = useRef(null);
    const [selected, setSelected] = useState(0);
    const [code, setCode] = useState('');
    const [status, setStatus] = useState('소스를 불러오는 중입니다.');
    const entry = demoSources[path];
    const files = [entry, ...(entry.files || [])];
    const source = files[selected] || entry;
    useEffect(() => {
        dialog.current?.showModal();
    }, []);
    useEffect(() => {
        setSelected(0);
    }, [path]);
    useEffect(() => {
        let active = true;
        setCode('');
        setStatus('소스를 불러오는 중입니다.');
        source
            .load()
            .then((text) => {
                if (active) {
                    setCode(text);
                    setStatus('');
                }
            })
            .catch(() => {
                if (active) setStatus('소스를 불러오지 못했습니다. 창을 닫고 다시 열어 주세요.');
            });
        return () => {
            active = false;
        };
    }, [source]);
    return (
        <dialog
            className="sample-source-dialog"
            ref={dialog}
            aria-labelledby="sample-source-title"
            onClose={onClose}
            onClick={(event) => {
                if (event.target === event.currentTarget) dialog.current?.close();
            }}
        >
            <div className="sample-source-heading">
                <h2 id="sample-source-title">소스 보기</h2>
                <button type="button" onClick={() => dialog.current?.close()} autoFocus>
                    닫기
                </button>
            </div>
            <p>{title}</p>
            {files.length > 1 && (
                <label className="source-file-select">
                    소스 파일
                    <select value={selected} onChange={(event) => setSelected(Number(event.target.value))}>
                        {files.map((file, index) => (
                            <option key={file.file} value={index}>
                                {file.file}
                            </option>
                        ))}
                    </select>
                </label>
            )}
            <code className="sample-source-file">{source.file}</code>
            {status ? <p role="status">{status}</p> : <CodeBlock language={source.language || 'jsx'}>{code}</CodeBlock>}
        </dialog>
    );
}
