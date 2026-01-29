import type { ToggleSwitchProps } from '../types';

export function ToggleSwitch({ enabled, onToggle, label }: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-sm text-gray-400 min-w-[40px]">{label}</span>
      )}
      <button
        onClick={onToggle}
        className={`toggle-switch ${enabled ? 'on' : 'off'}`}
        aria-pressed={enabled}
        aria-label={label ? `${label} toggle` : 'Toggle switch'}
      >
        <span
          className={`toggle-knob ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
      <span className={`text-xs font-bold ${enabled ? 'text-green-400' : 'text-gray-500'}`}>
        {enabled ? 'ON' : 'OFF'}
      </span>
    </div>
  );
}
