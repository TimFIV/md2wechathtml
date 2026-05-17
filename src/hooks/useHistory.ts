import { useState, useEffect, useCallback } from 'react';
import { get, set, del, keys } from 'idb-keyval';
import type { HistoryItem } from '../types';

const STORAGE_KEY_PREFIX = 'md2wechat_';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '无标题';
}

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  // 加载所有历史记录
  const loadAll = useCallback(async () => {
    try {
      const allKeys = await keys();
      const historyKeys = allKeys.filter(
        (k) => typeof k === 'string' && k.startsWith(STORAGE_KEY_PREFIX)
      );
      const records: HistoryItem[] = [];
      for (const key of historyKeys) {
        const item = await get<HistoryItem>(key);
        if (item) records.push(item);
      }
      records.sort((a, b) => b.updatedAt - a.updatedAt);
      setItems(records);
    } catch {
      // IndexedDB 不可用时静默失败
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const save = useCallback(
    async (content: string, themeId: string, existingId?: string) => {
      const now = Date.now();

      // 如果已有 ID，检查内容是否真的变了
      if (existingId) {
        const existing = items.find((i) => i.id === existingId);
        if (existing && existing.content === content && existing.themeId === themeId) {
          return existingId; // 内容没变，跳过保存
        }
      }

      const id = existingId || generateId();
      const existing = items.find((i) => i.id === existingId);
      const item: HistoryItem = {
        id,
        title: extractTitle(content),
        content,
        themeId,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
      };
      await set(`${STORAGE_KEY_PREFIX}${id}`, item);
      await loadAll();
      return id;
    },
    [items, loadAll]
  );

  const remove = useCallback(
    async (id: string) => {
      await del(`${STORAGE_KEY_PREFIX}${id}`);
      await loadAll();
    },
    [loadAll]
  );

  const clearAll = useCallback(async () => {
    const allKeys = await keys();
    const historyKeys = allKeys.filter(
      (k) => typeof k === 'string' && k.startsWith(STORAGE_KEY_PREFIX)
    );
    for (const key of historyKeys) {
      await del(key);
    }
    setItems([]);
  }, []);

  return { items, save, remove, clearAll };
}
