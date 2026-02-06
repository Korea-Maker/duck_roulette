import { useEffect } from 'react';

/**
 * ESC 키를 누르면 콜백을 실행합니다.
 */
export function useEscapeKey(isActive: boolean, onEscape: () => void) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        onEscape();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isActive, onEscape]);
}
