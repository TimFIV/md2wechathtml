import { useState } from 'react';
import type { HistoryItem } from '../types';

interface HistoryPanelProps {
  open: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

function HistoryItemRow({
  item,
  onLoad,
  onDelete,
  onClose,
}: {
  item: HistoryItem;
  onLoad: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      style={{
        padding: '14px 20px',
        borderBottom: '1px solid #f0f0f0',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      onClick={() => {
        onLoad(item);
        onClose();
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = '#f8f9fa';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'transparent';
      }}
    >
      {/* 标题 */}
      <div
        style={{
          fontSize: '14px',
          color: '#333',
          fontWeight: 'bold',
          marginBottom: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          paddingRight: '30px',
        }}
      >
        {item.title}
      </div>

      {/* 时间 */}
      <div
        style={{
          fontSize: '12px',
          color: '#999',
          marginBottom: '6px',
        }}
      >
        {new Date(item.updatedAt).toLocaleString('zh-CN', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>

      {/* 预览片段 */}
      <div
        style={{
          fontSize: '12px',
          color: '#aaa',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginBottom: '8px',
        }}
      >
        {item.content.slice(0, 80)}...
      </div>

      {/* 操作栏 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            color: '#576b95',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
          }}
        >
          📂 点击加载
        </span>

        {confirmDelete ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginLeft: 'auto',
            }}
          >
            <span style={{ fontSize: '11px', color: '#e74c3c' }}>确认删除?</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
                setConfirmDelete(false);
              }}
              style={{
                padding: '3px 10px',
                background: '#e74c3c',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                color: '#fff',
                fontWeight: 'bold',
              }}
            >
              删除
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(false);
              }}
              style={{
                padding: '3px 10px',
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                color: '#666',
              }}
            >
              取消
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDelete(true);
            }}
            style={{
              marginLeft: 'auto',
              padding: '3px 10px',
              background: 'transparent',
              border: '1px solid #eee',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              color: '#999',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#e74c3c';
              (e.currentTarget as HTMLElement).style.color = '#e74c3c';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#eee';
              (e.currentTarget as HTMLElement).style.color = '#999';
            }}
            title="删除此记录"
          >
            🗑️ 删除
          </button>
        )}
      </div>
    </div>
  );
}

export default function HistoryPanel({
  open,
  onClose,
  items,
  onLoad,
  onDelete,
  onClearAll,
}: HistoryPanelProps) {
  return (
    <>
      {/* 遮罩层 */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 1999,
          }}
        />
      )}

      {/* 侧边面板 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: open ? 0 : '-380px',
          width: '380px',
          height: '100vh',
          background: '#fff',
          boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
          zIndex: 2000,
          transition: 'left 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
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
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>
              📋 历史记录
            </h3>
            {items.length > 0 && (
              <span style={{ fontSize: '11px', color: '#999' }}>
                共 {items.length} 篇
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {items.length > 0 && (
              <button
                onClick={onClearAll}
                style={{
                  padding: '4px 10px',
                  background: 'transparent',
                  border: '1px solid #e74c3c',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#e74c3c',
                }}
              >
                清空全部
              </button>
            )}
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
        </div>

        {/* 列表 */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {items.length === 0 ? (
            <div
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: '#ccc',
                fontSize: '14px',
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
              暂无历史记录
              <br />
              <span style={{ fontSize: '12px' }}>
                编辑内容后会自动保存到这里
              </span>
            </div>
          ) : (
            items.map((item) => (
              <HistoryItemRow
                key={item.id}
                item={item}
                onLoad={onLoad}
                onDelete={onDelete}
                onClose={onClose}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
