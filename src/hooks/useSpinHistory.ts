import { useState, useCallback, useEffect } from 'react';
import type { SpinHistoryItem } from '../components/SpinHistory';

const STORAGE_KEY = 'lol-slot-spin-history';
const MAX_HISTORY = 5;

export function useSpinHistory() {
  const [history, setHistory] = useState<SpinHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }, [history]);

  // 새 스핀 결과 추가
  const addToHistory = useCallback((champion: string, lane: string, type: string) => {
    const newItem: SpinHistoryItem = {
      champion,
      lane,
      type,
      timestamp: Date.now(),
    };

    setHistory(prev => {
      const updated = [newItem, ...prev];
      return updated.slice(0, MAX_HISTORY);
    });
  }, []);

  // 히스토리 초기화
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
  };
}
