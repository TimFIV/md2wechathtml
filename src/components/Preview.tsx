import { useEffect, useRef } from 'react';

interface PreviewProps {
  html: string;
  darkModePreview: boolean;
}

export default function Preview({ html, darkModePreview }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              word-break: break-word;
              -webkit-font-smoothing: antialiased;
            }
            ::-webkit-scrollbar { width: 4px; }
            ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 2px; }
            /* 表格滚动容器：table 被包在 div[data-table-wrapper] 里 */
            div[data-table-wrapper] {
              width: 100%;
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
              margin: 1em 0;
            }
            div[data-table-wrapper]::-webkit-scrollbar { height: 3px; }
            div[data-table-wrapper]::-webkit-scrollbar-thumb { background: #ccc; border-radius: 2px; }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `);
    doc.close();
  }, [html]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: darkModePreview ? '#1a1a1a' : '#e8e8e8',
        overflow: 'auto',
        padding: '20px 0',
        transition: 'background 0.3s',
      }}
    >
      {/* 手机模型框 */}
      <div
        style={{
          width: '375px',
          minHeight: '812px',
          background: darkModePreview ? '#000' : '#fff',
          borderRadius: '24px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          flexShrink: 0,
          border: `8px solid ${darkModePreview ? '#2a2a2a' : '#333'}`,
          transition: 'background 0.3s, border-color 0.3s',
        }}
      >
        <iframe
          ref={iframeRef}
          title="preview"
          sandbox="allow-same-origin"
          style={{
            width: '100%',
            border: 'none',
            display: 'block',
            minHeight: '796px',
            // 暗黑模式预览：用 CSS filter 模拟微信夜间模式
            ...(darkModePreview
              ? {
                  filter:
                    'invert(0.88) hue-rotate(180deg) brightness(0.95)',
                }
              : {}),
            transition: 'filter 0.3s',
          }}
          onLoad={(e) => {
            const iframe = e.target as HTMLIFrameElement;
            const body = iframe.contentDocument?.body;
            if (body) {
              iframe.style.height = body.scrollHeight + 'px';
            }
          }}
        />
      </div>
    </div>
  );
}
