interface HtmlModalProps {
  open: boolean;
  html: string;
  onClose: () => void;
}

export default function HtmlModal({ open, html, onClose }: HtmlModalProps) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        {/* 头部 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #e8e8e8',
            flexShrink: 0,
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>HTML 源码</h3>
          <button
            onClick={onClose}
            style={{
              padding: '4px 10px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#999',
            }}
          >
            ✕
          </button>
        </div>

        {/* HTML 内容 */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <textarea
            readOnly
            value={html}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '300px',
              maxHeight: '60vh',
              padding: '16px',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '12px',
              fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
              lineHeight: '1.5',
              background: '#f8f8f8',
              color: '#333',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 底部提示 */}
        <div
          style={{
            padding: '10px 20px',
            borderTop: '1px solid #e8e8e8',
            background: '#fafafa',
            fontSize: '12px',
            color: '#999',
            textAlign: 'center',
            borderRadius: '0 0 12px 12px',
          }}
        >
          请使用 Ctrl+A 全选，然后 Ctrl+C 复制
        </div>
      </div>
    </div>
  );
}
