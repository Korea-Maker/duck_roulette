import { useState } from 'react';
import type { SlotItem as SlotItemType } from '../types';

interface SlotItemProps {
  item: SlotItemType;
  isActive?: boolean;
}

export function SlotItem({ item, isActive = false }: SlotItemProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get color filter based on item color class
  const getColorFilter = (colorClass: string | undefined) => {
    switch (colorClass) {
      case 'text-red-400':
        return 'brightness(0) saturate(100%) invert(56%) sepia(94%) saturate(2664%) hue-rotate(327deg) brightness(102%) contrast(92%)';
      case 'text-green-400':
        return 'brightness(0) saturate(100%) invert(79%) sepia(26%) saturate(2089%) hue-rotate(75deg) brightness(93%) contrast(88%)';
      case 'text-blue-400':
        return 'brightness(0) saturate(100%) invert(61%) sepia(89%) saturate(2372%) hue-rotate(191deg) brightness(101%) contrast(101%)';
      case 'text-yellow-400':
        return 'brightness(0) saturate(100%) invert(84%) sepia(52%) saturate(1830%) hue-rotate(358deg) brightness(103%) contrast(104%)';
      case 'text-pink-400':
        return 'brightness(0) saturate(100%) invert(70%) sepia(87%) saturate(3295%) hue-rotate(296deg) brightness(102%) contrast(101%)';
      case 'text-orange-400':
      case 'text-purple-400':
        return 'none'; // No filter for damage type icons (they're already colored)
      default:
        return 'none';
    }
  };

  const colorFilter = getColorFilter(item.color);

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
