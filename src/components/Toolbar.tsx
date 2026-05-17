import { useState, useRef, useEffect } from 'react';
import type { Theme } from '../types';

interface ToolbarProps {
  themes: Theme[];
  currentThemeId: string;
  onThemeChange: (themeId: string) => void;
  darkModePreview: boolean;
  onDarkModeToggle: () => void;
  onCopyContent: () => void;
  onCopyHtml: () => void;
  onHistoryClick: () => void;
}

export default function Toolbar({
  themes,
  currentThemeId,
  onThemeChange,
  darkModePreview,
  onDarkModeToggle,
  onCopyContent,
  onCopyHtml,
  onHistoryClick,
}: ToolbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTheme =
    themes.find((t) => t.id === currentThemeId) ?? themes[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 16px',
        height: '52px',
        background: '#ffffff',
        borderBottom: '1px solid #e8e8e8',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontWeight: 'bold',
          fontSize: '16px',
          color: '#333',
          marginRight: '8px',
          whiteSpace: 'nowrap',
        }}
      >
        📝 MD2WeChat
      </div>

      {/* 历史记录 */}
      <button
        onClick={onHistoryClick}
        title="历史记录"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 10px',
          background: 'transparent',
          border: '1px solid #ddd',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '13px',
          color: '#555',
        }}
      >
        📋 历史
      </button>

      {/* 主题选择器 */}
      <div style={{ position: 'relative', marginLeft: '8px' }} ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#333',
            minWidth: '140px',
          }}
        >
          <span>{currentTheme.emoji}</span>
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {currentTheme.name}
          </span>
          <span style={{ fontSize: '10px', color: '#999' }}>▼</span>
        </button>

        {dropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              zIndex: 1000,
              width: '240px',
              overflow: 'hidden',
            }}
          >
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  onThemeChange(theme.id);
                  setDropdownOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 14px',
                  background:
                    theme.id === currentThemeId ? '#f0f7ff' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>
                  {theme.emoji}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', color: '#333', fontWeight: 'bold' }}>
                    {theme.name}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#999',
                      marginTop: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {theme.description}
                  </div>
                  {/* 色块预览 */}
                  <div style={{ display: 'flex', gap: '3px', marginTop: '5px' }}>
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '2px',
                        background: theme.colors.h1,
                        border: `1px solid ${theme.colors.hr}`,
                      }}
                    />
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '2px',
                        background: theme.colors.link,
                        border: `1px solid ${theme.colors.hr}`,
                      }}
                    />
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '2px',
                        background: theme.colors.blockquoteBg,
                        border: `1px solid ${theme.colors.blockquoteBorder}`,
                      }}
                    />
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '2px',
                        background: theme.colors.codeBlockBg,
                        border: `1px solid ${theme.colors.hr}`,
                      }}
                    />
                  </div>
                </div>
                {theme.id === currentThemeId && (
                  <span style={{ color: '#576b95', marginTop: '2px' }}>✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 暗黑模式预览开关 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginLeft: '4px',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            color: darkModePreview ? '#576b95' : '#888',
            fontWeight: darkModePreview ? 'bold' : 'normal',
          }}
        >
          {darkModePreview ? '🌙' : '☀️'} 夜间模式预览
        </span>
        <button
          onClick={onDarkModeToggle}
          style={{
            width: '40px',
            height: '22px',
            borderRadius: '11px',
            border: 'none',
            background: darkModePreview ? '#576b95' : '#ccc',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background 0.2s',
            padding: 0,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '2px',
              left: darkModePreview ? '20px' : '2px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.2s',
            }}
          />
        </button>
      </div>

      {/* 右侧复制按钮 */}
      <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
        <button
          onClick={onCopyHtml}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 14px',
            background: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#555',
          }}
        >
          {'</>'} 复制 HTML
        </button>
        <button
          onClick={onCopyContent}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 16px',
            background: '#07c160',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          📋 复制内容
        </button>
      </div>
    </div>
  );
}
