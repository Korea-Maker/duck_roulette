import { useState } from 'react';
import type { SlotItem as SlotItemType } from '../types';
import { getColorFilter } from '../utils/colorFilters';

interface SlotItemProps {
  item: SlotItemType;
  isActive?: boolean;
}

export function SlotItem({ item, isActive = false }: SlotItemProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const colorFilter = getColorFilter(item.color || '');

  return (
    <div
      className={`slot-item h-16 px-4 ${item.color || 'text-white'} ${
        isActive ? 'scale-110' : ''
      }`}
    >
      {item.image && !imageError ? (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-700/50 rounded-lg animate-pulse" />
            )}
            <img
              src={item.image}
              alt={item.label}
              className={`w-10 h-10 object-contain transition-all duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                filter: colorFilter,
                ...(isActive && {
                  filter: `${colorFilter} drop-shadow(0 0 8px currentColor)`,
                })
              }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </div>
          <span className="truncate">{item.label}</span>
        </div>
      ) : (
        <span className="truncate">{item.label}</span>
      )}
    </div>
  );
}
