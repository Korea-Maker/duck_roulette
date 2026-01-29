import type { SlotItem as SlotItemType } from '../types';

interface SlotItemProps {
  item: SlotItemType;
  isActive?: boolean;
}

export function SlotItem({ item, isActive = false }: SlotItemProps) {
  return (
    <div
      className={`slot-item h-16 px-4 ${item.color || 'text-white'} ${
        isActive ? 'scale-110' : ''
      }`}
    >
      <span className="truncate">{item.label}</span>
    </div>
  );
}
