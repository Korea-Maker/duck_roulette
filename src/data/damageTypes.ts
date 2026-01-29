import type { DamageTypeInfo } from '../types';

export const DAMAGE_TYPES: DamageTypeInfo[] = [
  {
    id: 'AD',
    label: 'AD',
    koreanLabel: '물리',
    color: 'text-orange-400',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTYgMkwyMCAxMEgyOEwyMiAxNkwyNiAyNkgxNkw2IDI2TDEwIDE2TDQgMTBIMTJMMTYgMloiIGZpbGw9IiNmYjkyM2MiIHN0cm9rZT0iI2ZiN2MwZCIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo='
  },
  {
    id: 'AP',
    label: 'AP',
    koreanLabel: '마법',
    color: 'text-purple-400',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjgiIHI9IjQiIGZpbGw9IiNjMDg0ZmMiLz4KICA8cGF0aCBkPSJNMTYgMTJMMTAgMjJIMjJMMTYgMTJaIiBmaWxsPSIjYTA4NGZjIi8+CiAgPGNpcmNsZSBjeD0iMTAiIGN5PSIyMiIgcj0iMyIgZmlsbD0iI2MwODRmYyIvPgogIDxjaXJjbGUgY3g9IjIyIiBjeT0iMjIiIHI9IjMiIGZpbGw9IiNjMDg0ZmMiLz4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjI2IiByPSIzIiBmaWxsPSIjYzA4NGZjIi8+Cjwvc3ZnPgo='
  },
];

export const getDamageTypeInfo = (typeId: string): DamageTypeInfo | undefined => {
  return DAMAGE_TYPES.find((type) => type.id === typeId);
};
