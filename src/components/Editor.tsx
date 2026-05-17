import { useRef, useCallback } from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onFileUpload: (content: string) => void;
}

export default function Editor({ value, onChange, onFileUpload }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const text = ev.target?.result as string;
          onFileUpload(text);
        };
        reader.readAsText(file);
      }
    },
    [onFileUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const text = ev.target?.result as string;
          onFileUpload(text);
        };
        reader.readAsText(file);
      }
      // 重置 input 以便重复选择同一文件
      e.target.value = '';
    },
    [onFileUpload]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newValue);
        // 恢复光标位置
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        });
      }
    },
    [value, onChange]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#1e1e1e',
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* 编辑器头部工具栏 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: '#252526',
          borderBottom: '1px solid #333',
          flexShrink: 0,
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 10px',
            background: '#333',
            color: '#ccc',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
            border: '1px solid #444',
          }}
        >
          📂 打开文件
          <input
            type="file"
            accept=".md,.markdown,.txt"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </label>
        <span style={{ color: '#666', fontSize: '12px' }}>或拖拽 .md 文件到编辑区</span>
      </div>

      {/* 文本编辑区 */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="在此输入 Markdown 内容..."
          spellCheck={false}
          style={{
            width: '100%',
            height: '100%',
            padding: '16px',
            border: 'none',
            outline: 'none',
            resize: 'none',
            background: '#1e1e1e',
            color: '#d4d4d4',
            fontSize: '14px',
            fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
            lineHeight: '1.6',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  );
}
