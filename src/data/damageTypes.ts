import type { DamageTypeInfo } from '../types';

export const DAMAGE_TYPES: DamageTypeInfo[] = [
  { id: 'AD', label: 'AD', koreanLabel: '물리', color: 'text-orange-400' },
  { id: 'AP', label: 'AP', koreanLabel: '마법', color: 'text-purple-400' },
];

export const getDamageTypeInfo = (typeId: string): DamageTypeInfo | undefined => {
  return DAMAGE_TYPES.find((type) => type.id === typeId);
};
