import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Toolbar from './components/Toolbar';
import HistoryPanel from './components/HistoryPanel';
import Toast from './components/Toast';
import HtmlModal from './components/HtmlModal';
import { themes, getThemeById } from './lib/themes';
import { renderMarkdown, applyInlineStyles } from './lib/markdown';
import { useHistory } from './hooks/useHistory';

const DEFAULT_MD = `# 欢迎使用 MD2WeChatHtml

> 这是一款将 Markdown 转换为微信公众号排版的工具。

## 基础语法

这是**加粗**、*斜体*、~~删除线~~ 的示例。

这是一个[链接示例](https://mp.weixin.qq.com)。

### 列表

- 无序列表项 1
- 无序列表项 2
  - 嵌套列表项
  - 嵌套列表项

1. 有序列表项 1
2. 有序列表项 2
3. 有序列表项 3

### 任务列表

- [x] 已完成任务
- [ ] 未完成任务

### 代码

行内代码 \`console.log('hello')\` 示例。

\`\`\`javascript
function hello() {
  console.log('Hello, MD2WeChatHtml!');
  return true;
}
\`\`\`

### 表格

| 功能 | 状态 | 说明 |
|------|------|------|
| Markdown 解析 | ✅ 完成 | markdown-it |
| 主题系统 | ✅ 完成 | 10套主题 |
| 代码高亮 | ✅ 完成 | shiki |
| 一键复制 | ✅ 完成 | Clipboard API |

### 引用

> 生活不止眼前的苟且，还有诗和远方的田野。
> —— 高晓松

### 分割线

---

### 图片占位

![示例图片](https://example.com/image.png)

### 视频占位

![video](https://example.com/video.mp4)

### 脚注

这是一段带脚注的文字[^1]。

[^1]: 这是脚注内容。

### 数学公式

行内公式 $E = mc^2$ 示例。

块级公式：

$$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
$$

---

*祝你使用愉快！*
`;

function App() {
  const [markdown, setMarkdown] = useState(DEFAULT_MD);
  const [themeId, setThemeId] = useState('default');
  const [darkModePreview, setDarkModePreview] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [htmlModalOpen, setHtmlModalOpen] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [splitRatio, setSplitRatio] = useState(40);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const { items: historyItems, save: saveHistory, remove: removeHistory, clearAll: clearHistory } = useHistory();
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentDocIdRef = useRef<string | null>(null);
  const hasUserEditRef = useRef(false);

  // 当前主题
  const theme = useMemo(() => getThemeById(themeId), [themeId]);

  // 渲染 HTML — 始终基于当前主题，暗黑预览通过 CSS filter 模拟
  const renderedHtml = useMemo(() => {
    const rawHtml = renderMarkdown(markdown);
    return applyInlineStyles(rawHtml, theme);
  }, [markdown, theme]);

  // 自动保存到历史 — 用户编辑后才保存，避免默认内容污染历史
  const autoSave = useCallback(async () => {
    if (!hasUserEditRef.current) return;
    const id = await saveHistory(markdown, themeId, currentDocIdRef.current ?? undefined);
    if (id) currentDocIdRef.current = id;
  }, [markdown, themeId, saveHistory]);

  // 删除历史时，如果删的是当前文档，重置 currentDocId
  const handleDeleteHistory = useCallback((id: string) => {
    if (currentDocIdRef.current === id) {
      currentDocIdRef.current = null;
    }
    removeHistory(id);
  }, [removeHistory]);

  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(autoSave, 2000);
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [autoSave]);

  // Toast
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  // 复制内容（富文本）
  const handleCopyContent = useCallback(async () => {
    const container = document.createElement('div');
    container.innerHTML = renderedHtml;
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    try {
      // 尝试 Clipboard API
      const blob = new Blob([renderedHtml], { type: 'text/html' });
      const item = new ClipboardItem({ 'text/html': blob });
      await navigator.clipboard.write([item]);
      showToast('已复制，可直接去公众号后台粘贴');
    } catch {
      // 降级：选中 DOM 后用 execCommand
      const range = document.createRange();
      range.selectNodeContents(container);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      try {
        document.execCommand('copy');
        showToast('已复制，可直接去公众号后台粘贴');
      } catch {
        showToast('复制失败，请手动复制 HTML');
      }
      selection?.removeAllRanges();
    } finally {
      document.body.removeChild(container);
    }
  }, [renderedHtml, showToast]);

  // 复制 HTML 源码
  const handleCopyHtml = useCallback(() => {
    setGeneratedHtml(renderedHtml);
    setHtmlModalOpen(true);
  }, [renderedHtml]);

  // 文件上传 — 视为新文档，重置 ID
  const handleFileUpload = useCallback((content: string) => {
    setMarkdown(content);
    currentDocIdRef.current = null;
  }, []);

  // 加载历史 — 继承文档 ID，后续自动保存会更新这条记录
  const handleLoadHistory = useCallback((item: { id: string; content: string; themeId: string }) => {
    setMarkdown(item.content);
    setThemeId(item.themeId || 'default');
    currentDocIdRef.current = item.id;
  }, []);

  // 分屏拖动
  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const ratio = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitRatio(Math.max(20, Math.min(60, ratio)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      {/* 顶部工具栏 */}
      <Toolbar
        themes={themes}
        currentThemeId={themeId}
        onThemeChange={setThemeId}
        darkModePreview={darkModePreview}
        onDarkModeToggle={() => setDarkModePreview((v) => !v)}
        onCopyContent={handleCopyContent}
        onCopyHtml={handleCopyHtml}
        onHistoryClick={() => setHistoryOpen(true)}
      />

      {/* 主内容区 */}
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          cursor: isDragging ? 'col-resize' : 'default',
        }}
      >
        {/* 左侧编辑器 */}
        <div
          style={{
            width: `${splitRatio}%`,
            height: '100%',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <Editor
            value={markdown}
            onChange={(v) => {
              hasUserEditRef.current = true;
              setMarkdown(v);
            }}
            onFileUpload={handleFileUpload}
          />
        </div>

        {/* 拖动分隔条 */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            width: '6px',
            height: '100%',
            background: isDragging ? '#576b95' : '#ddd',
            cursor: 'col-resize',
            flexShrink: 0,
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => {
            if (!isDragging) (e.target as HTMLElement).style.background = '#aaa';
          }}
          onMouseLeave={(e) => {
            if (!isDragging) (e.target as HTMLElement).style.background = '#ddd';
          }}
        />

        {/* 右侧预览 */}
        <div
          ref={previewRef}
          style={{
            flex: 1,
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <Preview html={renderedHtml} darkModePreview={darkModePreview} />
        </div>
      </div>

      {/* 历史记录面板 */}
      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        items={historyItems}
        onLoad={handleLoadHistory}
        onDelete={handleDeleteHistory}
        onClearAll={clearHistory}
      />

      {/* Toast */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* HTML 弹窗 */}
      <HtmlModal
        open={htmlModalOpen}
        html={generatedHtml}
        onClose={() => setHtmlModalOpen(false)}
      />
    </div>
  );
}

export default App;
